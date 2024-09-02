"use strict";
const path = require("path");
const fse = require("fs-extra");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const createStrapiFs = (strapi) => {
  function normalizePath(optPath) {
    const filePath = Array.isArray(optPath) ? optPath.join("/") : optPath;
    const normalizedPath = path__default.default.normalize(filePath).replace(/^\/?(\.\/|\.\.\/)+/, "");
    return path__default.default.resolve(strapi.dirs.app.root, normalizedPath);
  }
  const strapiFS = {
    /**
     * Writes a file in a strapi app
     * @param {Array|string} optPath - file path
     * @param {string} data - content
     */
    writeAppFile(optPath, data) {
      const writePath = normalizePath(optPath);
      return fse__default.default.ensureFile(writePath).then(() => fse__default.default.writeFile(writePath, data));
    },
    /**
     * Writes a file in a plugin extensions folder
     * @param {string} plugin - plugin name
     * @param {Array|string} optPath - path to file
     * @param {string} data - content
     */
    writePluginFile(plugin, optPath, data) {
      const newPath = ["extensions", plugin].concat(optPath).join("/");
      return strapiFS.writeAppFile(newPath, data);
    },
    /**
     * Removes a file in strapi app
     */
    removeAppFile(optPath) {
      const removePath = normalizePath(optPath);
      return fse__default.default.remove(removePath);
    },
    /**
     * Appends a file in strapi app
     */
    appendFile(optPath, data) {
      const writePath = normalizePath(optPath);
      return fse__default.default.appendFileSync(writePath, data);
    }
  };
  return strapiFS;
};
module.exports = createStrapiFs;
//# sourceMappingURL=fs.js.map
