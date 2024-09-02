"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const transform = require("./transform.js");
const singleType = require("./single-type.js");
const collectionType = require("./collection-type.js");
const isSingleType = (contentType) => strapiUtils.contentTypes.isSingleType(contentType);
const getAuthFromKoaContext = (ctx) => fp.prop("state.auth", ctx) ?? {};
function createController({
  contentType
}) {
  const proto = {
    transformResponse(data, meta) {
      return transform.transformResponse(data, meta, { contentType });
    },
    async sanitizeOutput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return strapiUtils.sanitize.contentAPI.output(data, contentType, { auth });
    },
    async sanitizeInput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return strapiUtils.sanitize.contentAPI.input(data, contentType, { auth });
    },
    async sanitizeQuery(ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return strapiUtils.sanitize.contentAPI.query(ctx.query, contentType, { auth });
    },
    async validateQuery(ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return strapiUtils.validate.contentAPI.query(ctx.query, contentType, { auth });
    },
    async validateInput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return strapiUtils.validate.contentAPI.input(data, contentType, { auth });
    }
  };
  let ctrl;
  if (isSingleType(contentType)) {
    ctrl = singleType({ contentType });
  } else {
    ctrl = collectionType({ contentType });
  }
  return Object.assign(Object.create(proto), ctrl);
}
exports.createController = createController;
//# sourceMappingURL=index.js.map
