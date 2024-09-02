"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("hooks:list").description("List all the application hooks").action(helpers.runAction("hooks:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
