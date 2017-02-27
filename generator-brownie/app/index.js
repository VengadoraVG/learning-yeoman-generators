var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  personality : function () {
    console.log('generating brownies personality folder! :O');

    var prompt = require('prompt'),
        dir = 'personality';

    this.fs.copy(
      this.templatePath('personality/'),
      this.destinationRoot() + '/personality'
    );

    prompt.start();
    prompt.get(['name', 'color'], ( function (context) { 
      // closure! needed the context for retrieving the file's directory!
      return function (err, result) {
        // prompt.get's callback...
        var fs = require('fs');
        
        fs.readFile(context.templatePath('ponie.js'), 'utf8', (function (context, promptInput) {
          return function (err, data) { 
            // fs.readFile's callback...
            var esprima = require('esprima'),
                escodegen = require('escodegen'),
                obj = esprima.parse(data);

            obj.body[0].expression.right.properties[0].value.value = promptInput.name;
            obj.body[0].expression.right.properties[2].value.value = promptInput.color;

            fs.writeFileSync(context.destinationRoot() + "/ponie.js", escodegen.generate(obj), 'utf8');
          }
        })(context, result));
      };
    })(this));
  }
});
