"use strict";
const helperPlugin = require("@strapi/helper-plugin");
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const icons = require("@strapi/icons");
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const pluginId = "cloud";
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(pluginId);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsxRuntime.jsx(icons.Cloud, {});
const name = "Deploy";
const index = {
  register(app) {
    const { backendURL } = window.strapi;
    if (backendURL?.includes("localhost")) {
      app.addMenuLink({
        to: `/plugins/${pluginId}`,
        icon: PluginIcon,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: name
        },
        Component: async () => {
          const { App } = await Promise.resolve().then(() => require("./App-Gh4oSOHw.js"));
          return App;
        }
      });
      const plugin = {
        id: pluginId,
        initializer: Initializer,
        isReady: false,
        name
      };
      app.registerPlugin(plugin);
    }
  },
  async registerTrads(app) {
    const { locales } = app;
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-IGOLzfH6.js")), "./translations/fr.json": () => Promise.resolve().then(() => require("./fr-o9I0MEIB.js")) }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: helperPlugin.prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
exports.index = index;
exports.pluginId = pluginId;
//# sourceMappingURL=index-mjWlxKqq.js.map
