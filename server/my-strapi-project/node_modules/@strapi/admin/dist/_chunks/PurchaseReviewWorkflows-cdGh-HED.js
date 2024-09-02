"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const PurchaseReviewWorkflows = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Layout, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: formatMessage({
          id: "Settings.review-workflows.list.page.title",
          defaultMessage: "Review Workflows"
        }),
        subtitle: formatMessage({
          id: "Settings.review-workflows.list.page.subtitle",
          defaultMessage: "Manage your content review process"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "Settings.review-workflows.not-available",
          defaultMessage: "Review Workflows is only available as part of a paid plan. Upgrade to create and manage workflows."
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          v2.LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ExternalLink, {}),
            href: "https://strp.cc/3tdNfJq",
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
exports.PurchaseReviewWorkflows = PurchaseReviewWorkflows;
//# sourceMappingURL=PurchaseReviewWorkflows-cdGh-HED.js.map
