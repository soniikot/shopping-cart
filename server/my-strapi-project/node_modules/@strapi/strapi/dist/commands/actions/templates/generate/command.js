"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("templates:generate <directory>").description("Generate template from Strapi project").action(helpers.runAction("templates:generate", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
