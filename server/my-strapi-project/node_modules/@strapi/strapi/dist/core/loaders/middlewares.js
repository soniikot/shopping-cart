"use strict";
const path = require("path");
const fse = require("fs-extra");
const strapiUtils = require("@strapi/utils");
const index = require("../../middlewares/index.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
async function loadMiddlewares(strapi) {
  const localMiddlewares = await loadLocalMiddlewares(strapi);
  strapi.container.get("middlewares").add(`global::`, localMiddlewares);
  strapi.container.get("middlewares").add(`strapi::`, index.middlewares);
}
const loadLocalMiddlewares = async (strapi) => {
  const dir = strapi.dirs.dist.middlewares;
  if (!await fse__default.default.pathExists(dir)) {
    return {};
  }
  const middlewares = {};
  const paths = await fse__default.default.readdir(dir, { withFileTypes: true });
  for (const fd of paths) {
    const { name } = fd;
    const fullPath = path.join(dir, name);
    if (fd.isFile() && path.extname(name) === ".js") {
      const key = path.basename(name, ".js");
      middlewares[key] = strapiUtils.importDefault(fullPath);
    }
  }
  return middlewares;
};
module.exports = loadMiddlewares;
//# sourceMappingURL=middlewares.js.map
