"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const generateASecret = () => crypto__default.default.randomBytes(16).toString("base64");
const createEnvFile = () => {
  const tmpl = fs__default.default.readFileSync(path__default.default.join(__dirname, "env.template"));
  const compile = ___default.default.template(tmpl.toString());
  return compile({
    appKeys: new Array(4).fill(null).map(generateASecret).join(","),
    apiTokenSalt: generateASecret(),
    transferTokenSalt: generateASecret(),
    adminJwtToken: generateASecret()
  });
};
module.exports = createEnvFile;
//# sourceMappingURL=env.js.map
