"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("report").description("Get system stats for debugging and submitting issues").option("-u, --uuid", "Include Project UUID").option("-d, --dependencies", "Include Project Dependencies").option("--all", "Include All Information").action(helpers.runAction("report", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
