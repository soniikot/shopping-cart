"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("console").description("Open the Strapi framework console").action(helpers.runAction("console", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
