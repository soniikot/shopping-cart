"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("telemetry:disable").description("Disable anonymous telemetry and metadata sending to Strapi analytics").action(helpers.runAction("telemetry:disable", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
