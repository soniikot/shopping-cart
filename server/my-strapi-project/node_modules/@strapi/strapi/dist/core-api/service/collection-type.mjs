import { propOr } from "lodash/fp";
import { contentTypes } from "@strapi/utils";
import { getPaginationInfo, convertPagedToStartLimit, shouldCount, transformPaginationResponse } from "./pagination.mjs";
import { getFetchParams } from "./get-fetch-params.mjs";
const {
  hasDraftAndPublish,
  constants: { PUBLISHED_AT_ATTRIBUTE }
} = contentTypes;
const setPublishedAt = (data) => {
  data[PUBLISHED_AT_ATTRIBUTE] = propOr(/* @__PURE__ */ new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};
const createCollectionTypeService = ({
  contentType
}) => {
  const { uid } = contentType;
  return {
    getFetchParams,
    async find(params = {}) {
      const fetchParams = this.getFetchParams(params);
      const paginationInfo = getPaginationInfo(fetchParams);
      const results = await strapi.entityService?.findMany(uid, {
        ...fetchParams,
        ...convertPagedToStartLimit(paginationInfo)
      });
      if (shouldCount(fetchParams)) {
        const count = await strapi.entityService?.count(uid, { ...fetchParams, ...paginationInfo });
        if (typeof count !== "number") {
          throw new Error("Count should be a number");
        }
        return {
          results,
          pagination: transformPaginationResponse(paginationInfo, count)
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
export {
  createCollectionTypeService as default
};
//# sourceMappingURL=collection-type.mjs.map
