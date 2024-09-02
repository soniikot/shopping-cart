import { prop } from "lodash/fp";
import { contentTypes, sanitize, validate } from "@strapi/utils";
import { transformResponse } from "./transform.mjs";
import createSingleTypeController from "./single-type.mjs";
import createCollectionTypeController from "./collection-type.mjs";
const isSingleType = (contentType) => contentTypes.isSingleType(contentType);
const getAuthFromKoaContext = (ctx) => prop("state.auth", ctx) ?? {};
function createController({
  contentType
}) {
  const proto = {
    transformResponse(data, meta) {
      return transformResponse(data, meta, { contentType });
    },
    async sanitizeOutput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return sanitize.contentAPI.output(data, contentType, { auth });
    },
    async sanitizeInput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return sanitize.contentAPI.input(data, contentType, { auth });
    },
    async sanitizeQuery(ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return sanitize.contentAPI.query(ctx.query, contentType, { auth });
    },
    async validateQuery(ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return validate.contentAPI.query(ctx.query, contentType, { auth });
    },
    async validateInput(data, ctx) {
      const auth = getAuthFromKoaContext(ctx);
      return validate.contentAPI.input(data, contentType, { auth });
    }
  };
  let ctrl;
  if (isSingleType(contentType)) {
    ctrl = createSingleTypeController({ contentType });
  } else {
    ctrl = createCollectionTypeController({ contentType });
  }
  return Object.assign(Object.create(proto), ctrl);
}
export {
  createController
};
//# sourceMappingURL=index.mjs.map
