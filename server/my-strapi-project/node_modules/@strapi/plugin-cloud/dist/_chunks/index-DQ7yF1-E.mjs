import { prefixPluginTranslations } from "@strapi/helper-plugin";
import { useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { Cloud } from "@strapi/icons";
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
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(pluginId);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsx(Cloud, {});
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
          const { App } = await import("./App-nHWVlMbd.mjs");
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
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-evVkl65r.mjs"), "./translations/fr.json": () => import("./fr-e4xtqkR1.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
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
export {
  index as i,
  pluginId as p
};
//# sourceMappingURL=index-DQ7yF1-E.mjs.map
