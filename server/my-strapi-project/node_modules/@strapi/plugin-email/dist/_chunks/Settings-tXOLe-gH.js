"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const helperPlugin = require("@strapi/helper-plugin");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const reactQuery = require("react-query");
const styled = require("styled-components");
const yup = require("yup");
const index = require("./index-Cz8vK5ZC.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
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
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const schema = yup__namespace.object().shape({
  email: yup__namespace.string().email(helperPlugin.translatedErrors.email).required(helperPlugin.translatedErrors.required)
});
const DocumentationLink = styled__default.default.a`
  color: ${({ theme }) => theme.colors.primary600};
`;
const ProtectedSettingsPage = () => /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.CheckPagePermissions, { permissions: index.PERMISSIONS.settings, children: /* @__PURE__ */ jsxRuntime.jsx(SettingsPage, {}) });
const SettingsPage = () => {
  const toggleNotification = helperPlugin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const { lockApp, unlockApp } = helperPlugin.useOverlayBlocker();
  const { get, post } = helperPlugin.useFetchClient();
  const [testAddress, setTestAddress] = React__namespace.useState("");
  const [isTestAddressValid, setIsTestAddressValid] = React__namespace.useState(false);
  const [formErrors, setFormErrors] = React__namespace.useState({});
  const { data, isLoading } = reactQuery.useQuery(["email", "settings"], async () => {
    const res = await get("/email/settings");
    const {
      data: { config }
    } = res;
    return config;
  });
  const mutation = reactQuery.useMutation(
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
  helperPlugin.useFocusWhenNavigate();
  React__namespace.useEffect(() => {
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
      if (error instanceof yup.ValidationError) {
        setFormErrors(helperPlugin.getYupInnerErrors(error));
      }
    }
    lockApp();
    mutation.mutate({ to: testAddress });
    unlockApp();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { labelledBy: "title", "aria-busy": isLoading || mutation.isLoading, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      helperPlugin.SettingsPageTitle,
      {
        name: formatMessage({
          id: "email.Settings.email.plugin.title",
          defaultMessage: "Configuration"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
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
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: isLoading ? /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {}) : data && /* @__PURE__ */ jsxRuntime.jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 7, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Box,
        {
          background: "neutral0",
          hasRadius: true,
          shadow: "filterShadow",
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", as: "h2", children: formatMessage({
                id: "email.Settings.email.plugin.title.config",
                defaultMessage: "Configuration"
              }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: formatMessage(
                {
                  id: "email.Settings.email.plugin.text.configuration",
                  defaultMessage: "The plugin is configured through the {file} file, checkout this {link} for the documentation."
                },
                {
                  file: "./config/plugins.js",
                  link: /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid, { gap: 5, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.TextInput,
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.TextInput,
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.Select,
                {
                  name: "email-provider",
                  label: formatMessage({
                    id: "email.Settings.email.plugin.label.provider",
                    defaultMessage: "Email provider"
                  }),
                  disabled: true,
                  value: data.provider,
                  children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Option, { value: data.provider, children: data.provider })
                }
              ) })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Flex,
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", as: "h2", children: formatMessage({
              id: "email.Settings.email.plugin.title.test",
              defaultMessage: "Test email delivery"
            }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid, { gap: 5, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.TextInput,
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 7, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.Button,
                {
                  loading: mutation.isLoading,
                  disabled: !isTestAddressValid,
                  type: "submit",
                  startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Envelop, {}),
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
exports.ProtectedSettingsPage = ProtectedSettingsPage;
//# sourceMappingURL=Settings-tXOLe-gH.js.map
