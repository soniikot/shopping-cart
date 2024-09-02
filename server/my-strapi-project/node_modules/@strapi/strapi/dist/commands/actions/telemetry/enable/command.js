"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("telemetry:enable").description("Enable anonymous telemetry and metadata sending to Strapi analytics").action(helpers.runAction("telemetry:enable", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
