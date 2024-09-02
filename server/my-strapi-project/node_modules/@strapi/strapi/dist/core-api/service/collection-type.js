"use strict";
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const pagination = require("./pagination.js");
const getFetchParams = require("./get-fetch-params.js");
const {
  hasDraftAndPublish,
  constants: { PUBLISHED_AT_ATTRIBUTE }
} = strapiUtils.contentTypes;
const setPublishedAt = (data) => {
  data[PUBLISHED_AT_ATTRIBUTE] = fp.propOr(/* @__PURE__ */ new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};
const createCollectionTypeService = ({
  contentType
}) => {
  const { uid } = contentType;
  return {
    getFetchParams: getFetchParams.getFetchParams,
    async find(params = {}) {
      const fetchParams = this.getFetchParams(params);
      const paginationInfo = pagination.getPaginationInfo(fetchParams);
      const results = await strapi.entityService?.findMany(uid, {
        ...fetchParams,
        ...pagination.convertPagedToStartLimit(paginationInfo)
      });
      if (pagination.shouldCount(fetchParams)) {
        const count = await strapi.entityService?.count(uid, { ...fetchParams, ...paginationInfo });
        if (typeof count !== "number") {
          throw new Error("Count should be a number");
        }
        return {
          results,
          pagination: pagination.transformPaginationResponse(paginationInfo, count)
        };
      }
      return {
        results,
        pagination: paginationInfo
      };
    },
    findOne(entityId, params = {}) {
      return strapi.entityService?.findOne(uid, entityId, this.getFetchParams(params));
    },
    create(params = { data: {} }) {
      const { data } = params;
      if (hasDraftAndPublish(contentType)) {
        setPublishedAt(data);
      }
      return strapi.entityService?.create(uid, { ...params, data });
    },
    update(entityId, params = { data: {} }) {
      const { data } = params;
      return strapi.entityService?.update(uid, entityId, { ...params, data });
    },
    delete(entityId, params = {}) {
      return strapi.entityService?.delete(uid, entityId, params);
    }
  };
};
module.exports = createCollectionTypeService;
//# sourceMappingURL=collection-type.js.map
