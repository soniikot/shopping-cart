"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const getUserPluginsConfig = require("./get-user-plugins-config.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const INTERNAL_PLUGINS = [
  "@strapi/plugin-content-manager",
  "@strapi/plugin-content-type-builder",
  "@strapi/plugin-email",
  "@strapi/plugin-upload",
  "@strapi/content-releases"
];
const isStrapiPlugin = (info) => fp.get("strapi.kind", info) === "plugin";
const validatePluginName = (pluginName) => {
  if (!strapiUtils.isKebabCase(pluginName)) {
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
      pathToPlugin = path.join(declaration.resolve, "..");
    } else {
      try {
        pathToPlugin = path.dirname(require.resolve(declaration.resolve));
      } catch (e) {
        pathToPlugin = path.resolve(strapi.dirs.app.root, declaration.resolve);
        if (!fs.existsSync(pathToPlugin) || !fs.statSync(pathToPlugin).isDirectory()) {
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
    const packagePath = path.join(dep, "package.json");
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
    const packagePath = path.join(dep, "package.json");
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
  const userPluginsConfig = await getUserPluginsConfig.getUserPluginsConfig();
  ___default.default.forEach(userPluginsConfig, (declaration, pluginName) => {
    validatePluginName(pluginName);
    declaredPlugins[pluginName] = {
      ...toDetailedDeclaration(declaration),
      info: {}
    };
    const { pathToPlugin } = declaredPlugins[pluginName];
    if (pathToPlugin) {
      const packagePath = path.join(pathToPlugin, "package.json");
      const packageInfo = require(packagePath);
      if (isStrapiPlugin(packageInfo)) {
        declaredPlugins[pluginName].info = packageInfo.strapi || {};
      }
    }
  });
  const declaredPluginsResolves = fp.map(fp.prop("pathToPlugin"), declaredPlugins);
  const installedPluginsNotAlreadyUsed = fp.pickBy(
    (p) => !declaredPluginsResolves.includes(p.pathToPlugin),
    installedPlugins
  );
  const enabledPlugins = fp.pipe(
    fp.defaultsDeep(declaredPlugins),
    fp.defaultsDeep(installedPluginsNotAlreadyUsed),
    fp.pickBy((p) => p.enabled)
  )(internalPlugins);
  return enabledPlugins;
};
exports.getEnabledPlugins = getEnabledPlugins;
//# sourceMappingURL=get-enabled-plugins.js.map
