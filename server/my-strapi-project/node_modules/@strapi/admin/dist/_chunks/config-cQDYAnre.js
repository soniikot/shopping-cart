"use strict";
const path = require("node:path");
const path$1 = require("path");
const readPkgUp = require("read-pkg-up");
const index = require("./index-sNH2VWbC.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const path__default$1 = /* @__PURE__ */ _interopDefault(path$1);
const readPkgUp__default = /* @__PURE__ */ _interopDefault(readPkgUp);
const devAliases = {
  "@strapi/admin/strapi-admin": "./packages/core/admin/admin/src",
  "@strapi/content-releases/strapi-admin": "./packages/core/content-releases/admin/src",
  "@strapi/plugin-content-type-builder/strapi-admin": "./packages/core/content-type-builder/admin/src",
  "@strapi/plugin-email/strapi-admin": "./packages/core/email/admin/src",
  "@strapi/plugin-upload/strapi-admin": "./packages/core/upload/admin/src",
  "@strapi/plugin-color-picker/strapi-admin": "./packages/plugins/color-picker/admin/src",
  "@strapi/plugin-documentation/strapi-admin": "./packages/plugins/documentation/admin/src",
  "@strapi/plugin-graphql/strapi-admin": "./packages/plugins/graphql/admin/src",
  "@strapi/plugin-i18n/strapi-admin": "./packages/plugins/i18n/admin/src",
  "@strapi/plugin-sentry/strapi-admin": "./packages/plugins/sentry/admin/src",
  "@strapi/plugin-users-permissions/strapi-admin": "./packages/plugins/users-permissions/admin/src",
  "@strapi/helper-plugin": "./packages/core/helper-plugin/src"
};
const getMonorepoAliases = ({ monorepo }) => {
  if (!monorepo?.path) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(devAliases).map(([key, modulePath]) => {
      return [key, path__default.default.join(monorepo.path, modulePath)];
    })
  );
};
async function loadStrapiMonorepo(cwd) {
  let p = cwd;
  while (p !== "/") {
    const readResult = await readPkgUp__default.default({ cwd: p });
    if (!readResult) {
      return void 0;
    }
    if (readResult.packageJson.isStrapiMonorepo) {
      return { path: path__default$1.default.dirname(readResult.path) };
    }
    p = path__default$1.default.dirname(path__default$1.default.dirname(readResult.path));
  }
  return void 0;
}
const getUserConfig = async (fileNames, ctx) => {
  for (const file of fileNames) {
    const filePath = path__default.default.join(ctx.appDir, "src", "admin", file);
    const configFile = await index.loadFile(filePath);
    if (configFile) {
      return configFile;
    }
  }
  return void 0;
};
exports.getMonorepoAliases = getMonorepoAliases;
exports.getUserConfig = getUserConfig;
exports.loadStrapiMonorepo = loadStrapiMonorepo;
//# sourceMappingURL=config-cQDYAnre.js.map
