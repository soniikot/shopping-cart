"use strict";
const chalk = require("chalk");
const stopProcess = require("./stop-process.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const DB_ARGS = ["dbclient", "dbhost", "dbport", "dbname", "dbusername", "dbpassword"];
const VALID_CLIENTS = ["sqlite", "mysql", "postgres"];
function parseDatabaseArguments({ scope, args }) {
  const argKeys = Object.keys(args);
  const matchingArgs = DB_ARGS.filter((key) => argKeys.includes(key));
  const missingArgs = DB_ARGS.filter((key) => !argKeys.includes(key));
  if (matchingArgs.length === 0)
    return;
  if (matchingArgs.length !== DB_ARGS.length && args.dbclient !== "sqlite") {
    return stopProcess(`Required database arguments are missing: ${missingArgs.join(", ")}.`);
  }
  if (!args.dbclient || !VALID_CLIENTS.includes(args.dbclient)) {
    return stopProcess(
      `Invalid client ${chalk__default.default.yellow(args.dbclient)}. Possible choices: ${VALID_CLIENTS.join(
        ", "
      )}.`
    );
  }
  scope.dbforce = args.dbforce !== void 0;
  const database = {
    client: args.dbclient,
    connection: {
      host: args.dbhost,
      port: args.dbport,
      database: args.dbname,
      username: args.dbusername,
      password: args.dbpassword,
      filename: args.dbfile
    }
  };
  if (args.dbssl !== void 0) {
    database.connection.ssl = args.dbssl === "true";
  }
  scope.database = database;
}
module.exports = parseDatabaseArguments;
//# sourceMappingURL=parse-db-arguments.js.map
