import { policy, errors } from "@strapi/utils";
const resolvePolicies = (route) => {
  const policiesConfig = route?.config?.policies ?? [];
  const resolvedPolicies = policy.resolve(policiesConfig, route.info);
  const policiesMiddleware = async (ctx, next) => {
    const context = policy.createPolicyContext("koa", ctx);
    for (const { handler, config } of resolvedPolicies) {
      const result = await handler(context, config, { strapi });
      if (![true, void 0].includes(result)) {
        throw new errors.PolicyError();
      }
    }
    await next();
  };
  return [policiesMiddleware];
};
export {
  resolvePolicies
};
//# sourceMappingURL=policy.mjs.map
