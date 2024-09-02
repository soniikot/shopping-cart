"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const createDatabaseConfig = ({ useTypescript }) => {
  const language = useTypescript ? "ts" : "js";
  const tmpl = fs__default.default.readFileSync(
    path__default.default.join(__dirname, "database-templates", language, `database.template`)
  );
  const compile = ___default.default.template(tmpl.toString());
  return compile();
};
const generateDbEnvariables = ({
  connection,
  client
}) => {
  const tmpl = fs__default.default.readFileSync(path__default.default.join(__dirname, "database-templates", `${client}.template`));
  const compile = ___default.default.template(tmpl.toString());
  return compile({
    client,
    connection: {
      ...connection.connection,
      ssl: connection.connection.ssl || false
    }
  });
};
exports.createDatabaseConfig = createDatabaseConfig;
exports.generateDbEnvariables = generateDbEnvariables;
//# sourceMappingURL=database.js.map
