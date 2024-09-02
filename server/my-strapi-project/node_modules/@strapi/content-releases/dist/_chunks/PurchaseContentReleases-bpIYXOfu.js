"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const PurchaseContentReleases = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Layout, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: formatMessage({
          id: "content-releases.pages.Releases.title",
          defaultMessage: "Releases"
        }),
        subtitle: formatMessage({
          id: "content-releases.pages.PurchaseRelease.subTitle",
          defaultMessage: "Manage content updates and releases."
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(icons.EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "content-releases.pages.PurchaseRelease.not-available",
          defaultMessage: "Releases is only available as part of a paid plan. Upgrade to create and manage releases."
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          v2.LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.ExternalLink, {}),
            href: "https://strapi.io/pricing-self-hosted?utm_campaign=Growth-Experiments&utm_source=In-Product&utm_medium=Releases",
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
exports.PurchaseContentReleases = PurchaseContentReleases;
//# sourceMappingURL=PurchaseContentReleases-bpIYXOfu.js.map
