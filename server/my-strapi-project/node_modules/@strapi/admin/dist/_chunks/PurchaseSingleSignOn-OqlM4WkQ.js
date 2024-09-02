"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const PurchaseSingleSignOn = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Layout, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: formatMessage({
          id: "Settings.sso.title",
          defaultMessage: "Single Sign-On"
        }),
        subtitle: formatMessage({
          id: "Settings.sso.subTitle",
          defaultMessage: "Configure the settings for the Single Sign-On feature."
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "Settings.sso.not-available",
          defaultMessage: "SSO is only available as part of a paid plan. Upgrade to configure additional sign-in & sign-up methods for your administration panel."
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          v2.LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ExternalLink, {}),
            href: "https://strp.cc/46Fk1BA",
            isExternal: true,
            target: "_blank",
            children: formatMessage({
              id: "global.learn-more",
              defaultMessage: "Learn more"
            })
          }
        )
      }
    ) })
  ] }) });
};
exports.PurchaseSingleSignOn = PurchaseSingleSignOn;
//# sourceMappingURL=PurchaseSingleSignOn-OqlM4WkQ.js.map
