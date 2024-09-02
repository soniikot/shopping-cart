import crypto from "crypto";
import fs from "fs";
import path from "path";
import _ from "lodash";
const generateASecret = () => crypto.randomBytes(16).toString("base64");
const createEnvFile = () => {
  const tmpl = fs.readFileSync(path.join(__dirname, "env.template"));
  const compile = _.template(tmpl.toString());
  return compile({
    appKeys: new Array(4).fill(null).map(generateASecret).join(","),
    apiTokenSalt: generateASecret(),
    transferTokenSalt: generateASecret(),
    adminJwtToken: generateASecret()
  });
};
export {
  createEnvFile as default
};
//# sourceMappingURL=env.mjs.map
