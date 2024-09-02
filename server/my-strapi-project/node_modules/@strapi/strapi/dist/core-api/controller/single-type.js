"use strict";
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const transform = require("./transform.js");
const createSingleTypeController = ({
  contentType
}) => {
  const uid = contentType.uid;
  return {
    /**
     * Retrieve single type content
     *
     */
    async find(ctx) {
      await this.validateQuery(ctx);
      const sanitizedQuery = await this.sanitizeQuery(ctx);
      const entity = await strapi.service(uid).find(sanitizedQuery);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    /**
     * create or update single type content.
     *
     * @return {Object}
     */
    async update(ctx) {
      const { query } = ctx.request;
      const body = transform.parseBody(ctx);
      if (!fp.isObject(body.data)) {
        throw new strapiUtils.errors.ValidationError('Missing "data" payload in the request body');
      }
      const sanitizedInputData = await this.sanitizeInput(body.data, ctx);
      const entity = await strapi.service(uid).createOrUpdate({
        ...query,
        data: sanitizedInputData,
        files: "files" in body ? body.files : void 0
      });
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    async delete(ctx) {
      const { query } = ctx;
      const entity = await strapi.service(uid).delete(query);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    }
  };
};
module.exports = createSingleTypeController;
//# sourceMappingURL=single-type.js.map
