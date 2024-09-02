import { jsxs, jsx } from "react/jsx-runtime";
import { Main, HeaderLayout, ContentLayout, EmptyStateLayout, LinkButton } from "@strapi/design-system";
import { useFocusWhenNavigate } from "@strapi/helper-plugin";
import { ArrowRight, EmptyPictures } from "@strapi/icons";
import { useIntl } from "react-intl";
const InternalErrorPage = () => {
  const { formatMessage } = useIntl();
  useFocusWhenNavigate();
  return /* @__PURE__ */ jsxs(Main, { labelledBy: "title", children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        id: "title",
        title: formatMessage({
          id: "content-manager.pageNotFound",
          defaultMessage: "Page not found"
        })
      }
    ),
    /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        action: /* @__PURE__ */ jsx(LinkButton, { variant: "secondary", endIcon: /* @__PURE__ */ jsx(ArrowRight, {}), to: "/", children: formatMessage({
          id: "app.components.NotFoundPage.back",
          defaultMessage: "Back to homepage"
        }) }),
        content: formatMessage({
          id: "notification.error",
          defaultMessage: "An error occured"
        }),
        hasRadius: true,
        icon: /* @__PURE__ */ jsx(EmptyPictures, { width: "10rem" }),
        shadow: "tableShadow"
      }
    ) })
  ] });
};
export {
  InternalErrorPage
};
//# sourceMappingURL=InternalErrorPage-7JIAF-Ev.mjs.map
