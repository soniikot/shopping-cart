import permissions from "@strapi/permissions";
const createPermissionEngine = ({ providers }) => permissions.engine.new({ providers });
export {
  createPermissionEngine as default
};
//# sourceMappingURL=engine.mjs.map
