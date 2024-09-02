"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const outdent = require("outdent");
const editorConfigFile = {
  name: ".editorconfig",
  contents: outdent.outdent`
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    
    [{package.json,*.yml}]
    indent_style = space
    indent_size = 2
    
    [*.md]
    trim_trailing_whitespace = false
    `
};
exports.editorConfigFile = editorConfigFile;
//# sourceMappingURL=editorConfig.js.map
