"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("inquirer");
const commander = require("commander");
require("chalk");
require("lodash/fp");
require("boxen");
const forceOption = new commander.Option(
  "--force",
  `Automatically answer "yes" to all prompts, including potentially destructive requests, and run non-interactively.`
);
exports.forceOption = forceOption;
//# sourceMappingURL=commander.js.map
