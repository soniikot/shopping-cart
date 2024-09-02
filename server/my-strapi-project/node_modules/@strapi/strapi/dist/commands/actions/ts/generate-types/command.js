"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("ts:generate-types").description(`Generate TypeScript typings for your schemas`).option("--verbose", `[DEPRECATED] The verbose option has been replaced by debug`, false).option("-d, --debug", `Run the generation with debug messages`, false).option("-s, --silent", `Run the generation silently, without any output`, false).option(
    "-o, --out-dir <outDir>",
    "Specify a relative root directory in which the definitions will be generated. Changing this value might break types exposed by Strapi that relies on generated types."
  ).action(helpers.runAction("ts:generate-types", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
