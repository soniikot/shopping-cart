const adminTsconfig = () => ({
  extends: "@strapi/typescript-utils/tsconfigs/admin",
  include: ["../plugins/**/admin/src/**/*", "./"],
  exclude: ["node_modules/", "build/", "dist/", "**/*.test.ts"]
});
export {
  adminTsconfig as default
};
//# sourceMappingURL=tsconfig-admin.json.mjs.map
