"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

describe("generator-react-helper-tool:app", () => {
  describe("Component Generator", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app/component"))
        .withPrompts({
          componentName: "MyComponent",
          savePath: "src/components"
        });
    });

    it("creates files for the component", () => {
      return assert.file([
        "src/components/MyComponent/index.tsx",
        "src/components/MyComponent/myComponent.scss"
      ]);
    });

    it("contains the correct component name in the template", () => {
      return assert.fileContent(
        "src/components/MyComponent/index.tsx",
        /const MyComponent: FC<MyComponentProps> = \(props\) => {/
      );
    });
  });

  describe("View Generator", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app/view"))
        .withPrompts({ viewName: "MyView", savePath: "src/views" });
    });

    it("creates files for the view", () => {
      return assert.file([
        "src/views/MyView/index.tsx",
        "src/views/MyView/myView.scss"
      ]);
    });

    it("contains the correct view name in the template", () => {
      return assert.fileContent(
        "src/views/MyView/index.tsx",
        /const MyViewView = \(\) => {/
      );
    });
  });
});
