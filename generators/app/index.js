const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "list",
        name: "type",
        message: "Hi There, What do you want to generate today?",
        choices: ["Component", "View", "ViewModel"],
        default: "Component"
      }
    ]);
    console.log("Answer is ", answers);
    this.selectedType = answers.type.toLowerCase();
  }

  configuring() {
    if (["component", "view", "viewmodel"].includes(this.selectedType)) {
      this.composeWith(require.resolve(`./${this.selectedType}`));
    } else {
      this.log("Invalid choice, please try again.");
    }
  }
};
