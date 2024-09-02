"use strict";
const helpers = require("../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2, ctx }) => {
  command2.command("watch-admin").option("--browser <name>", "Open the browser", true).description("Start the admin development server").action((...args) => helpers.runAction("watch-admin", action)(...args, ctx));
};
module.exports = command;
//# sourceMappingURL=command.js.map
