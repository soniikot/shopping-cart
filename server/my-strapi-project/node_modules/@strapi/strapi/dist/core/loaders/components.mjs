import { join } from "path";
import _ from "lodash";
import { pathExists } from "fs-extra";
import loadFiles from "../../load/load-files.mjs";
async function loadComponents(strapi) {
  if (!await pathExists(strapi.dirs.dist.components)) {
    return {};
  }
  const map = await loadFiles(strapi.dirs.dist.components, "*/*.*(js|json)");
  return Object.keys(map).reduce((acc, category) => {
    Object.keys(map[category]).forEach((key) => {
      const schema = map[category][key];
      if (!schema.collectionName) {
        const filePath = join(strapi.dirs.app.components, category, schema.__filename__);
        return strapi.stopWithError(
          `Component ${key} is missing a "collectionName" property.
Verify file ${filePath}.`
        );
      }
      const uid = `${category}.${key}`;
      acc[uid] = Object.assign(schema, {
        __schema__: _.cloneDeep(schema),
        uid,
        category,
        modelType: "component",
        modelName: key,
        globalId: schema.globalId || _.upperFirst(_.camelCase(`component_${uid}`))
      });
    });
    return acc;
  }, {});
}
export {
  loadComponents as default
};
//# sourceMappingURL=components.mjs.map
