"use strict";
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const getFetchParams = require("./get-fetch-params.js");
const {
  hasDraftAndPublish,
  constants: { PUBLISHED_AT_ATTRIBUTE }
} = strapiUtils.contentTypes;
const setPublishedAt = (data) => {
  data[PUBLISHED_AT_ATTRIBUTE] = fp.propOr(/* @__PURE__ */ new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};
const createSingleTypeService = ({
  contentType
}) => {
  const { uid } = contentType;
  return {
    getFetchParams: getFetchParams.getFetchParams,
    /**
     * Returns singleType content
     */
    find(params = {}) {
      return strapi.entityService?.findMany(uid, this.getFetchParams(params)) ?? null;
    },
    /**
     * Creates or updates a singleType content
     *
     * @return {Promise}
     */
    async createOrUpdate({ data, ...params } = { data: {} }) {
      const entity = await this.find({ ...params, publicationState: "preview" });
      if (!entity) {
        const count = await strapi.query(uid).count();
        if (count >= 1) {
          throw new strapiUtils.errors.ValidationError("singleType.alreadyExists");
        }
        if (hasDraftAndPublish(contentType)) {
          setPublishedAt(data);
        }
        return strapi.entityService?.create(uid, { ...params, data });
      }
      return strapi.entityService?.update(uid, entity.id, { ...params, data });
    },
    /**
     * Deletes the singleType content
     *
     * @return {Promise}
     */
    async delete(params = {}) {
      const entity = await this.find(params);
      if (!entity)
        return;
      return strapi.entityService?.delete(uid, entity.id);
    }
  };
};
module.exports = createSingleTypeService;
//# sourceMappingURL=single-type.js.map
