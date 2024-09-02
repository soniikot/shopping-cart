"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("install [plugins...]").description("Install a Strapi plugin").action(helpers.runAction("install", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
