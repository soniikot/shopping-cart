"use strict";
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const helperPlugin = require("@strapi/helper-plugin");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const Filters = ({ displayedFilters }) => {
  const [isVisible, setIsVisible] = React__namespace.useState(false);
  const { formatMessage } = reactIntl.useIntl();
  const buttonRef = React__namespace.useRef(null);
  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingTop: 1, paddingBottom: 1, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          variant: "tertiary",
          ref: buttonRef,
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Filter, {}),
          onClick: handleToggle,
          size: "S",
          children: formatMessage({ id: "app.utils.filters", defaultMessage: "Filters" })
        }
      ),
      isVisible && /* @__PURE__ */ jsxRuntime.jsx(
        helperPlugin.FilterPopoverURLQuery,
        {
          displayedFilters,
          isVisible,
          onToggle: handleToggle,
          source: buttonRef
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.FilterListURLQuery, { filtersSchema: displayedFilters })
  ] });
};
exports.Filters = Filters;
//# sourceMappingURL=Filters-Gdnt7qft.js.map
