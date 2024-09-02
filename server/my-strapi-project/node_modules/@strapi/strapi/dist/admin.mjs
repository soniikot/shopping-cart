import { renderAdmin } from "@strapi/admin/strapi-admin";
import contentTypeBuilder from "@strapi/plugin-content-type-builder/strapi-admin";
import email from "@strapi/plugin-email/strapi-admin";
import upload from "@strapi/plugin-upload/strapi-admin";
import contentReleases from "@strapi/content-releases/strapi-admin";
const render = (mountNode, { plugins, ...restArgs }) => {
  return renderAdmin(mountNode, {
    ...restArgs,
    plugins: {
      "content-type-builder": contentTypeBuilder,
      // @ts-expect-error – TODO: fix this
      email,
      upload,
      contentReleases,
      ...plugins
    }
  });
};
export {
  render as renderAdmin
};
//# sourceMappingURL=admin.mjs.map
