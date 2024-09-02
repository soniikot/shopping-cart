"use strict";
const helperPlugin = require("@strapi/helper-plugin");
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
            const { ProtectedSettingsPage } = await Promise.resolve().then(() => require("./Settings-tXOLe-gH.js"));
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
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => Promise.resolve().then(() => require("./ar-buxuyUw4.js")), "./translations/cs.json": () => Promise.resolve().then(() => require("./cs-Rhm_8h27.js")), "./translations/de.json": () => Promise.resolve().then(() => require("./de-PxqIhQWP.js")), "./translations/dk.json": () => Promise.resolve().then(() => require("./dk-0Soxi2pi.js")), "./translations/en.json": () => Promise.resolve().then(() => require("./en-bslL3woJ.js")), "./translations/es.json": () => Promise.resolve().then(() => require("./es-FVOcLrc2.js")), "./translations/fr.json": () => Promise.resolve().then(() => require("./fr-WSNjl35b.js")), "./translations/id.json": () => Promise.resolve().then(() => require("./id-hSZ6h2g4.js")), "./translations/it.json": () => Promise.resolve().then(() => require("./it-vFQWdS1G.js")), "./translations/ja.json": () => Promise.resolve().then(() => require("./ja-8h61JsgQ.js")), "./translations/ko.json": () => Promise.resolve().then(() => require("./ko-G1Cs1Zcn.js")), "./translations/ms.json": () => Promise.resolve().then(() => require("./ms-aHGKFQw_.js")), "./translations/nl.json": () => Promise.resolve().then(() => require("./nl-XuH0e7BF.js")), "./translations/pl.json": () => Promise.resolve().then(() => require("./pl-XWCGWhds.js")), "./translations/pt-BR.json": () => Promise.resolve().then(() => require("./pt-BR-2JqnmZxw.js")), "./translations/pt.json": () => Promise.resolve().then(() => require("./pt-2z2Wjkzh.js")), "./translations/ru.json": () => Promise.resolve().then(() => require("./ru-nT53fP0j.js")), "./translations/sk.json": () => Promise.resolve().then(() => require("./sk-lWpYrbEn.js")), "./translations/th.json": () => Promise.resolve().then(() => require("./th-FsYZ7jYS.js")), "./translations/tr.json": () => Promise.resolve().then(() => require("./tr-g2esZxUX.js")), "./translations/uk.json": () => Promise.resolve().then(() => require("./uk-Nr2fObMy.js")), "./translations/vi.json": () => Promise.resolve().then(() => require("./vi-NCAo9NmD.js")), "./translations/zh-Hans.json": () => Promise.resolve().then(() => require("./zh-Hans-FjA9mmAK.js")), "./translations/zh.json": () => Promise.resolve().then(() => require("./zh-WCqAK1ll.js")) }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: helperPlugin.prefixPluginTranslations(data, "email"),
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
exports.PERMISSIONS = PERMISSIONS;
exports.admin = admin;
//# sourceMappingURL=index-Cz8vK5ZC.js.map
