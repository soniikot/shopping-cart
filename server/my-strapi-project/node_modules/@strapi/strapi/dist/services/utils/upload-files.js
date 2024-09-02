"use strict";
const _ = require("lodash");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const uploadFile = async (uid, entity, files) => {
  const modelDef = strapi.getModel(uid);
  if (!___default.default.has(strapi.plugins, "upload")) {
    return;
  }
  const uploadService = strapi.plugin("upload").service("upload");
  const findModelFromUploadPath = (path) => {
    if (path.length === 0) {
      return uid;
    }
    const currentPath = [];
    let tmpModel = modelDef;
    let modelUID = uid;
    for (let i = 0; i < path.length; i += 1) {
      if (!tmpModel) {
        return {};
      }
      const part = path[i];
      const attr = tmpModel.attributes[part];
      currentPath.push(part);
      if (___default.default.isFinite(___default.default.toNumber(path[i]))) {
        continue;
      }
      if (!attr)
        return {};
      if (attr.type === "component") {
        modelUID = attr.component;
        tmpModel = strapi.components[attr.component];
      } else if (attr.type === "dynamiczone") {
        const entryIdx = path[i + 1];
        const value = ___default.default.get(entity, [...currentPath, entryIdx]);
        if (!value)
          return {};
        modelUID = value.__component;
        tmpModel = strapi.components[modelUID];
      } else if (attr.type === "relation") {
        if (!("target" in attr)) {
          return {};
        }
        modelUID = attr.target;
        tmpModel = strapi.getModel(modelUID);
      } else {
        return;
      }
    }
    return modelUID;
  };
  const doUpload = async (key, files2) => {
    const parts = key.split(".");
    const [path, field] = [___default.default.initial(parts), ___default.default.last(parts)];
    const modelUID = findModelFromUploadPath(path);
    if (modelUID) {
      const id = ___default.default.get(entity, path.concat("id"));
      return uploadService.uploadToEntity({ id, model: modelUID, field }, files2);
    }
  };
  await Promise.all(Object.keys(files).map((key) => doUpload(key, files[key])));
};
module.exports = uploadFile;
//# sourceMappingURL=upload-files.js.map
