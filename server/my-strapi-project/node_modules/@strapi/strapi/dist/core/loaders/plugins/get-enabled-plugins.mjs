import { join, dirname, resolve } from "path";
import { existsSync, statSync } from "fs";
import _ from "lodash";
import { map, prop, pickBy, pipe, defaultsDeep, get } from "lodash/fp";
import { isKebabCase } from "@strapi/utils";
import { getUserPluginsConfig } from "./get-user-plugins-config.mjs";
const INTERNAL_PLUGINS = [
  "@strapi/plugin-content-manager",
  "@strapi/plugin-content-type-builder",
  "@strapi/plugin-email",
  "@strapi/plugin-upload",
  "@strapi/content-releases"
];
const isStrapiPlugin = (info) => get("strapi.kind", info) === "plugin";
const validatePluginName = (pluginName) => {
  if (!isKebabCase(pluginName)) {
    throw new Error(`Plugin name "${pluginName}" is not in kebab (an-example-of-kebab-case)`);
  }
};
const toDetailedDeclaration = (declaration) => {
  if (typeof declaration === "boolean") {
    return { enabled: declaration };
  }
  const detailedDeclaration = {
    enabled: declaration.enabled
  };
  if (declaration?.resolve) {
    let pathToPlugin = "";
    if (declaration.isModule) {
      pathToPlugin = join(declaration.resolve, "..");
    } else {
      try {
        pathToPlugin = dirname(require.resolve(declaration.resolve));
      } catch (e) {
        pathToPlugin = resolve(strapi.dirs.app.root, declaration.resolve);
        if (!existsSync(pathToPlugin) || !statSync(pathToPlugin).isDirectory()) {
          throw new Error(`${declaration.resolve} couldn't be resolved`);
        }
      }
    }
    detailedDeclaration.pathToPlugin = pathToPlugin;
  }
  return detailedDeclaration;
};
const getEnabledPlugins = async (strapi2, { client } = { client: false }) => {
  const internalPlugins = {};
  for (const dep of INTERNAL_PLUGINS) {
    const packagePath = join(dep, "package.json");
    const packageInfo = require(packagePath);
    validatePluginName(packageInfo.strapi.name);
    internalPlugins[packageInfo.strapi.name] = {
      ...toDetailedDeclaration({ enabled: true, resolve: packagePath, isModule: client }),
      info: packageInfo.strapi
    };
  }
  const installedPlugins = {};
  const dependencies = strapi2.config.get("info.dependencies", {});
  for (const dep of Object.keys(dependencies)) {
    const packagePath = join(dep, "package.json");
    let packageInfo;
    try {
      packageInfo = require(packagePath);
    } catch {
      continue;
    }
    if (isStrapiPlugin(packageInfo)) {
      validatePluginName(packageInfo.strapi.name);
      installedPlugins[packageInfo.strapi.name] = {
        ...toDetailedDeclaration({ enabled: true, resolve: packagePath, isModule: client }),
        info: {
          ...packageInfo.strapi,
          packageName: packageInfo.name
        }
      };
    }
  }
  const declaredPlugins = {};
  const userPluginsConfig = await getUserPluginsConfig();
  _.forEach(userPluginsConfig, (declaration, pluginName) => {
    validatePluginName(pluginName);
    declaredPlugins[pluginName] = {
      ...toDetailedDeclaration(declaration),
      info: {}
    };
    const { pathToPlugin } = declaredPlugins[pluginName];
    if (pathToPlugin) {
      const packagePath = join(pathToPlugin, "package.json");
      const packageInfo = require(packagePath);
      if (isStrapiPlugin(packageInfo)) {
        declaredPlugins[pluginName].info = packageInfo.strapi || {};
      }
    }
  });
  const declaredPluginsResolves = map(prop("pathToPlugin"), declaredPlugins);
  const installedPluginsNotAlreadyUsed = pickBy(
    (p) => !declaredPluginsResolves.includes(p.pathToPlugin),
    installedPlugins
  );
  const enabledPlugins = pipe(
    defaultsDeep(declaredPlugins),
    defaultsDeep(installedPluginsNotAlreadyUsed),
    pickBy((p) => p.enabled)
  )(internalPlugins);
  return enabledPlugins;
};
export {
  getEnabledPlugins
};
//# sourceMappingURL=get-enabled-plugins.mjs.map
