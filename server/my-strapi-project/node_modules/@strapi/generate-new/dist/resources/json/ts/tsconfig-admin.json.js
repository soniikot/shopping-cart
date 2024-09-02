"use strict";
const adminTsconfig = () => ({
  extends: "@strapi/typescript-utils/tsconfigs/admin",
  include: ["../plugins/**/admin/src/**/*", "./"],
  exclude: ["node_modules/", "build/", "dist/", "**/*.test.ts"]
});
module.exports = adminTsconfig;
//# sourceMappingURL=tsconfig-admin.json.js.map
