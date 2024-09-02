"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const outdent = require("outdent");
const prettierFile = {
  name: ".prettierrc",
  contents: outdent.outdent`
      {
        "endOfLine": 'lf',
        "tabWidth": 2,
        "printWidth": 100,
        "singleQuote": true,
        "trailingComma": 'es5',
      }
    `
};
const prettierIgnoreFile = {
  name: ".prettierignore",
  contents: outdent.outdent`
      dist
      coverage
    `
};
exports.prettierFile = prettierFile;
exports.prettierIgnoreFile = prettierIgnoreFile;
//# sourceMappingURL=prettier.js.map
