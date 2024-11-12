const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");

function generateDTOClasses(jsonObj, className, outputPath) {
  // Create the directory if it doesn't exist
  // console.log("This ", this.fs);
  // this.fs.mkdirp(outputPath);
  if (jsonObj === null || jsonObj === undefined) return;

  console.log("jsonObj ", jsonObj);
  console.log("className ", className);
  console.log("Out ", outputPath);
  fs.mkdirSync(outputPath, { recursive: true });

  // Generate the DTO class content
  const { classContent, importStatements } = createDTOClass(jsonObj, className);

  // Write the DTO class to a TypeScript file (.ts)
  const classFilePath = path.join(outputPath, `${className}.ts`);
  fs.writeFileSync(classFilePath, `${importStatements}\n${classContent}`);

  // Recursively generate nested DTO classes and add import statements
  for (const [key, value] of Object.entries(jsonObj)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      const nestedClassName = capitalizeFirstLetter(snakeToCamel(key)) + "DTO";
      generateDTOClasses(value, nestedClassName, outputPath);
    }
  }
}

function createDTOClass(jsonObj, className) {
  let classFields = "";
  let importStatements = "";

  // Generate constructor parameters and class fields with type inference
  const constructorParams = Object.keys(jsonObj)
    .map(key => {
      const camelCaseKey = snakeToCamel(key);
      const type = inferType(jsonObj[key]);

      if (type.endsWith("DTO")) {
        importStatements += `import { ${type} } from './${type}';\n`;
      }

      return `${camelCaseKey}: ${type}`;
    })
    .join(", ");

  classFields = Object.keys(jsonObj)
    .map(key => `${snakeToCamel(key)} = ${snakeToCamel(key)};`)
    .join("\n    ");

  const classContent = `export class ${className} {
constructor({ ${constructorParams} }: { ${constructorParams} }) {
  ${classFields}
}
}
`;

  return { classContent, importStatements };
}

function inferType(value) {
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
    return `${inferType(value[0])}[]`; // Assumes homogenous arrays
  }

  if (typeof value === "object") {
    return `${capitalizeFirstLetter(snakeToCamel(Object.keys(value)[0]))}DTO`;
  }

  return "any"; // Fallback type
}

function snakeToCamel(snakeStr) {
  return snakeStr.replace(/(_\w)/g, matches => matches[1].toUpperCase());
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "dtoName",
        message: "What is the name of your DTO?",
        default: "",
        validate: input => {
          if (input.trim() === "") {
            return "DTO name cannot be empty!";
          }

          return true;
        }
      },
      // {
      //   type: "input",
      //   name: "jsonPath",
      //   message: "Enter json data",
      //   default: "",
      //   validate: input => {
      //     if (input.trim() === "") {
      //       return "DTO name cannot be empty!";
      //     }

      //     try {
      //       JSON.parse(input);
      //       return true;
      //       // eslint-disable-next-line no-unused-vars
      //     } catch (e) {
      //       return "Invalid JSON. Please enter a valid JSON string.";
      //     }
      //   }
      // },
      {
        type: "input",
        name: "outputPath",
        message:
          "Where would you like to save the component (e.g., src/shared/dto)?",
        default: "src/shared/dto"
      }
    ]);

    this.answers = answers;
  }

  writing() {
    const outputPath = this.answers.outputPath;

    // Read the JSON file
    const jsonContent = {
      id: 1,
      userName: "JohnDoe",
      isActive: true
    };
    console.log("Output path ", outputPath);
    // Generate DTOs recursively with TypeScript and imports
    generateDTOClasses(jsonContent, "RootDTO", "src/shared/dto");
  }
};
