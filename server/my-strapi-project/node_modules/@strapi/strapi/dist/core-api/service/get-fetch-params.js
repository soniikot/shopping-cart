"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiUtils = require("@strapi/utils");
const {
  constants: { DP_PUB_STATE_LIVE }
} = strapiUtils.contentTypes;
const getFetchParams = (params = {}) => {
  return {
    publicationState: DP_PUB_STATE_LIVE,
    ...params
  };
};
exports.getFetchParams = getFetchParams;
//# sourceMappingURL=get-fetch-params.js.map
