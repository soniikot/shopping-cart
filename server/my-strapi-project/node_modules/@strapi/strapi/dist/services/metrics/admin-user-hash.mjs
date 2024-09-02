import crypto from "crypto";
const generateAdminUserHash = (strapi) => {
  const ctx = strapi?.requestContext?.get();
  if (!ctx?.state?.user?.email) {
    return "";
  }
  return crypto.createHash("sha256").update(ctx.state.user.email).digest("hex");
};
export {
  generateAdminUserHash
};
//# sourceMappingURL=admin-user-hash.mjs.map
