import _ from "lodash";
const uploadFile = async (uid, entity, files) => {
  const modelDef = strapi.getModel(uid);
  if (!_.has(strapi.plugins, "upload")) {
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
      if (_.isFinite(_.toNumber(path[i]))) {
        continue;
      }
      if (!attr)
        return {};
      if (attr.type === "component") {
        modelUID = attr.component;
        tmpModel = strapi.components[attr.component];
      } else if (attr.type === "dynamiczone") {
        const entryIdx = path[i + 1];
        const value = _.get(entity, [...currentPath, entryIdx]);
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
    const [path, field] = [_.initial(parts), _.last(parts)];
    const modelUID = findModelFromUploadPath(path);
    if (modelUID) {
      const id = _.get(entity, path.concat("id"));
      return uploadService.uploadToEntity({ id, model: modelUID, field }, files2);
    }
  };
  await Promise.all(Object.keys(files).map((key) => doUpload(key, files[key])));
};
export {
  uploadFile as default
};
//# sourceMappingURL=upload-files.mjs.map
