"use strict";
const path = require("path");
const fs = require("fs");
const loadConfigFile = require("./load-config-file.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const VALID_EXTENSIONS = [".js", ".json"];
const loadConfigDir = (dir) => {
  if (!fs__default.default.existsSync(dir))
    return {};
  return fs__default.default.readdirSync(dir, { withFileTypes: true }).filter((file) => file.isFile() && VALID_EXTENSIONS.includes(path__default.default.extname(file.name))).reduce((acc, file) => {
    const key = path__default.default.basename(file.name, path__default.default.extname(file.name));
    acc[key] = loadConfigFile.loadFile(path__default.default.resolve(dir, file.name));
    return acc;
  }, {});
};
module.exports = loadConfigDir;
//# sourceMappingURL=config-loader.js.map
