import { join } from "path";
import fse from "fs-extra";
import { defaults, get, getOr, defaultsDeep } from "lodash/fp";
import { env } from "@strapi/utils";
import { loadFile } from "../../app-configuration/load-config-file.mjs";
import loadFiles from "../../../load/load-files.mjs";
import { getEnabledPlugins } from "./get-enabled-plugins.mjs";
import { getUserPluginsConfig } from "./get-user-plugins-config.mjs";
const defaultPlugin = {
  bootstrap() {
  },
  destroy() {
  },
  register() {
  },
  config: {
    default: {},
    validator() {
    }
  },
  routes: [],
  controllers: {},
  services: {},
  policies: {},
  middlewares: {},
  contentTypes: {}
};
const applyUserExtension = async (plugins) => {
  const extensionsDir = strapi.dirs.dist.extensions;
  if (!await fse.pathExists(extensionsDir)) {
    return;
  }
  const extendedSchemas = await loadFiles(extensionsDir, "**/content-types/**/schema.json");
  const strapiServers = await loadFiles(extensionsDir, "**/strapi-server.js");
  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    for (const ctName of Object.keys(plugin.contentTypes)) {
      const extendedSchema = get([pluginName, "content-types", ctName, "schema"], extendedSchemas);
      if (extendedSchema) {
        plugin.contentTypes[ctName].schema = {
          ...plugin.contentTypes[ctName].schema,
          ...extendedSchema
        };
      }
    }
    const strapiServer = get([pluginName, "strapi-server"], strapiServers);
    if (strapiServer) {
      plugins[pluginName] = await strapiServer(plugin);
    }
  }
};
const applyUserConfig = async (plugins) => {
  const userPluginsConfig = await getUserPluginsConfig();
  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    const userPluginConfig = getOr({}, `${pluginName}.config`, userPluginsConfig);
    const defaultConfig = typeof plugin.config.default === "function" ? plugin.config.default({ env }) : plugin.config.default;
    const config = defaultsDeep(defaultConfig, userPluginConfig);
    try {
      plugin.config.validator(config);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Error regarding ${pluginName} config: ${e.message}`);
      }
      throw e;
    }
    plugin.config = config;
  }
};
async function loadPlugins(strapi2) {
  const plugins = {};
  const enabledPlugins = await getEnabledPlugins(strapi2);
  strapi2.config.set("enabledPlugins", enabledPlugins);
  for (const pluginName of Object.keys(enabledPlugins)) {
    const enabledPlugin = enabledPlugins[pluginName];
    let serverEntrypointPath;
    try {
      serverEntrypointPath = join(enabledPlugin.pathToPlugin, "strapi-server.js");
    } catch (e) {
      throw new Error(
        `Error loading the plugin ${pluginName} because ${pluginName} is not installed. Please either install the plugin or remove it's configuration.`
      );
    }
    if (!await fse.pathExists(serverEntrypointPath)) {
      continue;
    }
    const pluginServer = loadFile(serverEntrypointPath);
    plugins[pluginName] = {
      ...defaultPlugin,
      ...pluginServer,
      config: defaults(defaultPlugin.config, pluginServer.config),
      routes: pluginServer.routes ?? defaultPlugin.routes
    };
  }
  await applyUserConfig(plugins);
  await applyUserExtension(plugins);
  for (const pluginName of Object.keys(plugins)) {
    strapi2.container.get("plugins").add(pluginName, plugins[pluginName]);
  }
}
export {
  loadPlugins as default
};
//# sourceMappingURL=index.mjs.map
