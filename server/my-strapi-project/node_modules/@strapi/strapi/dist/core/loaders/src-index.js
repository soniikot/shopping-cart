"use strict";
const path = require("path");
const fs = require("fs");
const strapiUtils = require("@strapi/utils");
const srcSchema = strapiUtils.yup.object().shape({
  bootstrap: strapiUtils.yup.mixed().isFunction(),
  register: strapiUtils.yup.mixed().isFunction(),
  destroy: strapiUtils.yup.mixed().isFunction()
}).noUnknown();
const validateSrcIndex = (srcIndex) => {
  return srcSchema.validateSync(srcIndex, { strict: true, abortEarly: false });
};
const loadSrcIndex = (strapi) => {
  if (!fs.existsSync(strapi.dirs.dist.src)) {
    return;
  }
  const pathToSrcIndex = path.resolve(strapi.dirs.dist.src, "index.js");
  if (!fs.existsSync(pathToSrcIndex) || fs.statSync(pathToSrcIndex).isDirectory()) {
    return {};
  }
  const srcIndex = strapiUtils.importDefault(pathToSrcIndex);
  try {
    validateSrcIndex(srcIndex);
  } catch (e) {
    if (e instanceof strapiUtils.yup.ValidationError) {
      strapi.stopWithError({ message: `Invalid file \`./src/index.js\`: ${e.message}` });
    }
    throw e;
  }
  return srcIndex;
};
module.exports = loadSrcIndex;
//# sourceMappingURL=src-index.js.map
