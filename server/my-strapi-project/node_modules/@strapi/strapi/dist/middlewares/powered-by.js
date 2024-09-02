"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaults = {
  poweredBy: "Strapi <strapi.io>"
};
const poweredBy = (config) => {
  const { poweredBy: poweredBy2 } = { ...defaults, ...config };
  return async (ctx, next) => {
    await next();
    ctx.set("X-Powered-By", poweredBy2);
  };
};
exports.poweredBy = poweredBy;
//# sourceMappingURL=powered-by.js.map
