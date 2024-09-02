import { jsx, jsxs } from "react/jsx-runtime";
import { Layout, Main, HeaderLayout, Box, EmptyStateLayout } from "@strapi/design-system";
import { LinkButton } from "@strapi/design-system/v2";
import { EmptyPermissions, ExternalLink } from "@strapi/icons";
import { useIntl } from "react-intl";
const PurchaseSingleSignOn = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
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
    /* @__PURE__ */ jsx(Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsx(EmptyPermissions, { width: "10rem" }),
        content: formatMessage({
          id: "Settings.sso.not-available",
          defaultMessage: "SSO is only available as part of a paid plan. Upgrade to configure additional sign-in & sign-up methods for your administration panel."
        }),
        action: /* @__PURE__ */ jsx(
          LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsx(ExternalLink, {}),
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
export {
  PurchaseSingleSignOn
};
//# sourceMappingURL=PurchaseSingleSignOn-H8KWtk1K.mjs.map
