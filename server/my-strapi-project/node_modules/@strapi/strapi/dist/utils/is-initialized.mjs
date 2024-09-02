import { isEmpty, isNil } from "lodash/fp";
async function isInitialized(strapi) {
  try {
    if (isEmpty(strapi.admin)) {
      return true;
    }
    const anyAdministrator = await strapi.query("admin::user").findOne({ select: ["id"] });
    return !isNil(anyAdministrator);
  } catch (err) {
    strapi.stopWithError(err);
  }
}
export {
  isInitialized as default
};
//# sourceMappingURL=is-initialized.mjs.map
