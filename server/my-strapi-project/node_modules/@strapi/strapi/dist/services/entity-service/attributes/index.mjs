import transforms from "./transforms.mjs";
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
export {
  applyTransforms
};
//# sourceMappingURL=index.mjs.map
