"use strict";
const path = require("path");
const fse = require("fs-extra");
const strapiUtils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
async function loadPolicies(strapi) {
  const dir = strapi.dirs.dist.policies;
  if (!await fse__default.default.pathExists(dir)) {
    return;
  }
  const policies = {};
  const paths = await fse__default.default.readdir(dir, { withFileTypes: true });
  for (const fd of paths) {
    const { name } = fd;
    const fullPath = path.join(dir, name);
    if (fd.isFile() && path.extname(name) === ".js") {
      const key = path.basename(name, ".js");
      policies[key] = strapiUtils.importDefault(fullPath);
    }
  }
  strapi.container.get("policies").add(`global::`, policies);
}
module.exports = loadPolicies;
//# sourceMappingURL=policies.js.map
