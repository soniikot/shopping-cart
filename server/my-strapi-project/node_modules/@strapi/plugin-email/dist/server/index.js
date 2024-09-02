"use strict";
const _ = require("lodash");
const utils = require("@strapi/utils");
const fp = require("lodash/fp");
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
const ___namespace = /* @__PURE__ */ _interopNamespace(_);
const createProvider = (emailConfig) => {
  const providerName = emailConfig.provider.toLowerCase();
  let provider;
  let modulePath;
  try {
    modulePath = require.resolve(`@strapi/provider-email-${providerName}`);
  } catch (error) {
    if (error !== null && typeof error === "object" && "code" in error && error.code === "MODULE_NOT_FOUND") {
      modulePath = providerName;
    } else {
      throw error;
    }
  }
  try {
    provider = require(modulePath);
  } catch (err) {
    throw new Error(`Could not load email provider "${providerName}".`);
  }
  return provider.init(emailConfig.providerOptions, emailConfig.settings);
};
const bootstrap = async ({ strapi: strapi2 }) => {
  const emailConfig = strapi2.config.get("plugin.email");
  strapi2.plugin("email").provider = createProvider(emailConfig);
  const actions = [
    {
      section: "settings",
      category: "email",
      displayName: "Access the Email Settings page",
      uid: "settings.read",
      pluginName: "email"
    }
  ];
  await strapi2.admin.services.permission.actionProvider.registerMany(actions);
};
const { createStrictInterpolationRegExp } = utils.template;
const getProviderSettings = () => strapi.config.get("plugin.email");
const send = async (options) => strapi.plugin("email").provider.send(options);
const sendTemplatedEmail = (emailOptions, emailTemplate, data) => {
  const attributes = ["subject", "text", "html"];
  const missingAttributes = ___namespace.difference(attributes, Object.keys(emailTemplate));
  if (missingAttributes.length > 0) {
    throw new Error(
      `Following attributes are missing from your email template : ${missingAttributes.join(", ")}`
    );
  }
  const allowedInterpolationVariables = utils.keysDeep(data);
  const interpolate = createStrictInterpolationRegExp(allowedInterpolationVariables, "g");
  const templatedAttributes = attributes.reduce(
    (compiled, attribute) => emailTemplate[attribute] ? Object.assign(compiled, {
      [attribute]: ___namespace.template(emailTemplate[attribute], {
        interpolate
      })(data)
    }) : compiled,
    {}
  );
  return strapi.plugin("email").provider.send({ ...emailOptions, ...templatedAttributes });
};
const emailService = () => ({
  getProviderSettings,
  send,
  sendTemplatedEmail
});
const services = { email: emailService };
const admin = {
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "email.send",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "POST",
      path: "/test",
      handler: "email.test",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          { name: "admin::hasPermissions", config: { actions: ["plugin::email.settings.read"] } }
        ]
      }
    },
    {
      method: "GET",
      path: "/settings",
      handler: "email.getSettings",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          { name: "admin::hasPermissions", config: { actions: ["plugin::email.settings.read"] } }
        ]
      }
    }
  ]
};
const contentApi = {
  type: "content-api",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: "email.send"
    }
  ]
};
const routes = {
  admin,
  "content-api": contentApi
};
const { ApplicationError } = utils.errors;
const emailController = {
  async send(ctx) {
    const options = ctx.request.body;
    try {
      await strapi.plugin("email").service("email").send(options);
    } catch (error) {
      if (error instanceof Error) {
        if ("statusCode" in error && error.statusCode === 400) {
          throw new ApplicationError(error.message);
        } else {
          throw new Error(`Couldn't send email: ${error.message}.`);
        }
      }
    }
    ctx.send({});
  },
  async test(ctx) {
    const { to } = ctx.request.body;
    if (!to) {
      throw new ApplicationError("No recipient(s) are given");
    }
    const email = {
      to,
      subject: `Strapi test mail to: ${to}`,
      text: `Great! You have correctly configured the Strapi email plugin with the ${strapi.config.get(
        "plugin.email.provider"
      )} provider. \r
For documentation on how to use the email plugin checkout: https://docs.strapi.io/developer-docs/latest/plugins/email.html`
    };
    try {
      await strapi.plugin("email").service("email").send(email);
    } catch (error) {
      if (error instanceof Error) {
        if ("statusCode" in error && error.statusCode === 400) {
          throw new ApplicationError(error.message);
        } else {
          throw new Error(`Couldn't send test email: ${error.message}.`);
        }
      }
    }
    ctx.send({});
  },
  async getSettings(ctx) {
    const config2 = strapi.plugin("email").service("email").getProviderSettings();
    ctx.send({
      config: fp.pick(
        ["provider", "settings.defaultFrom", "settings.defaultReplyTo", "settings.testAddress"],
        config2
      )
    });
  }
};
const controllers = { email: emailController };
const config = {
  default: {
    provider: "sendmail",
    providerOptions: {},
    settings: {
      defaultFrom: "Strapi <no-reply@strapi.io>"
    }
  },
  validator() {
  }
};
const index = {
  bootstrap,
  services,
  routes,
  controllers,
  config
};
module.exports = index;
//# sourceMappingURL=index.js.map
