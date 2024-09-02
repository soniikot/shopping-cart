"use strict";
const path = require("path");
const fse = require("fs-extra");
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const loadConfigFile = require("../../app-configuration/load-config-file.js");
const loadFiles = require("../../../load/load-files.js");
const getEnabledPlugins = require("./get-enabled-plugins.js");
const getUserPluginsConfig = require("./get-user-plugins-config.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fse__default = /* @__PURE__ */ _interopDefault(fse);
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
  if (!await fse__default.default.pathExists(extensionsDir)) {
    return;
  }
  const extendedSchemas = await loadFiles(extensionsDir, "**/content-types/**/schema.json");
  const strapiServers = await loadFiles(extensionsDir, "**/strapi-server.js");
  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    for (const ctName of Object.keys(plugin.contentTypes)) {
      const extendedSchema = fp.get([pluginName, "content-types", ctName, "schema"], extendedSchemas);
      if (extendedSchema) {
        plugin.contentTypes[ctName].schema = {
          ...plugin.contentTypes[ctName].schema,
          ...extendedSchema
        };
      }
    }
    const strapiServer = fp.get([pluginName, "strapi-server"], strapiServers);
    if (strapiServer) {
      plugins[pluginName] = await strapiServer(plugin);
    }
  }
};
const applyUserConfig = async (plugins) => {
  const userPluginsConfig = await getUserPluginsConfig.getUserPluginsConfig();
  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    const userPluginConfig = fp.getOr({}, `${pluginName}.config`, userPluginsConfig);
    const defaultConfig = typeof plugin.config.default === "function" ? plugin.config.default({ env: strapiUtils.env }) : plugin.config.default;
    const config = fp.defaultsDeep(defaultConfig, userPluginConfig);
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
  const enabledPlugins = await getEnabledPlugins.getEnabledPlugins(strapi2);
  strapi2.config.set("enabledPlugins", enabledPlugins);
  for (const pluginName of Object.keys(enabledPlugins)) {
    const enabledPlugin = enabledPlugins[pluginName];
    let serverEntrypointPath;
    try {
      serverEntrypointPath = path.join(enabledPlugin.pathToPlugin, "strapi-server.js");
    } catch (e) {
      throw new Error(
        `Error loading the plugin ${pluginName} because ${pluginName} is not installed. Please either install the plugin or remove it's configuration.`
      );
    }
    if (!await fse__default.default.pathExists(serverEntrypointPath)) {
      continue;
    }
    const pluginServer = loadConfigFile.loadFile(serverEntrypointPath);
    plugins[pluginName] = {
      ...defaultPlugin,
      ...pluginServer,
      config: fp.defaults(defaultPlugin.config, pluginServer.config),
      routes: pluginServer.routes ?? defaultPlugin.routes
    };
  }
  await applyUserConfig(plugins);
  await applyUserExtension(plugins);
  for (const pluginName of Object.keys(plugins)) {
    strapi2.container.get("plugins").add(pluginName, plugins[pluginName]);
  }
}
module.exports = loadPlugins;
//# sourceMappingURL=index.js.map
