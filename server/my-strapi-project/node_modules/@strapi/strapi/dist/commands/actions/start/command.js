"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("start").description("Start your Strapi application").action(helpers.runAction("start", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
