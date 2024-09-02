"use strict";
const helpers = require("../../../utils/helpers.js");
const action = require("./action.js");
const command = ({ command: command2 }) => {
  command2.command("admin:create-user").alias("admin:create").description("Create a new admin").option("-e, --email <email>", "Email of the new admin").option("-p, --password <password>", "Password of the new admin").option("-f, --firstname <first name>", "First name of the new admin").option("-l, --lastname <last name>", "Last name of the new admin").action(helpers.runAction("admin:create-user", action));
};
module.exports = command;
//# sourceMappingURL=command.js.map
