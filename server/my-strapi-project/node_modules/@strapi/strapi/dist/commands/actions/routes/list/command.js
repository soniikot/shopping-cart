"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("routes:list").description("List all the application routes").action(helpers.runAction("routes:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
