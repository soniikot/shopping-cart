"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("middlewares:list").description("List all the application middlewares").action(helpers.runAction("middlewares:list", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
