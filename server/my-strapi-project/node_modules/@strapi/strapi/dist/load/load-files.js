"use strict";
const path = require("path");
const _ = require("lodash");
const fse = require("fs-extra");
const strapiUtils = require("@strapi/utils");
const glob = require("glob");
const filepathToPropPath = require("./filepath-to-prop-path.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
async function loadFiles(dir, pattern, { requireFn = strapiUtils.importDefault, shouldUseFileNameAsKey = (_2) => true, globArgs = {} } = {}) {
  const root = {};
  const files = await glob.glob(pattern, { cwd: dir, ...globArgs });
  for (const file of files) {
    const absolutePath = path__default.default.resolve(dir, file);
    delete require.cache[absolutePath];
    let mod;
    if (path__default.default.extname(absolutePath) === ".json") {
      mod = await fse__default.default.readJson(absolutePath);
    } else {
      mod = requireFn(absolutePath);
    }
    Object.defineProperty(mod, "__filename__", {
      enumerable: true,
      configurable: false,
      writable: false,
      value: path__default.default.basename(file)
    });
    const propPath = filepathToPropPath(file, shouldUseFileNameAsKey(file));
    if (propPath.length === 0)
      ___default.default.merge(root, mod);
    ___default.default.merge(root, ___default.default.setWith({}, propPath, mod, Object));
  }
  return root;
}
module.exports = loadFiles;
//# sourceMappingURL=load-files.js.map
