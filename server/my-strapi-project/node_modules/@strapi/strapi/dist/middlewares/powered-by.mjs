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
export {
  poweredBy
};
//# sourceMappingURL=powered-by.mjs.map
