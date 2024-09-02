import { prefixPluginTranslations } from "@strapi/helper-plugin";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const PERMISSIONS = {
  // This permission regards the main component (App) and is used to tell
  // If the plugin link should be displayed in the menu
  // And also if the plugin is accessible. This use case is found when a user types the url of the
  // plugin directly in the browser
  settings: [{ action: "plugin::email.settings.read", subject: null }]
};
const admin = {
  // TODO typing app in strapi/types as every plugin needs it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(app) {
    app.createSettingSection(
      {
        id: "email",
        intlLabel: { id: "email.SettingsNav.section-label", defaultMessage: "Email Plugin" }
      },
      [
        {
          intlLabel: {
            id: "email.Settings.email.plugin.title",
            defaultMessage: "Settings"
          },
          id: "settings",
          to: `/settings/email`,
          async Component() {
            const { ProtectedSettingsPage } = await import("./Settings-kOsgEBAi.mjs");
            return ProtectedSettingsPage;
          },
          permissions: PERMISSIONS.settings
        }
      ]
    );
    app.registerPlugin({
      id: "email",
      name: "email"
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  bootstrap() {
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => import("./ar--WjMPIRL.mjs"), "./translations/cs.json": () => import("./cs-rqM0HXju.mjs"), "./translations/de.json": () => import("./de-Y9xqNEoA.mjs"), "./translations/dk.json": () => import("./dk-9BvzO1Z4.mjs"), "./translations/en.json": () => import("./en-u2RgEF5d.mjs"), "./translations/es.json": () => import("./es-5S-jv_iF.mjs"), "./translations/fr.json": () => import("./fr--lu63fR9.mjs"), "./translations/id.json": () => import("./id-inlH2S97.mjs"), "./translations/it.json": () => import("./it-1VgFtCa5.mjs"), "./translations/ja.json": () => import("./ja-2RIm-gdA.mjs"), "./translations/ko.json": () => import("./ko-FS6iSiMF.mjs"), "./translations/ms.json": () => import("./ms-msJ5VJP-.mjs"), "./translations/nl.json": () => import("./nl-nqu0tpen.mjs"), "./translations/pl.json": () => import("./pl-OEzE99CQ.mjs"), "./translations/pt-BR.json": () => import("./pt-BR-NChlUBNo.mjs"), "./translations/pt.json": () => import("./pt-qlftKgX5.mjs"), "./translations/ru.json": () => import("./ru-e-9QT8uo.mjs"), "./translations/sk.json": () => import("./sk-ynr7Qeic.mjs"), "./translations/th.json": () => import("./th-AXP1swr_.mjs"), "./translations/tr.json": () => import("./tr-ddMDJOmn.mjs"), "./translations/uk.json": () => import("./uk-VnKUi6CK.mjs"), "./translations/vi.json": () => import("./vi-rHzGZoeX.mjs"), "./translations/zh-Hans.json": () => import("./zh-Hans-yp2AYznJ.mjs"), "./translations/zh.json": () => import("./zh-LVlFs0Ol.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, "email"),
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
  PERMISSIONS as P,
  admin as a
};
//# sourceMappingURL=index-lrNO1xVF.mjs.map
