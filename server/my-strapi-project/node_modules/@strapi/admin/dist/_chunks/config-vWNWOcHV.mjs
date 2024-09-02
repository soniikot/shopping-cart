import path from "node:path";
import path$1 from "path";
import readPkgUp from "read-pkg-up";
import { l as loadFile } from "./index-0WWbaSNa.mjs";
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
      return [key, path.join(monorepo.path, modulePath)];
    })
  );
};
async function loadStrapiMonorepo(cwd) {
  let p = cwd;
  while (p !== "/") {
    const readResult = await readPkgUp({ cwd: p });
    if (!readResult) {
      return void 0;
    }
    if (readResult.packageJson.isStrapiMonorepo) {
      return { path: path$1.dirname(readResult.path) };
    }
    p = path$1.dirname(path$1.dirname(readResult.path));
  }
  return void 0;
}
const getUserConfig = async (fileNames, ctx) => {
  for (const file of fileNames) {
    const filePath = path.join(ctx.appDir, "src", "admin", file);
    const configFile = await loadFile(filePath);
    if (configFile) {
      return configFile;
    }
  }
  return void 0;
};
export {
  getUserConfig as a,
  getMonorepoAliases as g,
  loadStrapiMonorepo as l
};
//# sourceMappingURL=config-vWNWOcHV.mjs.map
