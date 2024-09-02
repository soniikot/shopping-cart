"use strict";
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const styled = require("styled-components");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const SSOProviders = ({ providers, displayAllProviders }) => {
  const { formatMessage } = reactIntl.useIntl();
  if (displayAllProviders) {
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid, { gap: 4, children: providers.map((provider) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsx(SSOProviderButton, { provider }) }, provider.uid)) });
  }
  if (providers.length > 2 && !displayAllProviders) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid, { gap: 4, children: [
      providers.slice(0, 2).map((provider) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsx(SSOProviderButton, { provider }) }, provider.uid)),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Tooltip,
        {
          label: formatMessage({
            id: "global.see-more"
          }),
          children: /* @__PURE__ */ jsxRuntime.jsx(SSOButton, { as: reactRouterDom.Link, to: "/auth/providers", children: /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": true, children: "•••" }) })
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(SSOProvidersWrapper, { justifyContent: "center", children: providers.map((provider) => /* @__PURE__ */ jsxRuntime.jsx(SSOProviderButton, { provider }, provider.uid)) });
};
const SSOProvidersWrapper = styled__default.default(designSystem.Flex)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({ theme }) => theme.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({ theme }) => theme.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({ theme }) => theme.spaces[2]};
  }
`;
const SSOProviderButton = ({ provider }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tooltip, { label: provider.displayName, children: /* @__PURE__ */ jsxRuntime.jsx(SSOButton, { href: `${window.strapi.backendURL}/admin/connect/${provider.uid}`, children: provider.icon ? /* @__PURE__ */ jsxRuntime.jsx("img", { src: provider.icon, "aria-hidden": true, alt: "", height: "32px" }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: provider.displayName }) }) });
};
const SSOButton = styled__default.default.a`
  width: ${136 / 16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48 / 16}rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({ theme }) => theme.colors.neutral600};
`;
exports.SSOProviders = SSOProviders;
//# sourceMappingURL=SSOProviders-Z6IAEre2.js.map
