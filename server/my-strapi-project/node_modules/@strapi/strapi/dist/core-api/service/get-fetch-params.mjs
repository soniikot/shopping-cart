import { contentTypes } from "@strapi/utils";
const {
  constants: { DP_PUB_STATE_LIVE }
} = contentTypes;
const getFetchParams = (params = {}) => {
  return {
    publicationState: DP_PUB_STATE_LIVE,
    ...params
  };
};
export {
  getFetchParams
};
//# sourceMappingURL=get-fetch-params.mjs.map
