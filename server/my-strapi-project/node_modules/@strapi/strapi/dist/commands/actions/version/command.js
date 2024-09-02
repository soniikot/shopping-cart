"use strict";
const command = ({ command: command2 }) => {
  const packageJSON = require("../../../../package.json");
  command2.version(packageJSON.version, "-v, --version", "Output the version number");
  command2.command("version").description("Output the version of Strapi").action(() => {
    process.stdout.write(`${packageJSON.version}
`);
    process.exit(0);
  });
};
module.exports = command;
//# sourceMappingURL=command.js.map
