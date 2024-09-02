"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiAdmin = require("@strapi/admin/strapi-admin");
const contentTypeBuilder = require("@strapi/plugin-content-type-builder/strapi-admin");
const email = require("@strapi/plugin-email/strapi-admin");
const upload = require("@strapi/plugin-upload/strapi-admin");
const contentReleases = require("@strapi/content-releases/strapi-admin");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const contentTypeBuilder__default = /* @__PURE__ */ _interopDefault(contentTypeBuilder);
const email__default = /* @__PURE__ */ _interopDefault(email);
const upload__default = /* @__PURE__ */ _interopDefault(upload);
const contentReleases__default = /* @__PURE__ */ _interopDefault(contentReleases);
const render = (mountNode, { plugins, ...restArgs }) => {
  return strapiAdmin.renderAdmin(mountNode, {
    ...restArgs,
    plugins: {
      "content-type-builder": contentTypeBuilder__default.default,
      // @ts-expect-error – TODO: fix this
      email: email__default.default,
      upload: upload__default.default,
      contentReleases: contentReleases__default.default,
      ...plugins
    }
  });
};
exports.renderAdmin = render;
//# sourceMappingURL=admin.js.map
