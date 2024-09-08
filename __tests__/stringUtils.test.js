"use strict";
const toCamelCase = require("../generators/app/utils/toCamelCase");
const toPascalCase = require("../generators/app/utils/toPascalCase");

describe("String Utility Functions", () => {
  test("toCamelCase converts string to camel case", () => {
    expect(toCamelCase("my component")).toBe("myComponent");
    expect(toCamelCase("My Component")).toBe("myComponent");
    expect(toCamelCase("my   component")).toBe("myComponent");
    expect(toCamelCase("")).toBe(""); // Edge case: empty string
    expect(toCamelCase("singleword")).toBe("singleword"); // Edge case: single word
  });

  test("toPascalCase converts string to pascal case", () => {
    expect(toPascalCase("my component")).toBe("MyComponent");
    expect(toPascalCase("My Component")).toBe("MyComponent");
    expect(toPascalCase("my   component")).toBe("MyComponent");
    expect(toPascalCase("")).toBe(""); // Edge case: empty string
    expect(toPascalCase("singleword")).toBe("Singleword"); // Edge case: single word
  });
});
