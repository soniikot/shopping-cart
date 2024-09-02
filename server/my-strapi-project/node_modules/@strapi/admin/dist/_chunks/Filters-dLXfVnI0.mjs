import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import * as React from "react";
import { Box, Button } from "@strapi/design-system";
import { FilterPopoverURLQuery, FilterListURLQuery } from "@strapi/helper-plugin";
import { Filter } from "@strapi/icons";
import { useIntl } from "react-intl";
const Filters = ({ displayedFilters }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { formatMessage } = useIntl();
  const buttonRef = React.useRef(null);
  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Box, { paddingTop: 1, paddingBottom: 1, children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "tertiary",
          ref: buttonRef,
          startIcon: /* @__PURE__ */ jsx(Filter, {}),
          onClick: handleToggle,
          size: "S",
          children: formatMessage({ id: "app.utils.filters", defaultMessage: "Filters" })
        }
      ),
      isVisible && /* @__PURE__ */ jsx(
        FilterPopoverURLQuery,
        {
          displayedFilters,
          isVisible,
          onToggle: handleToggle,
          source: buttonRef
        }
      )
    ] }),
    /* @__PURE__ */ jsx(FilterListURLQuery, { filtersSchema: displayedFilters })
  ] });
};
export {
  Filters as F
};
//# sourceMappingURL=Filters-dLXfVnI0.mjs.map
