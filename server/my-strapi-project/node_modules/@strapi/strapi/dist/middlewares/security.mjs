import { defaultsDeep, mergeWith } from "lodash/fp";
import helmet from "koa-helmet";
const defaults = {
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  originAgentCluster: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "connect-src": ["'self'", "https:"],
      "img-src": ["'self'", "data:", "blob:", "https://market-assets.strapi.io"],
      "media-src": ["'self'", "data:", "blob:"],
      upgradeInsecureRequests: null
    }
  },
  xssFilter: false,
  hsts: {
    maxAge: 31536e3,
    includeSubDomains: true
  },
  frameguard: {
    action: "sameorigin"
  }
};
const mergeConfig = (existingConfig, newConfig) => {
  return mergeWith(
    (obj, src) => Array.isArray(obj) && Array.isArray(src) ? obj.concat(src) : void 0,
    existingConfig,
    newConfig
  );
};
const security = (config, { strapi }) => (ctx, next) => {
  let helmetConfig = defaultsDeep(defaults, config);
  const specialPaths = ["/documentation"];
  if (strapi.plugin("graphql")) {
    const { config: gqlConfig } = strapi.plugin("graphql");
    specialPaths.push(gqlConfig("endpoint"));
  }
  if (ctx.method === "GET" && specialPaths.some((str) => ctx.path.startsWith(str))) {
    helmetConfig = mergeConfig(helmetConfig, {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          "img-src": ["'self'", "data:", "cdn.jsdelivr.net", "strapi.io"]
        }
      }
    });
  }
  if (ctx.method === "GET" && ["/admin"].some((str) => ctx.path.startsWith(str))) {
    helmetConfig = mergeConfig(helmetConfig, {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
          "connect-src": ["'self'", "https:", "ws:"]
        }
      }
    });
  }
  return helmet(helmetConfig)(ctx, next);
};
export {
  security
};
//# sourceMappingURL=security.mjs.map
