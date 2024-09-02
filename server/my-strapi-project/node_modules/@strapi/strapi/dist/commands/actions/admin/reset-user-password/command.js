"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("admin:reset-user-password").alias("admin:reset-password").description("Reset an admin user's password").option("-e, --email <email>", "The user email").option("-p, --password <password>", "New password for the user").action(helpers.runAction("admin:reset-user-password", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
