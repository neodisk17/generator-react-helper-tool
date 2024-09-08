const Generator = require("yeoman-generator");
const path = require("path");
const toCamelCase = require("../utils/toCamelCase");
const toPascalCase = require("../utils/toPascalCase");

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "viewName",
        message: "What is the name of your view?",
        default: "MyView",
        validate: input => {
          if (input.trim() === "") {
            return "View name cannot be empty!";
          }

          return true;
        }
      }
    ]);

    this.camelCaseName = toCamelCase(answers.viewName);
    this.pascalCaseName = toPascalCase(answers.viewName);

    const pathAnswers = await this.prompt([
      {
        type: "input",
        name: "savePath",
        message: "Where would you like to save the view (e.g., src/views)?",
        default: "src/views"
      }
    ]);

    this.savePath = pathAnswers.savePath;
  }

  writing() {
    const destinationFolder = path.join(this.savePath, this.pascalCaseName);
    const destinationFile = path.join(destinationFolder, "index.tsx");
    const scssFile = path.join(destinationFolder, `${this.camelCaseName}.scss`);

    this.fs.copyTpl(
      this.templatePath("view.tpl"),
      this.destinationPath(destinationFile),
      { viewName: this.pascalCaseName, camelCaseName: this.camelCaseName }
    );
    this.fs.copyTpl(
      this.templatePath("scss.tpl"),
      this.destinationPath(scssFile)
    );
  }
};
