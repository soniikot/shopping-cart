"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("configuration:restore").alias("config:restore").description("Restore configurations of your application").option("-f, --file <file>", "Input file, default input is stdin").option("-s, --strategy <strategy>", 'Strategy name, one of: "replace", "merge", "keep"').action(helpers.runAction("configuration:restore", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
