"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2, ctx }) => {
  command2.command("plugin:watch:link").description("Recompiles your plugin automatically on changes and runs yalc push --publish").option("-d, --debug", "Enable debugging mode with verbose logs", false).option("--silent", "Don't log anything", false).action((...args) => helpers.runAction("plugin:watch:link", action)(...args, ctx));
};
module.exports = command;
//# sourceMappingURL=command.js.map
