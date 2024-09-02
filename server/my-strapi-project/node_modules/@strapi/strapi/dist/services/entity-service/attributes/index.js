"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const transforms = require("./transforms.js");
const applyTransforms = (data, context) => {
  const { contentType } = context;
  const attributeNames = Object.keys(data);
  for (const attributeName of attributeNames) {
    const value = data[attributeName];
    const attribute = contentType.attributes[attributeName];
    if (!attribute) {
      continue;
    }
    const transform = transforms[attribute.type];
    if (transform) {
      const attributeContext = { ...context, attributeName, attribute };
      data[attributeName] = transform(value, attributeContext);
    }
  }
  return data;
};
exports.applyTransforms = applyTransforms;
//# sourceMappingURL=index.js.map
