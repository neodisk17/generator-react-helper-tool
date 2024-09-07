"use strict";
const path = require("path");
const helpers = require("yeoman-test");

describe("generator-react-helper-tool:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ someAnswer: true });
  });
});
