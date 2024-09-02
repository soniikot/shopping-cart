import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Main, HeaderLayout, ContentLayout, Flex, Box, Typography, Grid, GridItem, TextInput, Select, Option, Button } from "@strapi/design-system";
import { translatedErrors, CheckPagePermissions, useNotification, useOverlayBlocker, useFetchClient, useFocusWhenNavigate, SettingsPageTitle, LoadingIndicatorPage, getYupInnerErrors } from "@strapi/helper-plugin";
import { Envelop } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useQuery, useMutation } from "react-query";
import styled from "styled-components";
import * as yup from "yup";
import { ValidationError } from "yup";
import { P as PERMISSIONS } from "./index-lrNO1xVF.mjs";
const schema = yup.object().shape({
  email: yup.string().email(translatedErrors.email).required(translatedErrors.required)
});
const DocumentationLink = styled.a`
  color: ${({ theme }) => theme.colors.primary600};
`;
const ProtectedSettingsPage = () => /* @__PURE__ */ jsx(CheckPagePermissions, { permissions: PERMISSIONS.settings, children: /* @__PURE__ */ jsx(SettingsPage, {}) });
const SettingsPage = () => {
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const { get, post } = useFetchClient();
  const [testAddress, setTestAddress] = React.useState("");
  const [isTestAddressValid, setIsTestAddressValid] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});
  const { data, isLoading } = useQuery(["email", "settings"], async () => {
    const res = await get("/email/settings");
    const {
      data: { config }
    } = res;
    return config;
  });
  const mutation = useMutation(
    async (body) => {
      await post("/email/test", body);
    },
    {
      onError() {
        toggleNotification({
          type: "warning",
          message: formatMessage(
            {
              id: "email.Settings.email.plugin.notification.test.error",
              defaultMessage: "Failed to send a test mail to {to}"
            },
            { to: testAddress }
          )
        });
      },
      onSuccess() {
        toggleNotification({
          type: "success",
          message: formatMessage(
            {
              id: "email.Settings.email.plugin.notification.test.success",
              defaultMessage: "Email test succeeded, check the {to} mailbox"
            },
            { to: testAddress }
          )
        });
      },
      retry: false
    }
  );
  useFocusWhenNavigate();
  React.useEffect(() => {
    schema.validate({ email: testAddress }, { abortEarly: false }).then(() => setIsTestAddressValid(true)).catch(() => setIsTestAddressValid(false));
  }, [testAddress]);
  const handleChange = (event) => {
    setTestAddress(() => event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate({ email: testAddress }, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        setFormErrors(getYupInnerErrors(error));
      }
    }
    lockApp();
    mutation.mutate({ to: testAddress });
    unlockApp();
  };
  return /* @__PURE__ */ jsxs(Main, { labelledBy: "title", "aria-busy": isLoading || mutation.isLoading, children: [
    /* @__PURE__ */ jsx(
      SettingsPageTitle,
      {
        name: formatMessage({
          id: "email.Settings.email.plugin.title",
          defaultMessage: "Configuration"
        })
      }
    ),
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        id: "title",
        title: formatMessage({
          id: "email.Settings.email.plugin.title",
          defaultMessage: "Configuration"
        }),
        subtitle: formatMessage({
          id: "email.Settings.email.plugin.subTitle",
          defaultMessage: "Test the settings for the Email plugin"
        })
      }
    ),
    /* @__PURE__ */ jsx(ContentLayout, { children: isLoading ? /* @__PURE__ */ jsx(LoadingIndicatorPage, {}) : data && /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 7, children: [
      /* @__PURE__ */ jsx(
        Box,
        {
          background: "neutral0",
          hasRadius: true,
          shadow: "filterShadow",
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
            /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
              /* @__PURE__ */ jsx(Typography, { variant: "delta", as: "h2", children: formatMessage({
                id: "email.Settings.email.plugin.title.config",
                defaultMessage: "Configuration"
              }) }),
              /* @__PURE__ */ jsx(Typography, { children: formatMessage(
                {
                  id: "email.Settings.email.plugin.text.configuration",
                  defaultMessage: "The plugin is configured through the {file} file, checkout this {link} for the documentation."
                },
                {
                  file: "./config/plugins.js",
                  link: /* @__PURE__ */ jsx(
                    DocumentationLink,
                    {
                      href: "https://docs.strapi.io/developer-docs/latest/plugins/email.html",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: formatMessage({
                        id: "email.link",
                        defaultMessage: "Link"
                      })
                    }
                  )
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs(Grid, { gap: 5, children: [
              /* @__PURE__ */ jsx(GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "shipper-email",
                  label: formatMessage({
                    id: "email.Settings.email.plugin.label.defaultFrom",
                    defaultMessage: "Default sender email"
                  }),
                  placeholder: formatMessage({
                    id: "email.Settings.email.plugin.placeholder.defaultFrom",
                    defaultMessage: "ex: Strapi No-Reply '<'no-reply@strapi.io'>'"
                  }),
                  disabled: true,
                  value: data.settings.defaultFrom
                }
              ) }),
              /* @__PURE__ */ jsx(GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsx(
                TextInput,
                {
                  name: "response-email",
                  label: formatMessage({
                    id: "email.Settings.email.plugin.label.defaultReplyTo",
                    defaultMessage: "Default response email"
                  }),
                  placeholder: formatMessage({
                    id: "email.Settings.email.plugin.placeholder.defaultReplyTo",
                    defaultMessage: `ex: Strapi '<'example@strapi.io'>'`
                  }),
                  disabled: true,
                  value: data.settings.defaultReplyTo
                }
              ) }),
              /* @__PURE__ */ jsx(GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsx(
                Select,
                {
                  name: "email-provider",
                  label: formatMessage({
                    id: "email.Settings.email.plugin.label.provider",
                    defaultMessage: "Email provider"
                  }),
                  disabled: true,
                  value: data.provider,
                  children: /* @__PURE__ */ jsx(Option, { value: data.provider, children: data.provider })
                }
              ) })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        Flex,
        {
          alignItems: "stretch",
          background: "neutral0",
          direction: "column",
          gap: 4,
          hasRadius: true,
          shadow: "filterShadow",
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "delta", as: "h2", children: formatMessage({
              id: "email.Settings.email.plugin.title.test",
              defaultMessage: "Test email delivery"
            }) }),
            /* @__PURE__ */ jsxs(Grid, { gap: 5, children: [
              /* @__PURE__ */ jsx(GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "test-address-input",
                  name: "test-address",
                  onChange: handleChange,
                  label: formatMessage({
                    id: "email.Settings.email.plugin.label.testAddress",
                    defaultMessage: "Recipient email"
                  }),
                  value: testAddress,
                  error: formErrors.email?.id && formatMessage({
                    id: `email.${formErrors.email?.id}`,
                    defaultMessage: "This is an invalid email"
                  }),
                  placeholder: formatMessage({
                    id: "email.Settings.email.plugin.placeholder.testAddress",
                    defaultMessage: "ex: developer@example.com"
                  })
                }
              ) }),
              /* @__PURE__ */ jsx(GridItem, { col: 7, s: 12, children: /* @__PURE__ */ jsx(
                Button,
                {
                  loading: mutation.isLoading,
                  disabled: !isTestAddressValid,
                  type: "submit",
                  startIcon: /* @__PURE__ */ jsx(Envelop, {}),
                  children: formatMessage({
                    id: "email.Settings.email.plugin.button.test-email",
                    defaultMessage: "Send test email"
                  })
                }
              ) })
            ] })
          ]
        }
      )
    ] }) }) })
  ] });
};
export {
  ProtectedSettingsPage
};
//# sourceMappingURL=Settings-kOsgEBAi.mjs.map
