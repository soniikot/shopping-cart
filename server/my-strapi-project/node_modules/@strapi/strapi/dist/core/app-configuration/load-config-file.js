"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const fs = require("fs");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const loadJsFile = (file) => {
  try {
    const jsModule = strapiUtils.importDefault(file);
    if (typeof jsModule === "function") {
      return jsModule({ env: strapiUtils.env });
    }
    return jsModule;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not load js config file ${file}: ${error.message}`);
    }
    throw new Error("Unknown error");
  }
};
const loadJSONFile = (file) => {
  try {
    return strapiUtils.templateConfiguration(JSON.parse(fs__default.default.readFileSync(file).toString()));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not load json config file ${file}: ${error.message}`);
    }
    throw new Error("Unknown error");
  }
};
const loadFile = (file) => {
  const ext = path__default.default.extname(file);
  switch (ext) {
    case ".js":
      return loadJsFile(file);
    case ".json":
      return loadJSONFile(file);
    default:
      return {};
  }
};
exports.loadFile = loadFile;
//# sourceMappingURL=load-config-file.js.map
