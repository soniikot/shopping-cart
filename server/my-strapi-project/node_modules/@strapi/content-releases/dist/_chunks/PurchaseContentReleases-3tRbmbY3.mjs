import { jsx, jsxs } from "react/jsx-runtime";
import { Layout, Main, HeaderLayout, Box, EmptyStateLayout } from "@strapi/design-system";
import { LinkButton } from "@strapi/design-system/v2";
import { EmptyPermissions, ExternalLink } from "@strapi/icons";
import { useIntl } from "react-intl";
const PurchaseContentReleases = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
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
    /* @__PURE__ */ jsx(Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsx(EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "content-releases.pages.PurchaseRelease.not-available",
          defaultMessage: "Releases is only available as part of a paid plan. Upgrade to create and manage releases."
        }),
        action: /* @__PURE__ */ jsx(
          LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsx(ExternalLink, {}),
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
export {
  PurchaseContentReleases
};
//# sourceMappingURL=PurchaseContentReleases-3tRbmbY3.mjs.map
