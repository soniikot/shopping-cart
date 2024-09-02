"use strict";
const path = require("path");
const _ = require("lodash");
const fse = require("fs-extra");
const loadFiles = require("../../load/load-files.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
async function loadComponents(strapi) {
  if (!await fse.pathExists(strapi.dirs.dist.components)) {
    return {};
  }
  const map = await loadFiles(strapi.dirs.dist.components, "*/*.*(js|json)");
  return Object.keys(map).reduce((acc, category) => {
    Object.keys(map[category]).forEach((key) => {
      const schema = map[category][key];
      if (!schema.collectionName) {
        const filePath = path.join(strapi.dirs.app.components, category, schema.__filename__);
        return strapi.stopWithError(
          `Component ${key} is missing a "collectionName" property.
Verify file ${filePath}.`
        );
      }
      const uid = `${category}.${key}`;
      acc[uid] = Object.assign(schema, {
        __schema__: ___default.default.cloneDeep(schema),
        uid,
        category,
        modelType: "component",
        modelName: key,
        globalId: schema.globalId || ___default.default.upperFirst(___default.default.camelCase(`component_${uid}`))
      });
    });
    return acc;
  }, {});
}
module.exports = loadComponents;
//# sourceMappingURL=components.js.map
