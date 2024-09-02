"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const strapiUtils = require("@strapi/utils");
const resolvePolicies = (route) => {
  const policiesConfig = route?.config?.policies ?? [];
  const resolvedPolicies = strapiUtils.policy.resolve(policiesConfig, route.info);
  const policiesMiddleware = async (ctx, next) => {
    const context = strapiUtils.policy.createPolicyContext("koa", ctx);
    for (const { handler, config } of resolvedPolicies) {
      const result = await handler(context, config, { strapi });
      if (![true, void 0].includes(result)) {
        throw new strapiUtils.errors.PolicyError();
      }
    }
    await next();
  };
  return [policiesMiddleware];
};
exports.resolvePolicies = resolvePolicies;
//# sourceMappingURL=policy.js.map
