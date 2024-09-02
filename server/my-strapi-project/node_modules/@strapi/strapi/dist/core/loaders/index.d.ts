import loadAPIs from './apis';
import loadMiddlewares from './middlewares';
import loadComponents from './components';
import loadPolicies from './policies';
import loadPlugins from './plugins';
import loadAdmin from './admin';
declare const _default: {
    loadSrcIndex: (strapi: import("@strapi/types").Strapi) => any;
    loadAPIs: typeof loadAPIs;
    loadMiddlewares: typeof loadMiddlewares;
    loadComponents: typeof loadComponents;
    loadPolicies: typeof loadPolicies;
    loadPlugins: typeof loadPlugins;
    loadAdmin: typeof loadAdmin;
    loadSanitizers: (strapi: import("@strapi/types").Strapi) => void;
    loadValidators: (strapi: import("@strapi/types").Strapi) => void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map