const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.choices = ["Component", "View", "Model"];
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "list",
        name: "type",
        message: "Hi There, What do you want to generate today?",
        choices: this.choices,
        default: "Component"
      }
    ]);
    this.selectedType = answers.type;
  }

  configuring() {
    if (this.choices.includes(this.selectedType)) {
      this.composeWith(require.resolve(`./${this.selectedType.toLowerCase()}`));
    } else {
      this.log("Invalid choice, please try again.");
    }
  }
};
