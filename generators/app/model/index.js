const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");

function prepareModelData(jsonObj, className) {
  const fields = Object.entries(jsonObj).map(([key, value]) => {
    const camelCaseKey = snakeToCamel(key);
    const type = inferType(value, key);
    return {
      name: camelCaseKey,
      type: type,
      apiName: key
    };
  });

  const constructorParams = fields
    .map(field => `${field.name}: ${field.type}`)
    .join(", ");

  const imports = new Set();
  fields.forEach(field => {
    if (field.type.includes("Model")) {
      // Handle both array and single types
      const modelName = field.type.replace("[]", "");
      if (modelName !== className) {
        // Prevent self-import
        imports.add(modelName);
      }
    }
  });

  return {
    className,
    fields,
    constructorParams,
    imports: Array.from(imports)
      .map(imp => `import { ${imp} } from './${imp}';`)
      .join("\n")
  };
}

function generateModelClasses(jsonObj, className, outputPath) {
  if (jsonObj === null || jsonObj === undefined) return;

  const capitalizedClassName = capitalizeFirstLetter(className);
  fs.mkdirSync(outputPath, { recursive: true });

  // Prepare data for template
  const modelData = prepareModelData(jsonObj, capitalizedClassName);

  // Generate the model file
  this.fs.copyTpl(
    this.templatePath("model.ts.ejs"),
    this.destinationPath(path.join(outputPath, `${capitalizedClassName}.ts`)),
    {
      ...modelData,
      imports: modelData.imports
    }
  );

  // Recursively generate nested models
  for (const [key, value] of Object.entries(jsonObj)) {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          typeof value[0] === "object" &&
          value[0] !== null
        ) {
          const nestedClassName =
            capitalizeFirstLetter(snakeToCamel(key)) + "Model";
          generateModelClasses.call(
            this,
            value[0],
            nestedClassName,
            outputPath
          );
        }
      } else {
        const nestedClassName =
          capitalizeFirstLetter(snakeToCamel(key)) + "Model";
        generateModelClasses.call(this, value, nestedClassName, outputPath);
      }
    }
  }
}

function inferType(value, key) {
  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    if (typeof value[0] === "object" && value[0] !== null) {
      const nestedClassName =
        capitalizeFirstLetter(snakeToCamel(key)) + "Model";
      return `${nestedClassName}[]`;
    }

    return `${inferType(value[0], key)}[]`;
  }

  if (typeof value === "object" && value !== null) {
    const nestedClassName = capitalizeFirstLetter(snakeToCamel(key)) + "Model";
    return nestedClassName;
  }

  return "any";
}

function snakeToCamel(snakeStr) {
  return snakeStr.replace(/(_\w)/g, matches => matches[1].toUpperCase());
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.sourceRoot(path.join(__dirname, "templates"));
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "dtoName",
        message: "What is the name of your DTO class?",
        default: "",
        validate: input => {
          if (input.trim() === "") {
            return "DTO name cannot be empty!";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "jsonContent",
        message: "Enter your JSON data:",
        default: "",
        validate: input => {
          if (input.trim() === "") {
            return "JSON content cannot be empty!";
          }

          try {
            JSON.parse(input);
            return true;
          } catch (e) {
            console.error("Error is ", e);
            return "Invalid JSON. Please enter a valid JSON string.";
          }
        }
      },
      {
        type: "input",
        name: "outputPath",
        message:
          "Where would you like to save the DTOs (e.g., src/shared/dto)?",
        default: "src/shared/dto"
      }
    ]);

    this.answers = answers;
  }

  writing() {
    const { outputPath, dtoName, jsonContent } = this.answers;

    try {
      const parsedJson = JSON.parse(jsonContent);
      const className = dtoName.endsWith("Model") ? dtoName : dtoName + "Model";
      generateModelClasses.call(this, parsedJson, className, outputPath);
    } catch (error) {
      this.log.error("Error generating models:", error);
    }
  }
};
