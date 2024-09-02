"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("configuration:dump").alias("config:dump").description("Dump configurations of your application").option("-f, --file <file>", "Output file, default output is stdout").option("-p, --pretty", "Format the output JSON with indentation and line breaks", false).action(helpers.runAction("configuration:dump", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
