const Generator = require("yeoman-generator");
const path = require("path");

const toCamelCase = input =>
  input
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, "");

const toPascalCase = input =>
  input
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, match => match.toUpperCase())
    .replace(/\s+/g, "");

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "componentName",
        message: "What is the name of your component?",
        default: "",
        validate: input => {
          if (input.trim() === "") {
            return "Component name cannot be empty!";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "savePath",
        message:
          "Where would you like to save the component (e.g., src/shared/components)?",
        default: "src/shared/components"
      }
    ]);

    this.camelCaseName = toCamelCase(answers.componentName);
    this.pascalCaseName = toPascalCase(answers.componentName);

    this.componentName = answers.componentName;
    this.savePath = answers.savePath;
  }

  writing() {
    const destinationFolder = path.join(this.savePath, this.pascalCaseName);
    const destinationFile = path.join(destinationFolder, "index.tsx");
    const scssFile = path.join(destinationFolder, `${this.camelCaseName}.scss`);

    this.fs.copyTpl(
      this.templatePath("component.js"),
      this.destinationPath(destinationFile),
      { componentName: this.pascalCaseName, camelCaseName: this.camelCaseName }
    );
    this.fs.copyTpl(
      this.templatePath("component.scss"),
      this.destinationPath(scssFile)
    );
  }
};
