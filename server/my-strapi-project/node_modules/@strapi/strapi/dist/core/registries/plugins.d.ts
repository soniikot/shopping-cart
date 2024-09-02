import type { Strapi, Common } from '@strapi/types';
type PluginMap = Record<string, Common.Plugin>;
declare const pluginsRegistry: (strapi: Strapi) => {
    get(name: string): Common.Plugin;
    getAll(): PluginMap;
    add(name: string, pluginConfig: Common.Plugin): Common.Plugin;
};
export default pluginsRegistry;
//# sourceMappingURL=plugins.d.ts.map