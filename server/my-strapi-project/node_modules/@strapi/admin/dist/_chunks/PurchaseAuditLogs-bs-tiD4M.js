"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const PurchaseAuditLogs = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Layout, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: formatMessage({ id: "global.auditLogs", defaultMessage: "Audit Logs" }),
        subtitle: formatMessage({
          id: "Settings.permissions.auditLogs.listview.header.subtitle",
          defaultMessage: "Logs of all the activities that happened in your environment"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "Settings.permissions.auditLogs.not-available",
          defaultMessage: "Audit Logs is only available as part of a paid plan. Upgrade to get a searchable and filterable display of all activities."
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          v2.LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ExternalLink, {}),
            href: "https://strp.cc/45mbAdF",
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
exports.PurchaseAuditLogs = PurchaseAuditLogs;
//# sourceMappingURL=PurchaseAuditLogs-bs-tiD4M.js.map
