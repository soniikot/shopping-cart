import fs from "fs";
import path from "path";
import _ from "lodash";
const createDatabaseConfig = ({ useTypescript }) => {
  const language = useTypescript ? "ts" : "js";
  const tmpl = fs.readFileSync(
    path.join(__dirname, "database-templates", language, `database.template`)
  );
  const compile = _.template(tmpl.toString());
  return compile();
};
const generateDbEnvariables = ({
  connection,
  client
}) => {
  const tmpl = fs.readFileSync(path.join(__dirname, "database-templates", `${client}.template`));
  const compile = _.template(tmpl.toString());
  return compile({
    client,
    connection: {
      ...connection.connection,
      ssl: connection.connection.ssl || false
    }
  });
};
export {
  createDatabaseConfig,
  generateDbEnvariables
};
//# sourceMappingURL=database.mjs.map
