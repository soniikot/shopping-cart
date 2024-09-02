import { jsx, jsxs } from "react/jsx-runtime";
import { Layout, Main, HeaderLayout, Box, EmptyStateLayout } from "@strapi/design-system";
import { LinkButton } from "@strapi/design-system/v2";
import { EmptyPermissions, ExternalLink } from "@strapi/icons";
import { useIntl } from "react-intl";
const PurchaseReviewWorkflows = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
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
    /* @__PURE__ */ jsx(Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsx(EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "Settings.review-workflows.not-available",
          defaultMessage: "Review Workflows is only available as part of a paid plan. Upgrade to create and manage workflows."
        }),
        action: /* @__PURE__ */ jsx(
          LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsx(ExternalLink, {}),
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
export {
  PurchaseReviewWorkflows
};
//# sourceMappingURL=PurchaseReviewWorkflows-rVcCufNv.mjs.map
