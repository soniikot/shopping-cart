"use strict";
const action = require("./action.js");
const command = ({ command: command2, ctx }) => {
  command2.command("plugin:init").description("Create a new plugin at a given path").argument("[path]", "path to the plugin", "./src/plugins/my-plugin").option("-d, --debug", "Enable debugging mode with verbose logs", false).option("--silent", "Don't log anything", false).action((path, options) => {
    return action(path, options, ctx);
  });
};
module.exports = command;
//# sourceMappingURL=command.js.map
