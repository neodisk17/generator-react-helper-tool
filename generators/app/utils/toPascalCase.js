const toPascalCase = input =>
  input
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, match => match.toUpperCase())
    .replace(/\s+/g, ""); // Remove spaces

module.exports = toPascalCase;
