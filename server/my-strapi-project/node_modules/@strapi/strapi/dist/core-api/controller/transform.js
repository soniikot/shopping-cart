"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
function isEntry(property) {
  return property === null || fp.isPlainObject(property) || Array.isArray(property);
}
function isDZEntries(property) {
  return Array.isArray(property);
}
const parseBody = (ctx) => {
  if (ctx.is("multipart")) {
    return strapiUtils.parseMultipartData(ctx);
  }
  const { data } = ctx.request.body || {};
  return { data };
};
const transformResponse = (resource, meta = {}, opts = {}) => {
  if (fp.isNil(resource)) {
    return resource;
  }
  return {
    data: transformEntry(resource, opts?.contentType),
    meta
  };
};
function transformComponent(data, component) {
  if (Array.isArray(data)) {
    return data.map((datum) => transformComponent(datum, component));
  }
  const res = transformEntry(data, component);
  if (fp.isNil(res)) {
    return res;
  }
  const { id, attributes } = res;
  return { id, ...attributes };
}
function transformEntry(entry, type) {
  if (fp.isNil(entry)) {
    return entry;
  }
  if (Array.isArray(entry)) {
    return entry.map((singleEntry) => transformEntry(singleEntry, type));
  }
  if (!fp.isPlainObject(entry)) {
    throw new Error("Entry must be an object");
  }
  const { id, ...properties } = entry;
  const attributeValues = {};
  for (const key of Object.keys(properties)) {
    const property = properties[key];
    const attribute = type && type.attributes[key];
    if (attribute && attribute.type === "relation" && isEntry(property) && "target" in attribute) {
      const data = transformEntry(
        property,
        strapi.contentType(attribute.target)
      );
      attributeValues[key] = { data };
    } else if (attribute && attribute.type === "component" && isEntry(property)) {
      attributeValues[key] = transformComponent(property, strapi.components[attribute.component]);
    } else if (attribute && attribute.type === "dynamiczone" && isDZEntries(property)) {
      if (fp.isNil(property)) {
        attributeValues[key] = property;
      }
      attributeValues[key] = property.map((subProperty) => {
        return transformComponent(subProperty, strapi.components[subProperty.__component]);
      });
    } else if (attribute && attribute.type === "media" && isEntry(property)) {
      const data = transformEntry(property, strapi.contentType("plugin::upload.file"));
      attributeValues[key] = { data };
    } else {
      attributeValues[key] = property;
    }
  }
  return {
    id,
    attributes: attributeValues
    // NOTE: not necessary for now
    // meta: {},
  };
}
exports.parseBody = parseBody;
exports.transformResponse = transformResponse;
//# sourceMappingURL=transform.js.map
