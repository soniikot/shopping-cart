"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const helperPlugin = require("@strapi/helper-plugin");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const InternalErrorPage = () => {
  const { formatMessage } = reactIntl.useIntl();
  helperPlugin.useFocusWhenNavigate();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { labelledBy: "title", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        id: "title",
        title: formatMessage({
          id: "content-manager.pageNotFound",
          defaultMessage: "Page not found"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        action: /* @__PURE__ */ jsxRuntime.jsx(designSystem.LinkButton, { variant: "secondary", endIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ArrowRight, {}), to: "/", children: formatMessage({
          id: "app.components.NotFoundPage.back",
          defaultMessage: "Back to homepage"
        }) }),
        content: formatMessage({
          id: "notification.error",
          defaultMessage: "An error occured"
        }),
        hasRadius: true,
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.EmptyPictures, { width: "10rem" }),
        shadow: "tableShadow"
      }
    ) })
  ] });
};
exports.InternalErrorPage = InternalErrorPage;
//# sourceMappingURL=InternalErrorPage-MkOX2w_Q.js.map
