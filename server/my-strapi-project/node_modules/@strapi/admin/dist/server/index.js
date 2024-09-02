"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const utils$1 = require("@strapi/utils");
require("@strapi/types");
const path = require("path");
const fse = require("fs-extra");
const koaStatic = require("koa-static");
const dateFns = require("date-fns");
const _$1 = require("lodash");
const bcrypt = require("bcryptjs");
const deepEqual = require("fast-deep-equal");
const passport$1 = require("koa-passport");
const passportLocal = require("passport-local");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ability = require("@casl/ability");
const extra = require("@casl/ability/extra");
const permissions$1 = require("@strapi/permissions");
const pmap = require("p-map");
const assert = require("assert");
const fs = require("fs");
require("koa-bodyparser");
const tsUtils = require("@strapi/typescript-utils");
const compose = require("koa-compose");
const dataTransfer$1 = require("@strapi/data-transfer");
const isLocalhostIp = require("is-localhost-ip");
const punycode = require("punycode/");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const utils__default = /* @__PURE__ */ _interopDefault(utils$1);
const path__default = /* @__PURE__ */ _interopDefault(path);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const koaStatic__default = /* @__PURE__ */ _interopDefault(koaStatic);
const ___default = /* @__PURE__ */ _interopDefault(_$1);
const bcrypt__default = /* @__PURE__ */ _interopDefault(bcrypt);
const deepEqual__default = /* @__PURE__ */ _interopDefault(deepEqual);
const passport__default = /* @__PURE__ */ _interopDefault(passport$1);
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const jwt__default = /* @__PURE__ */ _interopDefault(jwt);
const permissions__default = /* @__PURE__ */ _interopDefault(permissions$1);
const pmap__default = /* @__PURE__ */ _interopDefault(pmap);
const assert__default = /* @__PURE__ */ _interopDefault(assert);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const tsUtils__default = /* @__PURE__ */ _interopDefault(tsUtils);
const compose__default = /* @__PURE__ */ _interopDefault(compose);
const isLocalhostIp__default = /* @__PURE__ */ _interopDefault(isLocalhostIp);
const punycode__default = /* @__PURE__ */ _interopDefault(punycode);
const getService = (name2) => {
  return strapi.service(`admin::${name2}`);
};
const actions = [
  {
    uid: "marketplace.read",
    displayName: "Access the marketplace",
    pluginName: "admin",
    section: "settings",
    category: "plugins and marketplace",
    subCategory: "marketplace"
  },
  {
    uid: "webhooks.create",
    displayName: "Create",
    pluginName: "admin",
    section: "settings",
    category: "webhooks"
  },
  {
    uid: "webhooks.read",
    displayName: "Read",
    pluginName: "admin",
    section: "settings",
    category: "webhooks"
  },
  {
    uid: "webhooks.update",
    displayName: "Update",
    pluginName: "admin",
    section: "settings",
    category: "webhooks"
  },
  {
    uid: "webhooks.delete",
    displayName: "Delete",
    pluginName: "admin",
    section: "settings",
    category: "webhooks"
  },
  {
    uid: "users.create",
    displayName: "Create (invite)",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "users"
  },
  {
    uid: "users.read",
    displayName: "Read",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "users",
    aliases: [
      {
        actionId: "plugin::content-manager.explorer.read",
        subjects: ["admin::user"]
      }
    ]
  },
  {
    uid: "users.update",
    displayName: "Update",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "users"
  },
  {
    uid: "users.delete",
    displayName: "Delete",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "users"
  },
  {
    uid: "roles.create",
    displayName: "Create",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "roles"
  },
  {
    uid: "roles.read",
    displayName: "Read",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "roles",
    aliases: [
      {
        actionId: "plugin::content-manager.explorer.read",
        subjects: ["admin::role"]
      }
    ]
  },
  {
    uid: "roles.update",
    displayName: "Update",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "roles"
  },
  {
    uid: "roles.delete",
    displayName: "Delete",
    pluginName: "admin",
    section: "settings",
    category: "users and roles",
    subCategory: "roles"
  },
  {
    uid: "api-tokens.access",
    displayName: "Access the API tokens settings page",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "api Tokens"
  },
  {
    uid: "api-tokens.create",
    displayName: "Create (generate)",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "general"
  },
  {
    uid: "api-tokens.read",
    displayName: "Read",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "general"
  },
  {
    uid: "api-tokens.update",
    displayName: "Update",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "general"
  },
  {
    uid: "api-tokens.regenerate",
    displayName: "Regenerate",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "general"
  },
  {
    uid: "api-tokens.delete",
    displayName: "Delete (revoke)",
    pluginName: "admin",
    section: "settings",
    category: "api tokens",
    subCategory: "general"
  },
  {
    uid: "project-settings.update",
    displayName: "Update the project level settings",
    pluginName: "admin",
    section: "settings",
    category: "project"
  },
  {
    uid: "project-settings.read",
    displayName: "Read the project level settings",
    pluginName: "admin",
    section: "settings",
    category: "project"
  },
  {
    uid: "transfer.tokens.access",
    displayName: "Access the transfer tokens settings page",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "transfer tokens"
  },
  {
    uid: "transfer.tokens.create",
    displayName: "Create (generate)",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "general"
  },
  {
    uid: "transfer.tokens.read",
    displayName: "Read",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "general"
  },
  {
    uid: "transfer.tokens.update",
    displayName: "Update",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "general"
  },
  {
    uid: "transfer.tokens.regenerate",
    displayName: "Regenerate",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "general"
  },
  {
    uid: "transfer.tokens.delete",
    displayName: "Delete (revoke)",
    pluginName: "admin",
    section: "settings",
    category: "transfer tokens",
    subCategory: "general"
  }
];
const adminActions = {
  actions
};
const conditions = [
  {
    displayName: "Is creator",
    name: "is-creator",
    plugin: "admin",
    handler: (user2) => ({ "createdBy.id": user2.id })
  },
  {
    displayName: "Has same role as creator",
    name: "has-same-role-as-creator",
    plugin: "admin",
    handler: (user2) => ({
      "createdBy.roles": {
        $elemMatch: {
          id: {
            $in: user2.roles.map((r) => r.id)
          }
        }
      }
    })
  }
];
const adminConditions = {
  conditions
};
const defaultAdminAuthSettings = {
  providers: {
    autoRegister: false,
    defaultRole: null,
    ssoLockedRoles: null
  }
};
const registerPermissionActions = async () => {
  await getService("permission").actionProvider.registerMany(adminActions.actions);
};
const registerAdminConditions = async () => {
  await getService("permission").conditionProvider.registerMany(adminConditions.conditions);
};
const registerModelHooks = () => {
  const { sendDidChangeInterfaceLanguage: sendDidChangeInterfaceLanguage2 } = getService("metrics");
  strapi.db.lifecycles.subscribe({
    models: ["admin::user"],
    afterCreate: sendDidChangeInterfaceLanguage2,
    afterDelete: sendDidChangeInterfaceLanguage2,
    afterUpdate({ params }) {
      if (params.data.preferedLanguage) {
        sendDidChangeInterfaceLanguage2();
      }
    }
  });
};
const syncAuthSettings = async () => {
  const adminStore = await strapi.store({ type: "core", name: "admin" });
  const adminAuthSettings = await adminStore.get({ key: "auth" });
  const newAuthSettings = fp.merge(defaultAdminAuthSettings, adminAuthSettings);
  const roleExists = await getService("role").exists({
    id: newAuthSettings.providers.defaultRole
  });
  if (!roleExists) {
    newAuthSettings.providers.defaultRole = null;
  }
  await adminStore.set({ key: "auth", value: newAuthSettings });
};
const syncAPITokensPermissions = async () => {
  const validPermissions = strapi.contentAPI.permissions.providers.action.keys();
  const permissionsInDB = await utils$1.pipeAsync(
    strapi.query("admin::api-token-permission").findMany,
    // @ts-expect-error lodash types
    fp.map("action")
  )();
  const unknownPermissions = fp.uniq(fp.difference(permissionsInDB, validPermissions));
  if (unknownPermissions.length > 0) {
    await strapi.query("admin::api-token-permission").deleteMany({ where: { action: { $in: unknownPermissions } } });
  }
};
const bootstrap = async ({ strapi: strapi2 }) => {
  await registerAdminConditions();
  await registerPermissionActions();
  registerModelHooks();
  const permissionService = getService("permission");
  const userService = getService("user");
  const roleService = getService("role");
  const apiTokenService = getService("api-token");
  const transferService = getService("transfer");
  const tokenService = getService("token");
  await roleService.createRolesIfNoneExist();
  await roleService.resetSuperAdminPermissions();
  await roleService.displayWarningIfNoSuperAdmin();
  await permissionService.cleanPermissionsInDatabase();
  await userService.displayWarningIfUsersDontHaveRole();
  await syncAuthSettings();
  await syncAPITokensPermissions();
  await getService("metrics").sendUpdateProjectInformation();
  getService("metrics").startCron(strapi2);
  apiTokenService.checkSaltIsDefined();
  transferService.token.checkSaltIsDefined();
  tokenService.checkSecretIsDefined();
};
const registerAdminPanelRoute = ({ strapi: strapi2 }) => {
  let buildDir = path.resolve(strapi2.dirs.dist.root, "build");
  if (!fse__default.default.pathExistsSync(buildDir)) {
    buildDir = path.resolve(__dirname, "../../build");
  }
  const serveAdminMiddleware = async (ctx, next) => {
    await next();
    if (ctx.method !== "HEAD" && ctx.method !== "GET") {
      return;
    }
    if (ctx.body != null || ctx.status !== 404) {
      return;
    }
    ctx.type = "html";
    ctx.body = fse__default.default.createReadStream(path.join(buildDir, "index.html"));
  };
  strapi2.server.routes([
    {
      method: "GET",
      path: `${strapi2.config.admin.path}/:path*`,
      handler: [
        serveAdminMiddleware,
        serveStatic(buildDir, {
          maxage: 31536e3,
          defer: false,
          index: "index.html",
          setHeaders(res, path$1) {
            const ext = path.extname(path$1);
            if (ext !== ".html") {
              res.setHeader("cache-control", "public, max-age=31536000, immutable");
            }
          }
        })
      ],
      config: { auth: false }
    }
  ]);
};
const serveStatic = (filesDir, koaStaticOptions = {}) => {
  const serve = koaStatic__default.default(filesDir, koaStaticOptions);
  return async (ctx, next) => {
    const prev = ctx.path;
    const newPath = path.basename(ctx.path);
    ctx.path = newPath;
    await serve(ctx, async () => {
      ctx.path = prev;
      await next();
      ctx.path = newPath;
    });
    ctx.path = prev;
  };
};
const authenticate$2 = async (ctx) => {
  const { authorization } = ctx.request.header;
  if (!authorization) {
    return { authenticated: false };
  }
  const parts = authorization.split(/\s+/);
  if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
    return { authenticated: false };
  }
  const token2 = parts[1];
  const { payload, isValid } = getService("token").decodeJwtToken(token2);
  if (!isValid) {
    return { authenticated: false };
  }
  const user2 = await strapi.query("admin::user").findOne({ where: { id: payload.id }, populate: ["roles"] });
  if (!user2 || !(user2.isActive === true)) {
    return { authenticated: false };
  }
  const userAbility = await getService("permission").engine.generateUserAbility(user2);
  ctx.state.userAbility = userAbility;
  ctx.state.user = user2;
  return {
    authenticated: true,
    credentials: user2,
    ability: userAbility
  };
};
const name$1 = "admin";
const adminAuthStrategy = {
  name: name$1,
  authenticate: authenticate$2
};
const DAY_IN_MS = 24 * 60 * 60 * 1e3;
const constants$3 = {
  CONTENT_TYPE_SECTION: "contentTypes",
  SUPER_ADMIN_CODE: "strapi-super-admin",
  EDITOR_CODE: "strapi-editor",
  AUTHOR_CODE: "strapi-author",
  READ_ACTION: "plugin::content-manager.explorer.read",
  CREATE_ACTION: "plugin::content-manager.explorer.create",
  UPDATE_ACTION: "plugin::content-manager.explorer.update",
  DELETE_ACTION: "plugin::content-manager.explorer.delete",
  PUBLISH_ACTION: "plugin::content-manager.explorer.publish",
  API_TOKEN_TYPE: {
    READ_ONLY: "read-only",
    FULL_ACCESS: "full-access",
    CUSTOM: "custom"
  },
  // The front-end only displays these values
  API_TOKEN_LIFESPANS: {
    UNLIMITED: null,
    DAYS_7: 7 * DAY_IN_MS,
    DAYS_30: 30 * DAY_IN_MS,
    DAYS_90: 90 * DAY_IN_MS
  },
  TRANSFER_TOKEN_TYPE: {
    PUSH: "push",
    PULL: "pull"
  },
  TRANSFER_TOKEN_LIFESPANS: {
    UNLIMITED: null,
    DAYS_7: 7 * DAY_IN_MS,
    DAYS_30: 30 * DAY_IN_MS,
    DAYS_90: 90 * DAY_IN_MS
  }
};
const constants$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: constants$3
}, Symbol.toStringTag, { value: "Module" }));
const { UnauthorizedError: UnauthorizedError$2, ForbiddenError: ForbiddenError$1 } = utils$1.errors;
const isReadScope = (scope) => scope.endsWith("find") || scope.endsWith("findOne");
const extractToken$1 = (ctx) => {
  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    const parts = ctx.request.header.authorization.split(/\s+/);
    if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
      return null;
    }
    return parts[1];
  }
  return null;
};
const authenticate$1 = async (ctx) => {
  const apiTokenService = getService("api-token");
  const token2 = extractToken$1(ctx);
  if (!token2) {
    return { authenticated: false };
  }
  const apiToken2 = await apiTokenService.getBy({
    accessKey: apiTokenService.hash(token2)
  });
  if (!apiToken2) {
    return { authenticated: false };
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!fp.isNil(apiToken2.expiresAt)) {
    const expirationDate = new Date(apiToken2.expiresAt);
    if (expirationDate < currentDate) {
      return { authenticated: false, error: new UnauthorizedError$2("Token expired") };
    }
  }
  const hoursSinceLastUsed = dateFns.differenceInHours(currentDate, dateFns.parseISO(apiToken2.lastUsedAt));
  if (hoursSinceLastUsed >= 1) {
    await strapi.query("admin::api-token").update({
      where: { id: apiToken2.id },
      data: { lastUsedAt: currentDate }
    });
  }
  if (apiToken2.type === constants$3.API_TOKEN_TYPE.CUSTOM) {
    const ability2 = await strapi.contentAPI.permissions.engine.generateAbility(
      apiToken2.permissions.map((action2) => ({ action: action2 }))
    );
    return { authenticated: true, ability: ability2, credentials: apiToken2 };
  }
  return { authenticated: true, credentials: apiToken2 };
};
const verify$2 = (auth2, config) => {
  const { credentials: apiToken2, ability: ability2 } = auth2;
  if (!apiToken2) {
    throw new UnauthorizedError$2("Token not found");
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!fp.isNil(apiToken2.expiresAt)) {
    const expirationDate = new Date(apiToken2.expiresAt);
    if (expirationDate < currentDate) {
      throw new UnauthorizedError$2("Token expired");
    }
  }
  if (apiToken2.type === constants$3.API_TOKEN_TYPE.FULL_ACCESS) {
    return;
  }
  if (apiToken2.type === constants$3.API_TOKEN_TYPE.READ_ONLY) {
    const scopes = fp.castArray(config.scope);
    if (config.scope && scopes.every(isReadScope)) {
      return;
    }
  } else if (apiToken2.type === constants$3.API_TOKEN_TYPE.CUSTOM) {
    if (!ability2) {
      throw new ForbiddenError$1();
    }
    const scopes = fp.castArray(config.scope);
    const isAllowed = scopes.every((scope) => ability2.can(scope));
    if (isAllowed) {
      return;
    }
  }
  throw new ForbiddenError$1();
};
const apiTokenAuthStrategy = {
  name: "api-token",
  authenticate: authenticate$1,
  verify: verify$2
};
const register$1 = ({ strapi: strapi2 }) => {
  const passportMiddleware = strapi2.admin?.services.passport.init();
  strapi2.server.api("admin").use(passportMiddleware);
  strapi2.container.get("auth").register("admin", adminAuthStrategy);
  strapi2.container.get("auth").register("content-api", apiTokenAuthStrategy);
  if (strapi2.config.serveAdminPanel) {
    registerAdminPanelRoute({ strapi: strapi2 });
  }
};
const destroy = async () => {
  const { conditionProvider: conditionProvider2, actionProvider: actionProvider2 } = getService("permission");
  await conditionProvider2.clear();
  await actionProvider2.clear();
};
const subject = `Reset password`;
const html = `<p>We heard that you lost your password. Sorry about that!</p>

<p>But don’t worry! You can use the following link to reset your password:</p>

<p><%= url %></p>

<p>Thanks.</p>`;
const text = `We heard that you lost your password. Sorry about that!

But don’t worry! You can use the following link to reset your password:

<%= url %>

Thanks.`;
const forgotPasswordTemplate = { subject, text, html };
const forgotPassword$1 = {
  emailTemplate: forgotPasswordTemplate
};
const index$6 = {
  forgotPassword: forgotPassword$1
};
const isAuthenticatedAdmin = (policyCtx) => {
  return Boolean(policyCtx.state.isAuthenticated);
};
const hasPermissionsSchema = utils$1.yup.object({
  actions: utils$1.yup.array().of(
    // @ts-expect-error yup types
    utils$1.yup.lazy((val) => {
      if (___default.default.isArray(val)) {
        return utils$1.yup.array().of(utils$1.yup.string()).min(1).max(2);
      }
      if (___default.default.isString(val)) {
        return utils$1.yup.string().required();
      }
      return utils$1.yup.object().shape({
        action: utils$1.yup.string().required(),
        subject: utils$1.yup.string()
      });
    })
  )
});
const validateHasPermissionsInput = utils$1.validateYupSchema(hasPermissionsSchema);
const { createPolicy: createPolicy$1 } = utils$1.policy;
const inputModifiers = [
  {
    check: ___default.default.isString,
    transform: (action2) => ({ action: action2 })
  },
  {
    check: ___default.default.isArray,
    transform: (arr) => ({ action: arr[0], subject: arr[1] })
  },
  {
    // Has to be after the isArray check since _.isObject also matches arrays
    check: ___default.default.isObject,
    transform: (perm) => perm
  }
];
const hasPermissions = createPolicy$1({
  name: "admin::hasPermissions",
  validator: validateHasPermissionsInput,
  handler(ctx, config) {
    const { actions: actions2 } = config;
    const { userAbility: ability2 } = ctx.state;
    const permissions2 = actions2.map(
      (action2) => inputModifiers.find((modifier) => modifier.check(action2))?.transform(action2)
    );
    const isAuthorized = permissions2.every(
      ({ action: action2, subject: subject2 }) => ability2.can(action2, subject2)
    );
    return isAuthorized;
  }
});
const { createPolicy } = utils$1.policy;
const isTelemetryEnabled = createPolicy({
  name: "admin::isTelemetryEnabled",
  handler(_ctx, _config, { strapi: strapi2 }) {
    if (strapi2.telemetry.isDisabled) {
      return false;
    }
  }
});
const index$5 = { isAuthenticatedAdmin, hasPermissions, isTelemetryEnabled };
const admin$1 = [
  {
    method: "GET",
    path: "/init",
    handler: "admin.init",
    config: { auth: false }
  },
  {
    method: "GET",
    path: "/project-settings",
    handler: "admin.getProjectSettings",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: { actions: ["admin::project-settings.read"] }
        }
      ]
    }
  },
  {
    method: "POST",
    path: "/project-settings",
    handler: "admin.updateProjectSettings",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: { actions: ["admin::project-settings.update"] }
        }
      ]
    }
  },
  {
    method: "GET",
    path: "/project-type",
    handler: "admin.getProjectType",
    config: { auth: false }
  },
  {
    method: "GET",
    path: "/information",
    handler: "admin.information",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "GET",
    path: "/telemetry-properties",
    handler: "admin.telemetryProperties",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "GET",
    path: "/plugins",
    handler: "admin.plugins",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::marketplace.read"] } }
      ]
    }
  }
];
const authentication$1 = [
  {
    method: "POST",
    path: "/login",
    handler: "authentication.login",
    config: {
      auth: false,
      middlewares: ["admin::rateLimit"]
    }
  },
  {
    method: "POST",
    path: "/renew-token",
    handler: "authentication.renewToken",
    config: { auth: false }
  },
  {
    method: "POST",
    path: "/register-admin",
    handler: "authentication.registerAdmin",
    config: { auth: false }
  },
  {
    method: "GET",
    path: "/registration-info",
    handler: "authentication.registrationInfo",
    config: { auth: false }
  },
  {
    method: "POST",
    path: "/register",
    handler: "authentication.register",
    config: { auth: false }
  },
  {
    method: "POST",
    path: "/forgot-password",
    handler: "authentication.forgotPassword",
    config: { auth: false }
  },
  {
    method: "POST",
    path: "/reset-password",
    handler: "authentication.resetPassword",
    config: { auth: false }
  },
  {
    method: "POST",
    path: "/logout",
    handler: "authentication.logout",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  }
];
const permissions = [
  {
    method: "GET",
    path: "/permissions",
    handler: "permission.getAll",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "POST",
    path: "/permissions/check",
    handler: "permission.check",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  }
];
const users = [
  {
    method: "GET",
    path: "/users/me",
    handler: "authenticated-user.getMe",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "PUT",
    path: "/users/me",
    handler: "authenticated-user.updateMe",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "GET",
    path: "/users/me/permissions",
    handler: "authenticated-user.getOwnPermissions",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "POST",
    path: "/users",
    handler: "user.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::users.create"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/users",
    handler: "user.find",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::users.read"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/users/:id",
    handler: "user.findOne",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::users.read"] } }
      ]
    }
  },
  {
    method: "PUT",
    path: "/users/:id",
    handler: "user.update",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::users.update"] } }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/users/:id",
    handler: "user.deleteOne",
    config: {
      policies: [{ name: "admin::hasPermissions", config: { actions: ["admin::users.delete"] } }]
    }
  },
  {
    method: "POST",
    path: "/users/batch-delete",
    handler: "user.deleteMany",
    config: {
      policies: [{ name: "admin::hasPermissions", config: { actions: ["admin::users.delete"] } }]
    }
  }
];
const roles$1 = [
  {
    method: "GET",
    path: "/roles/:id/permissions",
    handler: "role.getPermissions",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::roles.read"] } }
      ]
    }
  },
  {
    method: "PUT",
    path: "/roles/:id/permissions",
    handler: "role.updatePermissions",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::roles.update"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/roles/:id",
    handler: "role.findOne",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::roles.read"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/roles",
    handler: "role.findAll",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::roles.read"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/roles",
    handler: "role.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["admin::roles.create"]
          }
        }
      ]
    }
  },
  {
    method: "PUT",
    path: "/roles/:id",
    handler: "role.update",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::roles.update"] } }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/roles/:id",
    handler: "role.deleteOne",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["admin::roles.delete"]
          }
        }
      ]
    }
  },
  {
    method: "POST",
    path: "/roles/batch-delete",
    handler: "role.deleteMany",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["admin::roles.delete"]
          }
        }
      ]
    }
  }
];
const webhooks$1 = [
  {
    method: "GET",
    path: "/webhooks",
    handler: "webhooks.listWebhooks",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.read"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/webhooks",
    handler: "webhooks.createWebhook",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.create"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/webhooks/:id",
    handler: "webhooks.getWebhook",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.read"] } }
      ]
    }
  },
  {
    method: "PUT",
    path: "/webhooks/:id",
    handler: "webhooks.updateWebhook",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.update"] } }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/webhooks/:id",
    handler: "webhooks.deleteWebhook",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.delete"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/webhooks/batch-delete",
    handler: "webhooks.deleteWebhooks",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.delete"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/webhooks/:id/trigger",
    handler: "webhooks.triggerWebhook",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::webhooks.update"] } }
      ]
    }
  }
];
const apiTokens = [
  {
    method: "POST",
    path: "/api-tokens",
    handler: "api-token.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.create"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/api-tokens",
    handler: "api-token.list",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.read"] } }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/api-tokens/:id",
    handler: "api-token.revoke",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.delete"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/api-tokens/:id",
    handler: "api-token.get",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.read"] } }
      ]
    }
  },
  {
    method: "PUT",
    path: "/api-tokens/:id",
    handler: "api-token.update",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.update"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/api-tokens/:id/regenerate",
    handler: "api-token.regenerate",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::api-tokens.regenerate"] } }
      ]
    }
  }
];
const contentApi$1 = [
  {
    method: "GET",
    path: "/content-api/permissions",
    handler: "content-api.getPermissions",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "GET",
    path: "/content-api/routes",
    handler: "content-api.getRoutes",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  }
];
const { UnauthorizedError: UnauthorizedError$1, ForbiddenError } = utils$1.errors;
const extractToken = (ctx) => {
  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    const parts = ctx.request.header.authorization.split(/\s+/);
    if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
      return null;
    }
    return parts[1];
  }
  return null;
};
const authenticate = async (ctx) => {
  const { token: tokenService } = getService("transfer");
  const token2 = extractToken(ctx);
  if (!token2) {
    return { authenticated: false };
  }
  const transferToken2 = await tokenService.getBy({ accessKey: tokenService.hash(token2) });
  if (!transferToken2) {
    return { authenticated: false };
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!fp.isNil(transferToken2.expiresAt)) {
    const expirationDate = new Date(transferToken2.expiresAt);
    if (expirationDate < currentDate) {
      return { authenticated: false, error: new UnauthorizedError$1("Token expired") };
    }
  }
  const hoursSinceLastUsed = dateFns.differenceInHours(currentDate, dateFns.parseISO(transferToken2.lastUsedAt));
  if (hoursSinceLastUsed >= 1) {
    await strapi.query("admin::api-token").update({
      where: { id: transferToken2.id },
      data: { lastUsedAt: currentDate }
    });
  }
  const ability2 = await getService("transfer").permission.engine.generateAbility(
    transferToken2.permissions.map((action2) => ({ action: action2 }))
  );
  return { authenticated: true, ability: ability2, credentials: transferToken2 };
};
const verify$1 = async (auth2, config = {}) => {
  const { credentials: transferToken2, ability: ability2 } = auth2;
  if (!transferToken2) {
    throw new UnauthorizedError$1("Token not found");
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!fp.isNil(transferToken2.expiresAt)) {
    const expirationDate = new Date(transferToken2.expiresAt);
    if (expirationDate < currentDate) {
      throw new UnauthorizedError$1("Token expired");
    }
  }
  if (!ability2) {
    throw new ForbiddenError();
  }
  const scopes = fp.castArray(config.scope ?? []);
  const isAllowed = scopes.every((scope) => ability2.can(scope));
  if (!isAllowed) {
    throw new ForbiddenError();
  }
};
const name = "data-transfer";
const dataTransferAuthStrategy = {
  name,
  authenticate,
  verify: verify$1
};
const transfer$2 = [
  // Transfer Push
  {
    method: "GET",
    path: "/transfer/runner/push",
    handler: "transfer.runner-push",
    config: {
      middlewares: ["admin::data-transfer"],
      auth: { strategies: [dataTransferAuthStrategy], scope: ["push"] }
    }
  },
  // Transfer Pull
  {
    method: "GET",
    path: "/transfer/runner/pull",
    handler: "transfer.runner-pull",
    config: {
      middlewares: ["admin::data-transfer"],
      auth: { strategies: [dataTransferAuthStrategy], scope: ["pull"] }
    }
  },
  // Transfer Tokens
  {
    method: "POST",
    path: "/transfer/tokens",
    handler: "transfer.token-create",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::transfer.tokens.create"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/transfer/tokens",
    handler: "transfer.token-list",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::transfer.tokens.read"] } }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/transfer/tokens/:id",
    handler: "transfer.token-revoke",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::transfer.tokens.delete"] } }
      ]
    }
  },
  {
    method: "GET",
    path: "/transfer/tokens/:id",
    handler: "transfer.token-getById",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::transfer.tokens.read"] } }
      ]
    }
  },
  {
    method: "PUT",
    path: "/transfer/tokens/:id",
    handler: "transfer.token-update",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        { name: "admin::hasPermissions", config: { actions: ["admin::transfer.tokens.update"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/transfer/tokens/:id/regenerate",
    handler: "transfer.token-regenerate",
    config: {
      middlewares: ["admin::data-transfer"],
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: { actions: ["admin::transfer.tokens.regenerate"] }
        }
      ]
    }
  }
];
const routes = {
  admin: {
    type: "admin",
    routes: [
      ...admin$1,
      ...authentication$1,
      ...permissions,
      ...users,
      ...roles$1,
      ...webhooks$1,
      ...apiTokens,
      ...contentApi$1,
      ...transfer$2
    ]
  }
};
const { ApplicationError: ApplicationError$7 } = utils$1.errors;
const hashPassword = (password2) => bcrypt__default.default.hash(password2, 10);
const validatePassword = (password2, hash2) => bcrypt__default.default.compare(password2, hash2);
const checkCredentials = async ({ email: email2, password: password2 }) => {
  const user2 = await strapi.query("admin::user").findOne({ where: { email: email2 } });
  if (!user2 || !user2.password) {
    return [null, false, { message: "Invalid credentials" }];
  }
  const isValid = await validatePassword(password2, user2.password);
  if (!isValid) {
    return [null, false, { message: "Invalid credentials" }];
  }
  if (!(user2.isActive === true)) {
    return [null, false, { message: "User not active" }];
  }
  return [null, user2];
};
const forgotPassword = async ({ email: email2 } = {}) => {
  const user2 = await strapi.query("admin::user").findOne({ where: { email: email2, isActive: true } });
  if (!user2) {
    return;
  }
  const resetPasswordToken = getService("token").createToken();
  await getService("user").updateById(user2.id, { resetPasswordToken });
  const url = `${utils$1.getAbsoluteAdminUrl(
    strapi.config
  )}/auth/reset-password?code=${resetPasswordToken}`;
  return strapi.plugin("email").service("email").sendTemplatedEmail(
    {
      to: user2.email,
      from: strapi.config.get("admin.forgotPassword.from"),
      replyTo: strapi.config.get("admin.forgotPassword.replyTo")
    },
    strapi.config.get("admin.forgotPassword.emailTemplate"),
    {
      url,
      user: ___default.default.pick(user2, ["email", "firstname", "lastname", "username"])
    }
  ).catch((err) => {
    strapi.log.error(err);
  });
};
const resetPassword = async ({ resetPasswordToken, password: password2 } = {}) => {
  const matchingUser = await strapi.query("admin::user").findOne({ where: { resetPasswordToken, isActive: true } });
  if (!matchingUser) {
    throw new ApplicationError$7();
  }
  return getService("user").updateById(matchingUser.id, {
    password: password2,
    resetPasswordToken: null
  });
};
const auth = { checkCredentials, validatePassword, hashPassword, forgotPassword, resetPassword };
const { SUPER_ADMIN_CODE: SUPER_ADMIN_CODE$3 } = constants$3;
function createUser(attributes) {
  return {
    roles: [],
    isActive: false,
    username: null,
    ...attributes
  };
}
const hasSuperAdminRole$1 = (user2) => {
  return user2.roles.filter((role2) => role2.code === SUPER_ADMIN_CODE$3).length > 0;
};
const ADMIN_USER_ALLOWED_FIELDS = ["id", "firstname", "lastname", "username"];
const getDefaultActionAttributes = () => ({
  options: {
    applyToProperties: null
  }
});
const actionFields = [
  "section",
  "displayName",
  "category",
  "subCategory",
  "pluginName",
  "subjects",
  "options",
  "actionId",
  "aliases"
];
const sanitizeActionAttributes = fp.pick(actionFields);
const computeActionId = (attributes) => {
  const { pluginName, uid } = attributes;
  if (!pluginName) {
    return `api::${uid}`;
  }
  if (pluginName === "admin") {
    return `admin::${uid}`;
  }
  return `plugin::${pluginName}.${uid}`;
};
const assignActionId = (attrs) => fp.set("actionId", computeActionId(attrs), attrs);
const assignOrOmitSubCategory = (action2) => {
  const shouldHaveSubCategory = ["settings", "plugins"].includes(action2.section);
  return shouldHaveSubCategory ? fp.set("subCategory", action2.subCategory || "general", action2) : fp.omit("subCategory", action2);
};
const appliesToProperty = fp.curry((property, action2) => {
  return fp.pipe(fp.prop("options.applyToProperties"), fp.includes(property))(action2);
});
const appliesToSubject = fp.curry((subject2, action2) => {
  return fp.isArray(action2.subjects) && fp.includes(subject2, action2.subjects);
});
const create$6 = fp.pipe(
  // Create and assign an action identifier to the action
  // (need to be done before the sanitizeActionAttributes since we need the uid here)
  assignActionId,
  // Add or remove the sub category field based on the pluginName attribute
  assignOrOmitSubCategory,
  // Remove unwanted attributes from the payload
  sanitizeActionAttributes,
  // Complete the action creation by adding default values for some attributes
  fp.merge(getDefaultActionAttributes())
);
const actionDomain = {
  actionFields,
  appliesToProperty,
  appliesToSubject,
  assignActionId,
  assignOrOmitSubCategory,
  create: create$6,
  computeActionId,
  getDefaultActionAttributes,
  sanitizeActionAttributes
};
const checkFieldsAreCorrectlyNested = (fields) => {
  if (___default.default.isNil(fields)) {
    return true;
  }
  if (!Array.isArray(fields)) {
    return false;
  }
  let failed = false;
  for (let indexA = 0; indexA < fields.length; indexA += 1) {
    failed = fields.slice(indexA + 1).some(
      (fieldB) => fieldB.startsWith(`${fields[indexA]}.`) || fields[indexA].startsWith(`${fieldB}.`)
    );
    if (failed)
      break;
  }
  return !failed;
};
const checkFieldsDontHaveDuplicates = (fields) => {
  if (___default.default.isNil(fields)) {
    return true;
  }
  if (!Array.isArray(fields)) {
    return false;
  }
  return ___default.default.uniq(fields).length === fields.length;
};
const getActionFromProvider = (actionId) => {
  return getService("permission").actionProvider.get(actionId);
};
const email = utils$1.yup.string().email().lowercase();
const firstname = utils$1.yup.string().trim().min(1);
const lastname = utils$1.yup.string();
const username = utils$1.yup.string().min(1);
const password = utils$1.yup.string().min(8).matches(/[a-z]/, "${path} must contain at least one lowercase character").matches(/[A-Z]/, "${path} must contain at least one uppercase character").matches(/\d/, "${path} must contain at least one number");
const roles = utils$1.yup.array(utils$1.yup.strapiID()).min(1);
const isAPluginName = utils$1.yup.string().test("is-a-plugin-name", "is not a plugin name", function(value) {
  return [void 0, "admin", ...Object.keys(strapi.plugins)].includes(value) ? true : this.createError({ path: this.path, message: `${this.path} is not an existing plugin` });
});
const arrayOfConditionNames = utils$1.yup.array().of(utils$1.yup.string()).test("is-an-array-of-conditions", "is not a plugin name", function(value) {
  const ids = strapi.admin.services.permission.conditionProvider.keys();
  return ___default.default.isUndefined(value) || ___default.default.difference(value, ids).length === 0 ? true : this.createError({ path: this.path, message: `contains conditions that don't exist` });
});
const permissionsAreEquals = (a, b) => a.action === b.action && (a.subject === b.subject || ___default.default.isNil(a.subject) && ___default.default.isNil(b.subject));
const checkNoDuplicatedPermissions = (permissions2) => !Array.isArray(permissions2) || permissions2.every(
  (permA, i) => permissions2.slice(i + 1).every((permB) => !permissionsAreEquals(permA, permB))
);
const checkNilFields = (action2) => function(fields) {
  if (fp.isNil(action2)) {
    return true;
  }
  return actionDomain.appliesToProperty("fields", action2) || fp.isNil(fields);
};
const fieldsPropertyValidation = (action2) => utils$1.yup.array().of(utils$1.yup.string()).nullable().test(
  "field-nested",
  "Fields format are incorrect (bad nesting).",
  checkFieldsAreCorrectlyNested
).test(
  "field-nested",
  "Fields format are incorrect (duplicates).",
  checkFieldsDontHaveDuplicates
).test(
  "fields-restriction",
  "The permission at ${path} must have fields set to null or undefined",
  // @ts-expect-error yup types
  checkNilFields(action2)
);
const permission$3 = utils$1.yup.object().shape({
  action: utils$1.yup.string().required().test("action-validity", "action is not an existing permission action", function(actionId) {
    if (fp.isNil(actionId)) {
      return true;
    }
    return !!getActionFromProvider(actionId);
  }),
  actionParameters: utils$1.yup.object().nullable(),
  subject: utils$1.yup.string().nullable().test("subject-validity", "Invalid subject submitted", function(subject2) {
    const action2 = getActionFromProvider(this.options.parent.action);
    if (!action2) {
      return true;
    }
    if (fp.isNil(action2.subjects)) {
      return fp.isNil(subject2);
    }
    if (fp.isArray(action2.subjects) && !fp.isNil(subject2)) {
      return action2.subjects.includes(subject2);
    }
    return false;
  }),
  properties: utils$1.yup.object().test("properties-structure", "Invalid property set at ${path}", function(properties) {
    const action2 = getActionFromProvider(this.options.parent.action);
    const hasNoProperties = fp.isEmpty(properties) || fp.isNil(properties);
    if (!fp.has("options.applyToProperties", action2)) {
      return hasNoProperties;
    }
    if (hasNoProperties) {
      return true;
    }
    const { applyToProperties } = action2.options;
    if (!fp.isArray(applyToProperties)) {
      return false;
    }
    return Object.keys(properties).every((property) => applyToProperties.includes(property));
  }).test(
    "fields-property",
    "Invalid fields property at ${path}",
    async function(properties = {}) {
      const action2 = getActionFromProvider(this.options.parent.action);
      if (!action2 || !properties) {
        return true;
      }
      if (!actionDomain.appliesToProperty("fields", action2)) {
        return true;
      }
      try {
        await fieldsPropertyValidation(action2).validate(properties.fields, {
          strict: true,
          abortEarly: false
        });
        return true;
      } catch (e) {
        throw this.createError({
          message: e.message,
          path: `${this.path}.fields`
        });
      }
    }
  ),
  conditions: utils$1.yup.array().of(utils$1.yup.string())
}).noUnknown();
const updatePermissions = utils$1.yup.object().shape({
  permissions: utils$1.yup.array().required().of(permission$3).test(
    "duplicated-permissions",
    "Some permissions are duplicated (same action and subject)",
    checkNoDuplicatedPermissions
  )
}).required().noUnknown();
const validators = {
  email,
  firstname,
  lastname,
  username,
  password,
  roles,
  isAPluginName,
  arrayOfConditionNames,
  permission: permission$3,
  updatePermissions
};
const { SUPER_ADMIN_CODE: SUPER_ADMIN_CODE$2 } = constants$3;
const { ValidationError: ValidationError$4 } = utils$1.errors;
const sanitizeUserRoles = (role2) => ___default.default.pick(role2, ["id", "name", "description", "code"]);
const sanitizeUser = (user2) => {
  return {
    ...___default.default.omit(user2, ["password", "resetPasswordToken", "registrationToken", "roles"]),
    roles: user2.roles && user2.roles.map(sanitizeUserRoles)
  };
};
const create$5 = async (attributes) => {
  const userInfo = {
    registrationToken: getService("token").createToken(),
    ...attributes
  };
  if (___default.default.has(attributes, "password")) {
    userInfo.password = await getService("auth").hashPassword(attributes.password);
  }
  const user2 = createUser(userInfo);
  const createdUser = await strapi.query("admin::user").create({ data: user2, populate: ["roles"] });
  getService("metrics").sendDidInviteUser();
  strapi.eventHub.emit("user.create", { user: sanitizeUser(createdUser) });
  return createdUser;
};
const updateById = async (id, attributes) => {
  if (___default.default.has(attributes, "roles")) {
    const lastAdminUser = await isLastSuperAdminUser(id);
    const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
    const willRemoveSuperAdminRole = !utils$1.stringIncludes(attributes.roles, superAdminRole.id);
    if (lastAdminUser && willRemoveSuperAdminRole) {
      throw new ValidationError$4("You must have at least one user with super admin role.");
    }
  }
  if (attributes.isActive === false) {
    const lastAdminUser = await isLastSuperAdminUser(id);
    if (lastAdminUser) {
      throw new ValidationError$4("You must have at least one user with super admin role.");
    }
  }
  if (___default.default.has(attributes, "password")) {
    const hashedPassword = await getService("auth").hashPassword(attributes.password);
    const updatedUser2 = await strapi.query("admin::user").update({
      where: { id },
      data: {
        ...attributes,
        password: hashedPassword
      },
      populate: ["roles"]
    });
    strapi.eventHub.emit("user.update", { user: sanitizeUser(updatedUser2) });
    return updatedUser2;
  }
  const updatedUser = await strapi.query("admin::user").update({
    where: { id },
    data: attributes,
    populate: ["roles"]
  });
  if (updatedUser) {
    strapi.eventHub.emit("user.update", { user: sanitizeUser(updatedUser) });
  }
  return updatedUser;
};
const resetPasswordByEmail = async (email2, password$1) => {
  const user2 = await strapi.query("admin::user").findOne({ where: { email: email2 }, populate: ["roles"] });
  if (!user2) {
    throw new Error(`User not found for email: ${email2}`);
  }
  try {
    await password.validate(password$1);
  } catch (error) {
    throw new ValidationError$4(
      "Invalid password. Expected a minimum of 8 characters with at least one number and one uppercase letter"
    );
  }
  await updateById(user2.id, { password: password$1 });
};
const isLastSuperAdminUser = async (userId) => {
  const user2 = await findOne$1(userId);
  if (!user2)
    return false;
  const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
  return superAdminRole.usersCount === 1 && hasSuperAdminRole$1(user2);
};
const exists$3 = async (attributes = {}) => {
  return await strapi.query("admin::user").count({ where: attributes }) > 0;
};
const findRegistrationInfo = async (registrationToken) => {
  const user2 = await strapi.query("admin::user").findOne({ where: { registrationToken } });
  if (!user2) {
    return void 0;
  }
  return ___default.default.pick(user2, ["email", "firstname", "lastname"]);
};
const register = async ({
  registrationToken,
  userInfo
}) => {
  const matchingUser = await strapi.query("admin::user").findOne({ where: { registrationToken } });
  if (!matchingUser) {
    throw new ValidationError$4("Invalid registration info");
  }
  return getService("user").updateById(matchingUser.id, {
    password: userInfo.password,
    firstname: userInfo.firstname,
    lastname: userInfo.lastname,
    registrationToken: null,
    isActive: true
  });
};
const findOne$1 = async (id, populate = ["roles"]) => {
  return strapi.entityService.findOne("admin::user", id, { populate });
};
const findOneByEmail = async (email2, populate = []) => {
  return strapi.query("admin::user").findOne({
    where: { email: { $eqi: email2 } },
    populate
  });
};
const findPage = async (query = {}) => {
  const enrichedQuery = fp.defaults({ populate: ["roles"] }, query);
  return strapi.entityService.findPage("admin::user", enrichedQuery);
};
const deleteById = async (id) => {
  const userToDelete = await strapi.query("admin::user").findOne({
    where: { id },
    populate: ["roles"]
  });
  if (!userToDelete) {
    return null;
  }
  if (userToDelete) {
    if (userToDelete.roles.some((r) => r.code === SUPER_ADMIN_CODE$2)) {
      const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
      if (superAdminRole.usersCount === 1) {
        throw new ValidationError$4("You must have at least one user with super admin role.");
      }
    }
  }
  const deletedUser = await strapi.query("admin::user").delete({ where: { id }, populate: ["roles"] });
  strapi.eventHub.emit("user.delete", { user: sanitizeUser(deletedUser) });
  return deletedUser;
};
const deleteByIds$2 = async (ids) => {
  const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
  const nbOfSuperAdminToDelete = await strapi.query("admin::user").count({
    where: {
      id: ids,
      roles: { id: superAdminRole.id }
    }
  });
  if (superAdminRole.usersCount === nbOfSuperAdminToDelete) {
    throw new ValidationError$4("You must have at least one user with super admin role.");
  }
  const deletedUsers = [];
  for (const id of ids) {
    const deletedUser = await strapi.query("admin::user").delete({
      where: { id },
      populate: ["roles"]
    });
    deletedUsers.push(deletedUser);
  }
  strapi.eventHub.emit("user.delete", {
    users: deletedUsers.map((deletedUser) => sanitizeUser(deletedUser))
  });
  return deletedUsers;
};
const countUsersWithoutRole = async () => {
  return strapi.query("admin::user").count({
    where: {
      roles: {
        id: { $null: true }
      }
    }
  });
};
const count$1 = async (where = {}) => {
  return strapi.query("admin::user").count({ where });
};
const assignARoleToAll = async (roleId) => {
  const users2 = await strapi.query("admin::user").findMany({
    select: ["id"],
    where: {
      roles: { id: { $null: true } }
    }
  });
  await Promise.all(
    users2.map((user2) => {
      return strapi.query("admin::user").update({
        where: { id: user2.id },
        data: { roles: [roleId] }
      });
    })
  );
};
const displayWarningIfUsersDontHaveRole = async () => {
  const count2 = await countUsersWithoutRole();
  if (count2 > 0) {
    strapi.log.warn(`Some users (${count2}) don't have any role.`);
  }
};
const getLanguagesInUse = async () => {
  const users2 = await strapi.query("admin::user").findMany({ select: ["preferedLanguage"] });
  return users2.map((user2) => user2.preferedLanguage || "en");
};
const user$1 = {
  create: create$5,
  updateById,
  exists: exists$3,
  findRegistrationInfo,
  register,
  sanitizeUser,
  findOne: findOne$1,
  findOneByEmail,
  findPage,
  deleteById,
  deleteByIds: deleteByIds$2,
  countUsersWithoutRole,
  count: count$1,
  assignARoleToAll,
  displayWarningIfUsersDontHaveRole,
  resetPasswordByEmail,
  getLanguagesInUse
};
const permissionFields = [
  "id",
  "action",
  "actionParameters",
  "subject",
  "properties",
  "conditions",
  "role"
];
const sanitizedPermissionFields = [
  "id",
  "action",
  "actionParameters",
  "subject",
  "properties",
  "conditions"
];
const sanitizePermissionFields = fp.pick(sanitizedPermissionFields);
const getDefaultPermission = () => ({
  actionParameters: {},
  conditions: [],
  properties: {},
  subject: null
});
const addCondition = fp.curry((condition2, permission2) => {
  const { conditions: conditions2 } = permission2;
  const newConditions = Array.isArray(conditions2) ? fp.uniq(conditions2.concat(condition2)) : [condition2];
  return fp.set("conditions", newConditions, permission2);
});
const removeCondition = fp.curry((condition2, permission2) => {
  return fp.set("conditions", fp.remove(fp.eq(condition2), permission2.conditions), permission2);
});
const getProperty = fp.curry(
  (property, permission2) => fp.get(`properties.${property}`, permission2)
);
const setProperty = (property, value, permission2) => {
  return fp.set(`properties.${property}`, value, permission2);
};
const deleteProperty = (property, permission2) => fp.omit(`properties.${property}`, permission2);
const create$4 = (attributes) => {
  return fp.pipe(fp.pick(permissionFields), fp.merge(getDefaultPermission()))(attributes);
};
const sanitizeConditions = fp.curry(
  (provider, permission2) => {
    if (!fp.isArray(permission2.conditions)) {
      return permission2;
    }
    return permission2.conditions.filter((condition2) => !provider.has(condition2)).reduce(
      (perm, condition2) => removeCondition(condition2, perm),
      permission2
    );
  }
);
const toPermission = (payload) => (
  // @ts-expect-error
  fp.isArray(payload) ? fp.map(create$4, payload) : create$4(payload)
);
const permissionDomain = {
  addCondition,
  removeCondition,
  create: create$4,
  deleteProperty,
  permissionFields,
  getProperty,
  sanitizedPermissionFields,
  sanitizeConditions,
  sanitizePermissionFields,
  setProperty,
  toPermission
};
const checkPermissionsSchema = utils$1.yup.object().shape({
  permissions: utils$1.yup.array().of(
    utils$1.yup.object().shape({
      action: utils$1.yup.string().required(),
      subject: utils$1.yup.string().nullable(),
      field: utils$1.yup.string()
    }).noUnknown()
  )
});
const checkPermissionsExist = function(permissions2) {
  const existingActions = getService("permission").actionProvider.values();
  const failIndex = permissions2.findIndex(
    (permission2) => !existingActions.some(
      (action2) => action2.actionId === permission2.action && (action2.section !== "contentTypes" || action2.subjects.includes(permission2.subject))
    )
  );
  return failIndex === -1 ? true : (
    // @ts-expect-error yup types
    this.createError({
      path: "permissions",
      message: `[${failIndex}] is not an existing permission action`
    })
  );
};
const actionsExistSchema = utils$1.yup.array().of(
  utils$1.yup.object().shape({
    conditions: utils$1.yup.array().of(utils$1.yup.string())
  })
).test("actions-exist", "", checkPermissionsExist);
const validatePermissionsExist = utils$1.validateYupSchema(actionsExistSchema);
const validateCheckPermissionsInput = utils$1.validateYupSchema(checkPermissionsSchema);
const validatedUpdatePermissionsInput = utils$1.validateYupSchema(validators.updatePermissions);
const { SUPER_ADMIN_CODE: SUPER_ADMIN_CODE$1, CONTENT_TYPE_SECTION } = constants$3;
const { createAsyncSeriesWaterfallHook } = utils$1.hooks;
const { ApplicationError: ApplicationError$6 } = utils$1.errors;
const hooks = {
  willResetSuperAdminPermissions: createAsyncSeriesWaterfallHook()
};
const ACTIONS = {
  publish: "plugin::content-manager.explorer.publish"
};
const sanitizeRole = fp.omit([
  "users",
  "permissions"
]);
const COMPARABLE_FIELDS = ["conditions", "properties", "subject", "action", "actionParameters"];
const pickComparableFields = fp.pick(COMPARABLE_FIELDS);
const jsonClean = (data) => JSON.parse(JSON.stringify(data));
const arePermissionsEqual = (p1, p2) => {
  if (p1.action === p2.action) {
    return deepEqual__default.default(jsonClean(pickComparableFields(p1)), jsonClean(pickComparableFields(p2)));
  }
  return false;
};
const create$3 = async (attributes) => {
  const alreadyExists = await exists$2({ name: attributes.name });
  if (alreadyExists) {
    throw new ApplicationError$6(
      `The name must be unique and a role with name \`${attributes.name}\` already exists.`
    );
  }
  const autoGeneratedCode = `${___default.default.kebabCase(attributes.name)}-${utils$1.generateTimestampCode()}`;
  const rolesWithCode = {
    ...attributes,
    code: attributes.code || autoGeneratedCode
  };
  const result = await strapi.query("admin::role").create({ data: rolesWithCode });
  strapi.eventHub.emit("role.create", { role: sanitizeRole(result) });
  return result;
};
const findOne = (params = {}, populate) => {
  return strapi.query("admin::role").findOne({ where: params, populate });
};
const findOneWithUsersCount = async (params = {}, populate) => {
  const role2 = await strapi.query("admin::role").findOne({ where: params, populate });
  if (role2) {
    role2.usersCount = await getUsersCount(role2.id);
  }
  return role2;
};
const find = (params = {}, populate) => {
  return strapi.query("admin::role").findMany({ where: params, populate });
};
const findAllWithUsersCount = async (params) => {
  const roles2 = await strapi.entityService.findMany(
    "admin::role",
    params
  );
  for (const role2 of roles2) {
    role2.usersCount = await getUsersCount(role2.id);
  }
  return roles2;
};
const update$3 = async (params, attributes) => {
  const sanitizedAttributes = ___default.default.omit(attributes, ["code"]);
  if (___default.default.has(params, "id") && ___default.default.has(sanitizedAttributes, "name")) {
    const alreadyExists = await exists$2({
      name: sanitizedAttributes.name,
      id: { $ne: params.id }
    });
    if (alreadyExists) {
      throw new ApplicationError$6(
        `The name must be unique and a role with name \`${sanitizedAttributes.name}\` already exists.`
      );
    }
  }
  const result = await strapi.query("admin::role").update({ where: params, data: sanitizedAttributes });
  strapi.eventHub.emit("role.update", { role: sanitizeRole(result) });
  return result;
};
const exists$2 = async (params = {}) => {
  const count2 = await strapi.query("admin::role").count({ where: params });
  return count2 > 0;
};
const count = async (params = {}) => {
  return strapi.query("admin::role").count(params);
};
const checkRolesIdForDeletion = async (ids = []) => {
  const superAdminRole = await getSuperAdmin();
  if (superAdminRole && utils$1.stringIncludes(ids, superAdminRole.id)) {
    throw new ApplicationError$6("You cannot delete the super admin role");
  }
  for (const roleId of ids) {
    const usersCount = await getUsersCount(roleId);
    if (usersCount !== 0) {
      throw new ApplicationError$6("Some roles are still assigned to some users");
    }
  }
};
const deleteByIds$1 = async (ids = []) => {
  await checkRolesIdForDeletion(ids);
  await getService("permission").deleteByRolesIds(ids);
  const deletedRoles = [];
  for (const id of ids) {
    const deletedRole = await strapi.query("admin::role").delete({ where: { id } });
    if (deletedRole) {
      strapi.eventHub.emit("role.delete", { role: deletedRole });
      deletedRoles.push(deletedRole);
    }
  }
  return deletedRoles;
};
const getUsersCount = async (roleId) => {
  return strapi.query("admin::user").count({ where: { roles: { id: roleId } } });
};
const getSuperAdmin = () => findOne({ code: SUPER_ADMIN_CODE$1 });
const getSuperAdminWithUsersCount = () => findOneWithUsersCount({ code: SUPER_ADMIN_CODE$1 });
const createRolesIfNoneExist = async () => {
  const someRolesExist = await exists$2();
  if (someRolesExist) {
    return;
  }
  const { actionProvider: actionProvider2 } = getService("permission");
  const allActions = actionProvider2.values();
  const contentTypesActions = allActions.filter((a) => a.section === "contentTypes");
  const superAdminRole = await create$3({
    name: "Super Admin",
    code: "strapi-super-admin",
    description: "Super Admins can access and manage all features and settings."
  });
  await getService("user").assignARoleToAll(superAdminRole.id);
  const editorRole = await create$3({
    name: "Editor",
    code: "strapi-editor",
    description: "Editors can manage and publish contents including those of other users."
  });
  const authorRole = await create$3({
    name: "Author",
    code: "strapi-author",
    description: "Authors can manage the content they have created."
  });
  const editorPermissions = getService("content-type").getPermissionsWithNestedFields(
    contentTypesActions,
    {
      restrictedSubjects: ["plugin::users-permissions.user"]
    }
  );
  const authorPermissions = editorPermissions.filter(({ action: action2 }) => action2 !== ACTIONS.publish).map(
    (permission2) => permissionDomain.create({ ...permission2, conditions: ["admin::is-creator"] })
  );
  editorPermissions.push(...getDefaultPluginPermissions());
  authorPermissions.push(...getDefaultPluginPermissions({ isAuthor: true }));
  await addPermissions(editorRole.id, editorPermissions);
  await addPermissions(authorRole.id, authorPermissions);
};
const getDefaultPluginPermissions = ({ isAuthor = false } = {}) => {
  const conditions2 = isAuthor ? ["admin::is-creator"] : [];
  return [
    { action: "plugin::upload.read", conditions: conditions2 },
    { action: "plugin::upload.configure-view" },
    { action: "plugin::upload.assets.create" },
    { action: "plugin::upload.assets.update", conditions: conditions2 },
    { action: "plugin::upload.assets.download" },
    { action: "plugin::upload.assets.copy-link" }
  ].map(permissionDomain.create);
};
const displayWarningIfNoSuperAdmin = async () => {
  const superAdminRole = await getSuperAdminWithUsersCount();
  const someUsersExists = await getService("user").exists();
  if (!superAdminRole) {
    strapi.log.warn("Your application doesn't have a super admin role.");
  } else if (someUsersExists && superAdminRole.usersCount === 0) {
    strapi.log.warn("Your application doesn't have a super admin user.");
  }
};
const assignPermissions = async (roleId, permissions2 = []) => {
  await validatePermissionsExist(permissions2);
  const internalActions = getService("permission").actionProvider.values().filter((action2) => action2.section === "internal").map((action2) => action2.actionId);
  const superAdmin = await getService("role").getSuperAdmin();
  const isSuperAdmin = superAdmin && superAdmin.id === roleId;
  const assignRole = fp.set("role", roleId);
  const permissionsWithRole = permissions2.map(assignRole).map(permissionDomain.create);
  const existingPermissions = await getService("permission").findMany({
    where: { role: { id: roleId } },
    populate: ["role"]
  });
  const permissionsToAdd = fp.differenceWith(
    arePermissionsEqual,
    permissionsWithRole,
    existingPermissions
  ).filter((permission2) => !internalActions.includes(permission2.action));
  const permissionsToDelete = fp.differenceWith(
    arePermissionsEqual,
    existingPermissions,
    permissionsWithRole
  ).filter((permission2) => !internalActions.includes(permission2.action));
  const permissionsToReturn = fp.differenceBy("id", permissionsToDelete, existingPermissions);
  if (permissionsToDelete.length > 0) {
    await getService("permission").deleteByIds(permissionsToDelete.map(fp.prop("id")));
  }
  if (permissionsToAdd.length > 0) {
    const newPermissions = await addPermissions(roleId, permissionsToAdd);
    permissionsToReturn.push(...newPermissions);
  }
  if (!isSuperAdmin && (permissionsToAdd.length || permissionsToDelete.length)) {
    await getService("metrics").sendDidUpdateRolePermissions();
  }
  return permissionsToReturn;
};
const addPermissions = async (roleId, permissions2) => {
  const { conditionProvider: conditionProvider2, createMany: createMany2 } = getService("permission");
  const { sanitizeConditions: sanitizeConditions2 } = permissionDomain;
  const permissionsWithRole = permissions2.map(fp.set("role", roleId)).map(sanitizeConditions2(conditionProvider2)).map(permissionDomain.create);
  return createMany2(permissionsWithRole);
};
const isContentTypeAction = (action2) => action2.section === CONTENT_TYPE_SECTION;
const resetSuperAdminPermissions = async () => {
  const superAdminRole = await getService("role").getSuperAdmin();
  if (!superAdminRole) {
    return;
  }
  const permissionService = getService("permission");
  const contentTypeService = getService("content-type");
  const allActions = permissionService.actionProvider.values();
  const contentTypesActions = allActions.filter((action2) => isContentTypeAction(action2));
  const otherActions = allActions.filter((action2) => !isContentTypeAction(action2));
  const permissions2 = contentTypeService.getPermissionsWithNestedFields(
    contentTypesActions
  );
  const otherPermissions = otherActions.reduce((acc, action2) => {
    const { actionId, subjects } = action2;
    if (fp.isArray(subjects)) {
      acc.push(
        ...subjects.map((subject2) => permissionDomain.create({ action: actionId, subject: subject2 }))
      );
    } else {
      acc.push(permissionDomain.create({ action: actionId }));
    }
    return acc;
  }, []);
  permissions2.push(...otherPermissions);
  const transformedPermissions = await hooks.willResetSuperAdminPermissions.call(
    permissions2
  );
  await assignPermissions(superAdminRole.id, transformedPermissions);
};
const hasSuperAdminRole = (user2) => {
  const roles2 = ___default.default.get(user2, "roles", []);
  return roles2.map(fp.prop("code")).includes(SUPER_ADMIN_CODE$1);
};
const constants$2 = {
  superAdminCode: SUPER_ADMIN_CODE$1
};
const role$1 = {
  hooks,
  sanitizeRole,
  create: create$3,
  findOne,
  findOneWithUsersCount,
  find,
  findAllWithUsersCount,
  update: update$3,
  exists: exists$2,
  count,
  deleteByIds: deleteByIds$1,
  getUsersCount,
  getSuperAdmin,
  getSuperAdminWithUsersCount,
  createRolesIfNoneExist,
  displayWarningIfNoSuperAdmin,
  addPermissions,
  hasSuperAdminRole,
  assignPermissions,
  resetSuperAdminPermissions,
  checkRolesIdForDeletion,
  constants: constants$2
};
const createLocalStrategy = (strapi2, middleware) => {
  return new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false
    },
    (email2, password2, done) => {
      return getService("auth").checkCredentials({ email: fp.toLower(email2), password: password2 }).then(async ([error, user2, message]) => {
        if (middleware) {
          return middleware([error, user2, message], done);
        }
        return done(error, user2, message);
      }).catch((error) => done(error));
    }
  );
};
const authEventsMapper = {
  onConnectionSuccess: "admin.auth.success",
  onConnectionError: "admin.auth.error"
};
const valueIsFunctionType = ([, value]) => fp.isFunction(value);
const keyIsValidEventName = ([key]) => {
  return Object.keys(strapi.admin.services.passport.authEventsMapper).includes(key);
};
const getPassportStrategies = () => [createLocalStrategy(strapi)];
const registerAuthEvents = () => {
  const { events = {} } = strapi.config.get("admin.auth", {});
  const { authEventsMapper: authEventsMapper2 } = strapi.admin.services.passport;
  const eventList = Object.entries(events).filter(keyIsValidEventName).filter(valueIsFunctionType);
  for (const [eventName, handler] of eventList) {
    strapi.eventHub.on(authEventsMapper2[eventName], handler);
  }
};
const init = () => {
  strapi.admin.services.passport.getPassportStrategies().forEach((strategy) => passport__default.default.use(strategy));
  registerAuthEvents();
  return passport__default.default.initialize();
};
const passport = { init, getPassportStrategies, authEventsMapper };
const sendDidInviteUser = async () => {
  const numberOfUsers = await getService("user").count();
  const numberOfRoles = await getService("role").count();
  strapi.telemetry.send("didInviteUser", {
    groupProperties: { numberOfRoles, numberOfUsers }
  });
};
const sendDidUpdateRolePermissions = async () => {
  strapi.telemetry.send("didUpdateRolePermissions");
};
const sendDidChangeInterfaceLanguage = async () => {
  const languagesInUse = await getService("user").getLanguagesInUse();
  strapi.telemetry.send("didChangeInterfaceLanguage", { userProperties: { languagesInUse } });
};
const sendUpdateProjectInformation = async () => {
  const numberOfActiveAdminUsers = await getService("user").count({ isActive: true });
  const numberOfAdminUsers = await getService("user").count();
  strapi.telemetry.send("didUpdateProjectInformation", {
    groupProperties: { numberOfActiveAdminUsers, numberOfAdminUsers }
  });
};
const startCron = (strapi2) => {
  strapi2.cron.add({
    "0 0 0 * * *": () => sendUpdateProjectInformation()
  });
};
const metrics = {
  sendDidInviteUser,
  sendDidUpdateRolePermissions,
  sendDidChangeInterfaceLanguage,
  sendUpdateProjectInformation,
  startCron
};
const defaultJwtOptions = { expiresIn: "30d" };
const getTokenOptions = () => {
  const { options, secret } = strapi.config.get(
    "admin.auth",
    {}
  );
  return {
    secret,
    options: ___default.default.merge(defaultJwtOptions, options)
  };
};
const createToken = () => {
  return crypto__default.default.randomBytes(20).toString("hex");
};
const createJwtToken = (user2) => {
  const { options, secret } = getTokenOptions();
  return jwt__default.default.sign({ id: user2.id }, secret, options);
};
const decodeJwtToken = (token2) => {
  const { secret } = getTokenOptions();
  try {
    const payload = jwt__default.default.verify(token2, secret);
    return { payload, isValid: true };
  } catch (err) {
    return { payload: null, isValid: false };
  }
};
const checkSecretIsDefined = () => {
  if (strapi.config.serveAdminPanel && !strapi.config.get("admin.auth.secret")) {
    throw new Error(
      `Missing auth.secret. Please set auth.secret in config/admin.js (ex: you can generate one using Node with \`crypto.randomBytes(16).toString('base64')\`).
For security reasons, prefer storing the secret in an environment variable and read it in config/admin.js. See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`
    );
  }
};
const token$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  checkSecretIsDefined,
  createJwtToken,
  createToken,
  decodeJwtToken,
  getTokenOptions
}, Symbol.toStringTag, { value: "Module" }));
const registerProviderActionSchema = utils$1.yup.array().required().of(
  utils$1.yup.object().shape({
    uid: utils$1.yup.string().matches(
      /^[a-z]([a-z|.|-]+)[a-z]$/,
      (v) => `${v.path}: The id can only contain lowercase letters, dots and hyphens.`
    ).required(),
    section: utils$1.yup.string().oneOf(["contentTypes", "plugins", "settings", "internal"]).required(),
    pluginName: utils$1.yup.mixed().when("section", {
      is: "plugins",
      then: validators.isAPluginName.required(),
      otherwise: validators.isAPluginName
    }),
    subjects: utils$1.yup.mixed().when("section", {
      is: "contentTypes",
      then: utils$1.yup.array().of(utils$1.yup.string()).required(),
      otherwise: utils$1.yup.mixed().oneOf([void 0], 'subjects should only be defined for the "contentTypes" section')
    }),
    displayName: utils$1.yup.string().required(),
    category: utils$1.yup.mixed().when("section", {
      is: "settings",
      then: utils$1.yup.string().required(),
      otherwise: utils$1.yup.mixed().test(
        "settingsCategory",
        'category should only be defined for the "settings" section',
        (cat) => cat === void 0
      )
    }),
    subCategory: utils$1.yup.mixed().when("section", {
      is: (section) => ["settings", "plugins"].includes(section),
      then: utils$1.yup.string(),
      otherwise: utils$1.yup.mixed().test(
        "settingsSubCategory",
        'subCategory should only be defined for "plugins" and "settings" sections',
        (subCat) => {
          return subCat === void 0;
        }
      )
    }),
    options: utils$1.yup.object({
      applyToProperties: utils$1.yup.array().of(utils$1.yup.string())
    }),
    aliases: utils$1.yup.array(
      utils$1.yup.object({
        actionId: utils$1.yup.string(),
        subjects: utils$1.yup.array(utils$1.yup.string()).nullable()
      })
    ).nullable()
  }).noUnknown()
);
const validateRegisterProviderAction = utils$1.validateYupSchemaSync(registerProviderActionSchema);
const { ApplicationError: ApplicationError$5 } = utils$1.errors;
const createActionProvider = (options) => {
  const provider = utils$1.providerFactory(options);
  const actionHooks = {
    appliesPropertyToSubject: utils$1.hooks.createAsyncParallelHook()
  };
  return {
    ...provider,
    hooks: {
      ...provider.hooks,
      ...actionHooks
    },
    async register(actionAttributes) {
      if (strapi.isLoaded) {
        throw new Error(`You can't register new actions outside of the bootstrap function.`);
      }
      validateRegisterProviderAction([actionAttributes]);
      const action2 = actionDomain.create(actionAttributes);
      return provider.register(action2.actionId, action2);
    },
    async registerMany(actionsAttributes) {
      validateRegisterProviderAction(actionsAttributes);
      for (const attributes of actionsAttributes) {
        await this.register(attributes);
      }
      return this;
    },
    async appliesToProperty(property, actionId, subject2) {
      const action2 = provider.get(actionId);
      if (!action2) {
        throw new ApplicationError$5(`No action found with id "${actionId}"`);
      }
      const appliesToAction = actionDomain.appliesToProperty(property, action2);
      if (!appliesToAction) {
        return false;
      }
      if (!subject2) {
        return true;
      }
      if (!actionDomain.appliesToSubject(subject2, action2)) {
        return false;
      }
      const results = await actionHooks.appliesPropertyToSubject.call({
        property,
        action: action2,
        subject: subject2
      });
      return results.every((result) => result !== false);
    },
    /**
     * @experimental
     */
    unstable_aliases(actionId, subject2) {
      const isRegistered = this.has(actionId);
      if (!isRegistered) {
        return [];
      }
      return this.values().filter(
        (action2) => action2.aliases?.some((alias) => {
          if (alias.actionId !== actionId) {
            return false;
          }
          if (!Array.isArray(alias.subjects)) {
            return true;
          }
          if (!subject2) {
            return false;
          }
          return alias.subjects.includes(subject2);
        })
      ).map((action2) => action2.actionId);
    }
  };
};
const DEFAULT_CATEGORY = "default";
const getDefaultConditionAttributes = () => ({
  category: DEFAULT_CATEGORY
});
const conditionFields = ["id", "displayName", "handler", "plugin", "category"];
const sanitizeConditionAttributes = fp.pick(conditionFields);
const computeConditionId = (condition2) => {
  const { name: name2, plugin } = condition2;
  if (!plugin) {
    return `api::${name2}`;
  }
  if (plugin === "admin") {
    return `admin::${name2}`;
  }
  return `plugin::${plugin}.${name2}`;
};
const assignConditionId = (attrs) => {
  const condition2 = fp.set("id", computeConditionId(attrs), attrs);
  return condition2;
};
const create$2 = fp.pipe(
  assignConditionId,
  sanitizeConditionAttributes,
  fp.merge(getDefaultConditionAttributes())
);
const domain = {
  assignConditionId,
  computeConditionId,
  conditionFields,
  create: create$2,
  getDefaultConditionAttributes,
  sanitizeConditionAttributes
};
const createConditionProvider = () => {
  const provider = utils$1.providerFactory();
  return {
    ...provider,
    async register(conditionAttributes) {
      if (strapi.isLoaded) {
        throw new Error(`You can't register new conditions outside of the bootstrap function.`);
      }
      const condition2 = domain.create(conditionAttributes);
      return provider.register(condition2.id, condition2);
    },
    async registerMany(conditionsAttributes) {
      for (const attributes of conditionsAttributes) {
        await this.register(attributes);
      }
      return this;
    }
  };
};
const {
  visitors: { removePassword }
} = utils$1.sanitize;
const {
  constants: constants$1,
  isScalarAttribute: isScalarAttribute$1,
  getNonVisibleAttributes: getNonVisibleAttributes$1,
  getNonWritableAttributes,
  getWritableAttributes: getWritableAttributes$1
} = utils$1.contentTypes;
const {
  ID_ATTRIBUTE: ID_ATTRIBUTE$1,
  CREATED_AT_ATTRIBUTE: CREATED_AT_ATTRIBUTE$1,
  UPDATED_AT_ATTRIBUTE: UPDATED_AT_ATTRIBUTE$1,
  PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$1,
  CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$1,
  UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$1
} = constants$1;
const COMPONENT_FIELDS$1 = ["__component"];
const STATIC_FIELDS$1 = [ID_ATTRIBUTE$1];
const createSanitizeHelpers = ({ action: action2, ability: ability$1, model }) => {
  const schema = strapi.getModel(model);
  const { removeDisallowedFields } = utils$1.sanitize.visitors;
  const createSanitizeQuery = (options = {}) => {
    const { fields } = options;
    const permittedFields = fields.shouldIncludeAll ? null : getQueryFields(fields.permitted);
    const sanitizeFilters = utils$1.pipeAsync(
      utils$1.traverse.traverseQueryFilters(removeDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQueryFilters(omitDisallowedAdminUserFields, { schema }),
      utils$1.traverse.traverseQueryFilters(omitHiddenFields, { schema }),
      utils$1.traverse.traverseQueryFilters(removePassword, { schema }),
      utils$1.traverse.traverseQueryFilters(
        ({ key, value }, { remove }) => {
          if (fp.isObject(value) && fp.isEmpty(value)) {
            remove(key);
          }
        },
        { schema }
      )
    );
    const sanitizeSort = utils$1.pipeAsync(
      utils$1.traverse.traverseQuerySort(removeDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQuerySort(omitDisallowedAdminUserFields, { schema }),
      utils$1.traverse.traverseQuerySort(omitHiddenFields, { schema }),
      utils$1.traverse.traverseQuerySort(removePassword, { schema }),
      utils$1.traverse.traverseQuerySort(
        ({ key, attribute, value }, { remove }) => {
          if (!isScalarAttribute$1(attribute) && fp.isEmpty(value)) {
            remove(key);
          }
        },
        { schema }
      )
    );
    const sanitizePopulate = utils$1.pipeAsync(
      utils$1.traverse.traverseQueryPopulate(removeDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQueryPopulate(omitDisallowedAdminUserFields, { schema }),
      utils$1.traverse.traverseQueryPopulate(omitHiddenFields, { schema }),
      utils$1.traverse.traverseQueryPopulate(removePassword, { schema })
    );
    const sanitizeFields = utils$1.pipeAsync(
      utils$1.traverse.traverseQueryFields(removeDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQueryFields(omitHiddenFields, { schema }),
      utils$1.traverse.traverseQueryFields(removePassword, { schema })
    );
    return async (query) => {
      const sanitizedQuery = fp.cloneDeep(query);
      if (query.filters) {
        Object.assign(sanitizedQuery, { filters: await sanitizeFilters(query.filters) });
      }
      if (query.sort) {
        Object.assign(sanitizedQuery, { sort: await sanitizeSort(query.sort) });
      }
      if (query.populate) {
        Object.assign(sanitizedQuery, { populate: await sanitizePopulate(query.populate) });
      }
      if (query.fields) {
        Object.assign(sanitizedQuery, { fields: await sanitizeFields(query.fields) });
      }
      return sanitizedQuery;
    };
  };
  const createSanitizeOutput = (options = {}) => {
    const { fields } = options;
    const permittedFields = fields.shouldIncludeAll ? null : getOutputFields(fields.permitted);
    return utils$1.pipeAsync(
      // Remove fields hidden from the admin
      utils$1.traverseEntity(omitHiddenFields, { schema }),
      // Remove unallowed fields from admin::user relations
      // @ts-expect-error lodash types
      utils$1.traverseEntity(pickAllowedAdminUserFields, { schema }),
      // Remove not allowed fields (RBAC)
      utils$1.traverseEntity(removeDisallowedFields(permittedFields), { schema }),
      // Remove all fields of type 'password'
      utils$1.sanitize.sanitizers.sanitizePasswords(schema)
    );
  };
  const createSanitizeInput = (options = {}) => {
    const { fields } = options;
    const permittedFields = fields.shouldIncludeAll ? null : getInputFields(fields.permitted);
    return utils$1.pipeAsync(
      // Remove fields hidden from the admin
      utils$1.traverseEntity(omitHiddenFields, { schema }),
      // Remove not allowed fields (RBAC)
      // @ts-expect-error lodash types
      utils$1.traverseEntity(removeDisallowedFields(permittedFields), { schema }),
      // Remove roles from createdBy & updateBy fields
      omitCreatorRoles
    );
  };
  const wrapSanitize = (createSanitizeFunction) => {
    const wrappedSanitize = async (data, options = {}) => {
      if (fp.isArray(data)) {
        return Promise.all(data.map((entity) => wrappedSanitize(entity, options)));
      }
      const { subject: subject2, action: actionOverride } = getDefaultOptions(data, options);
      const permittedFields = extra.permittedFieldsOf(ability$1, actionOverride, subject2, {
        fieldsFrom: (rule) => rule.fields || []
      });
      const hasAtLeastOneRegistered = fp.some(
        (fields) => !fp.isNil(fields),
        fp.flatMap(fp.prop("fields"), ability$1.rulesFor(actionOverride, ability.detectSubjectType(subject2)))
      );
      const shouldIncludeAllFields = fp.isEmpty(permittedFields) && !hasAtLeastOneRegistered;
      const sanitizeOptions = {
        ...options,
        fields: {
          shouldIncludeAll: shouldIncludeAllFields,
          permitted: permittedFields,
          hasAtLeastOneRegistered
        }
      };
      const sanitizeFunction = createSanitizeFunction(sanitizeOptions);
      return sanitizeFunction(data);
    };
    return wrappedSanitize;
  };
  const getDefaultOptions = (data, options) => {
    return fp.defaults({ subject: ability.subject(model, data), action: action2 }, options);
  };
  const omitCreatorRoles = fp.omit([`${CREATED_BY_ATTRIBUTE$1}.roles`, `${UPDATED_BY_ATTRIBUTE$1}.roles`]);
  const omitHiddenFields = ({ key, schema: schema2 }, { remove }) => {
    const isHidden = fp.getOr(false, ["config", "attributes", key, "hidden"], schema2);
    if (isHidden) {
      remove(key);
    }
  };
  const pickAllowedAdminUserFields = ({ attribute, key, value }, { set }) => {
    const pickAllowedFields = fp.pick(ADMIN_USER_ALLOWED_FIELDS);
    if (attribute.type === "relation" && attribute.target === "admin::user" && value) {
      if (Array.isArray(value)) {
        set(key, value.map(pickAllowedFields));
      } else {
        set(key, pickAllowedFields(value));
      }
    }
  };
  const omitDisallowedAdminUserFields = ({ key, attribute, schema: schema2 }, { remove }) => {
    if (schema2.uid === "admin::user" && attribute && !ADMIN_USER_ALLOWED_FIELDS.includes(key)) {
      remove(key);
    }
  };
  const getInputFields = (fields = []) => {
    const nonVisibleAttributes = getNonVisibleAttributes$1(schema);
    const writableAttributes = getWritableAttributes$1(schema);
    const nonVisibleWritableAttributes = fp.intersection(nonVisibleAttributes, writableAttributes);
    return fp.uniq([...fields, ...COMPONENT_FIELDS$1, ...nonVisibleWritableAttributes]);
  };
  const getOutputFields = (fields = []) => {
    const nonWritableAttributes = getNonWritableAttributes(schema);
    const nonVisibleAttributes = getNonVisibleAttributes$1(schema);
    return fp.uniq([
      ...fields,
      ...STATIC_FIELDS$1,
      ...COMPONENT_FIELDS$1,
      ...nonWritableAttributes,
      ...nonVisibleAttributes,
      CREATED_AT_ATTRIBUTE$1,
      UPDATED_AT_ATTRIBUTE$1
    ]);
  };
  const getQueryFields = (fields = []) => {
    const nonVisibleAttributes = getNonVisibleAttributes$1(schema);
    const writableAttributes = getWritableAttributes$1(schema);
    const nonVisibleWritableAttributes = fp.intersection(nonVisibleAttributes, writableAttributes);
    return fp.uniq([
      ...fields,
      ...STATIC_FIELDS$1,
      ...COMPONENT_FIELDS$1,
      ...nonVisibleWritableAttributes,
      CREATED_AT_ATTRIBUTE$1,
      UPDATED_AT_ATTRIBUTE$1,
      PUBLISHED_AT_ATTRIBUTE$1,
      CREATED_BY_ATTRIBUTE$1,
      UPDATED_BY_ATTRIBUTE$1
    ]);
  };
  return {
    sanitizeOutput: wrapSanitize(createSanitizeOutput),
    sanitizeInput: wrapSanitize(createSanitizeInput),
    sanitizeQuery: wrapSanitize(createSanitizeQuery)
  };
};
const { ValidationError: ValidationError$3 } = utils$1.errors;
const { throwPassword, throwDisallowedFields } = utils$1.validate.visitors;
const { constants, isScalarAttribute, getNonVisibleAttributes, getWritableAttributes } = utils$1.contentTypes;
const {
  ID_ATTRIBUTE,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE
} = constants;
const COMPONENT_FIELDS = ["__component"];
const STATIC_FIELDS = [ID_ATTRIBUTE];
const throwInvalidParam = ({ key }) => {
  throw new ValidationError$3(`Invalid parameter ${key}`);
};
const createValidateHelpers = ({ action: action2, ability: ability$1, model }) => {
  const schema = strapi.getModel(model);
  const createValidateQuery = (options = {}) => {
    const { fields } = options;
    const permittedFields = fields.shouldIncludeAll ? null : getQueryFields(fields.permitted);
    const validateFilters = utils$1.pipeAsync(
      utils$1.traverse.traverseQueryFilters(throwDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQueryFilters(throwDisallowedAdminUserFields, { schema }),
      utils$1.traverse.traverseQueryFilters(throwPassword, { schema }),
      utils$1.traverse.traverseQueryFilters(
        ({ key, value }) => {
          if (fp.isObject(value) && fp.isEmpty(value)) {
            throwInvalidParam({ key });
          }
        },
        { schema }
      )
    );
    const validateSort = utils$1.pipeAsync(
      utils$1.traverse.traverseQuerySort(throwDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQuerySort(throwDisallowedAdminUserFields, { schema }),
      utils$1.traverse.traverseQuerySort(throwPassword, { schema }),
      utils$1.traverse.traverseQuerySort(
        ({ key, attribute, value }) => {
          if (!isScalarAttribute(attribute) && fp.isEmpty(value)) {
            throwInvalidParam({ key });
          }
        },
        { schema }
      )
    );
    const validateFields = utils$1.pipeAsync(
      utils$1.traverse.traverseQueryFields(throwDisallowedFields(permittedFields), { schema }),
      utils$1.traverse.traverseQueryFields(throwPassword, { schema })
    );
    return async (query) => {
      if (query.filters) {
        await validateFilters(query.filters);
      }
      if (query.sort) {
        await validateSort(query.sort);
      }
      if (query.fields) {
        await validateFields(query.fields);
      }
      return true;
    };
  };
  const createValidateInput = (options = {}) => {
    const { fields } = options;
    const permittedFields = fields.shouldIncludeAll ? null : getInputFields(fields.permitted);
    return utils$1.pipeAsync(
      // Remove fields hidden from the admin
      utils$1.traverseEntity(throwHiddenFields, { schema }),
      // Remove not allowed fields (RBAC)
      // @ts-expect-error lodash types
      utils$1.traverseEntity(throwDisallowedFields(permittedFields), { schema }),
      // Remove roles from createdBy & updatedBy fields
      omitCreatorRoles
    );
  };
  const wrapValidate = (createValidateFunction) => {
    const wrappedValidate = async (data, options = {}) => {
      if (fp.isArray(data)) {
        return Promise.all(data.map((entity) => wrappedValidate(entity, options)));
      }
      const { subject: subject2, action: actionOverride } = getDefaultOptions(data, options);
      const permittedFields = extra.permittedFieldsOf(ability$1, actionOverride, subject2, {
        fieldsFrom: (rule) => rule.fields || []
      });
      const hasAtLeastOneRegistered = fp.some(
        (fields) => !fp.isNil(fields),
        fp.flatMap(fp.prop("fields"), ability$1.rulesFor(actionOverride, ability.detectSubjectType(subject2)))
      );
      const shouldIncludeAllFields = fp.isEmpty(permittedFields) && !hasAtLeastOneRegistered;
      const validateOptions = {
        ...options,
        fields: {
          shouldIncludeAll: shouldIncludeAllFields,
          permitted: permittedFields,
          hasAtLeastOneRegistered
        }
      };
      const validateFunction = createValidateFunction(validateOptions);
      return validateFunction(data);
    };
    return wrappedValidate;
  };
  const getDefaultOptions = (data, options) => {
    return fp.defaults({ subject: ability.subject(model, data), action: action2 }, options);
  };
  const omitCreatorRoles = fp.omit([`${CREATED_BY_ATTRIBUTE}.roles`, `${UPDATED_BY_ATTRIBUTE}.roles`]);
  const throwHiddenFields = ({ key, schema: schema2 }) => {
    const isHidden = fp.getOr(false, ["config", "attributes", key, "hidden"], schema2);
    if (isHidden) {
      throwInvalidParam({ key });
    }
  };
  const throwDisallowedAdminUserFields = ({ key, attribute, schema: schema2 }) => {
    if (schema2.uid === "admin::user" && attribute && !ADMIN_USER_ALLOWED_FIELDS.includes(key)) {
      throwInvalidParam({ key });
    }
  };
  const getInputFields = (fields = []) => {
    const nonVisibleAttributes = getNonVisibleAttributes(schema);
    const writableAttributes = getWritableAttributes(schema);
    const nonVisibleWritableAttributes = fp.intersection(nonVisibleAttributes, writableAttributes);
    return fp.uniq([...fields, ...COMPONENT_FIELDS, ...nonVisibleWritableAttributes]);
  };
  const getQueryFields = (fields = []) => {
    return fp.uniq([
      ...fields,
      ...STATIC_FIELDS,
      ...COMPONENT_FIELDS,
      CREATED_AT_ATTRIBUTE,
      UPDATED_AT_ATTRIBUTE,
      PUBLISHED_AT_ATTRIBUTE
    ]);
  };
  return {
    validateQuery: wrapValidate(createValidateQuery),
    validateInput: wrapValidate(createValidateInput)
  };
};
const operatorsMap = {
  $in: "$in",
  $nin: "$notIn",
  $exists: "$notNull",
  $gte: "$gte",
  $gt: "$gt",
  $lte: "$lte",
  $lt: "$lt",
  $eq: "$eq",
  $ne: "$ne",
  $and: "$and",
  $or: "$or",
  $not: "$not"
};
const mapKey = (key) => {
  if (___default.default.isString(key) && key.startsWith("$") && key in operatorsMap) {
    return operatorsMap[key];
  }
  return key;
};
const buildCaslQuery = (ability2, action2, model) => {
  return extra.rulesToQuery(ability2, action2, model, (o) => o.conditions);
};
const buildStrapiQuery = (caslQuery) => {
  return unwrapDeep(caslQuery);
};
const unwrapDeep = (obj) => {
  if (!___default.default.isPlainObject(obj) && !___default.default.isArray(obj)) {
    return obj;
  }
  if (___default.default.isArray(obj)) {
    return obj.map((v) => unwrapDeep(v));
  }
  return ___default.default.reduce(
    obj,
    (acc, v, k) => {
      const key = mapKey(k);
      if (___default.default.isPlainObject(v)) {
        if ("$elemMatch" in v) {
          ___default.default.setWith(acc, key, unwrapDeep(v.$elemMatch));
        } else {
          ___default.default.setWith(acc, key, unwrapDeep(v));
        }
      } else if (___default.default.isArray(v)) {
        ___default.default.setWith(acc, key, v.map((v2) => unwrapDeep(v2)));
      } else {
        ___default.default.setWith(acc, key, v);
      }
      return acc;
    },
    {}
  );
};
const index$4 = ({ ability: ability$1, action: action2, model }) => ({
  ability: ability$1,
  action: action2,
  model,
  get isAllowed() {
    return this.ability.can(action2, model);
  },
  toSubject(target, subjectType = model) {
    return ability.subject(subjectType, target);
  },
  pickPermittedFieldsOf(data, options = {}) {
    return this.sanitizeInput(data, options);
  },
  getQuery(queryAction = action2) {
    if (___default.default.isUndefined(queryAction)) {
      throw new Error("Action must be defined to build a permission query");
    }
    return buildStrapiQuery(buildCaslQuery(ability$1, queryAction, model));
  },
  // eslint-disable-next-line @typescript-eslint/default-param-last
  addPermissionsQueryTo(query = {}, action22) {
    const newQuery = fp.cloneDeep(query);
    const permissionQuery = this.getQuery(action22) ?? void 0;
    if (fp.isPlainObject(query.filters)) {
      newQuery.filters = permissionQuery ? { $and: [query.filters, permissionQuery] } : query.filters;
    } else {
      newQuery.filters = permissionQuery;
    }
    return newQuery;
  },
  ...createSanitizeHelpers({ action: action2, ability: ability$1, model }),
  ...createValidateHelpers({ action: action2, ability: ability$1, model })
});
const createPermissionEngine = (params) => {
  const { providers: providers2 } = params;
  const engine2 = permissions__default.default.engine.new({ providers: providers2 }).on("before-format::validate.permission", ({ permission: permission2 }) => {
    const action2 = providers2.action.get(permission2.action);
    if (!action2) {
      strapi.log.debug(
        `Unknown action "${permission2.action}" supplied when registering a new permission in engine`
      );
      return false;
    }
  }).on("format.permission", (permission2) => {
    const action2 = providers2.action.get(permission2.action);
    const properties = permission2.properties || {};
    const propertiesName = Object.keys(properties);
    const invalidProperties = fp.difference(
      propertiesName,
      // @ts-expect-error - applyToProperties is defined inside the options of an action
      action2.applyToProperties || propertiesName
    );
    const permissionWithSanitizedProperties = invalidProperties.reduce(
      // @ts-expect-error - fix reduce, property should be a string but it's actually the permission object
      (property) => permissionDomain.deleteProperty(property, permission2),
      permission2
    );
    return permissionWithSanitizedProperties;
  }).on("after-format::validate.permission", ({ permission: permission2 }) => {
    const { fields } = permission2.properties;
    if (fp.isArray(fields) && fp.isEmpty(fields)) {
      return false;
    }
  });
  return {
    get hooks() {
      return engine2.hooks;
    },
    /**
     * Generate an ability based on the given user (using associated roles & permissions)
     * @param user
     */
    async generateUserAbility(user2) {
      const permissions2 = await getService("permission").findUserPermissions(user2);
      return engine2.generateAbility(permissions2, user2);
    },
    /**
     * Check many permissions based on an ability
     */
    checkMany: fp.curry((ability2, permissions2) => {
      return permissions2.map(({ action: action2, subject: subject2, field }) => ability2.can(action2, subject2, field));
    })
  };
};
const emptyObjectFactory = () => ({});
const createSection = ({ initialStateFactory = emptyObjectFactory, handlers = [], matchers = [] } = {}) => {
  const state = {
    hooks: {
      handlers: utils$1.hooks.createAsyncSeriesHook(),
      matchers: utils$1.hooks.createAsyncParallelHook()
    }
  };
  handlers.forEach((handler) => state.hooks.handlers.register(handler));
  matchers.forEach((matcher) => state.hooks.matchers.register(matcher));
  return {
    hooks: state.hooks,
    /**
     * Verifies if an action can be applied to the section by running the matchers hook.
     * If any of the registered matcher functions returns true, then the condition applies.
     */
    async appliesToAction(action2) {
      const results = await state.hooks.matchers.call(action2);
      return results.some(fp.eq(true));
    },
    /**
     * Init, build and returns a section object based on the given actions
     * @param  actions - A list of actions used to populate the section
     */
    async build(actions2 = []) {
      const section = initialStateFactory();
      for (const action2 of actions2) {
        const applies = await this.appliesToAction(action2);
        if (applies) {
          await state.hooks.handlers.call({ action: action2, section });
        }
      }
      return section;
    }
  };
};
const createSectionBuilder = () => {
  const state = {
    sections: /* @__PURE__ */ new Map()
  };
  return {
    /**
     * Create & add a section to the builder's registry
     * @param sectionName - The unique name of the section
     * @param options - The options used to build a {@link Section}
     */
    createSection(sectionName, options) {
      const section = createSection(options);
      state.sections.set(sectionName, section);
      return this;
    },
    /**
     * Removes a section from the builder's registry using its unique name
     * @param sectionName - The name of the section to delete
     */
    deleteSection(sectionName) {
      state.sections.delete(sectionName);
      return this;
    },
    /**
     * Register a handler function for a given section
     * @param  sectionName - The name of the section
     * @param  handler - The handler to register
     */
    addHandler(sectionName, handler) {
      if (state.sections.has(sectionName)) {
        state.sections.get(sectionName).hooks.handlers.register(handler);
      }
      return this;
    },
    /**
         * Register a matcher function for a given section
         * @param sectionName - The name of the section
         * @param matcher - The handler to register
    
         */
    addMatcher(sectionName, matcher) {
      if (state.sections.has(sectionName)) {
        state.sections.get(sectionName).hooks.matchers.register(matcher);
      }
      return this;
    },
    /**
     * Build a section tree based on the registered actions and the given actions
     * @param actions - The actions used to build each section
     */
    async build(actions2 = []) {
      const sections = {};
      for (const [sectionName, section] of state.sections.entries()) {
        sections[sectionName] = await section.build(actions2);
      }
      return sections;
    }
  };
};
const isOfKind = (kind) => fp.matchesProperty("kind", kind);
const resolveContentType = (uid) => strapi.contentTypes[uid];
const isNotInSubjects = (subjects) => (uid) => !subjects.find((subject2) => subject2.uid === uid);
const hasProperty = fp.curry((property, subject2) => {
  return !!subject2.properties.find((prop) => prop.value === property);
});
const getValidOptions = fp.pick(["applyToProperties"]);
const toSubjectTemplate = (ct) => ({
  uid: ct.uid,
  label: ct.info.singularName,
  properties: []
});
const { isVisibleAttribute } = utils$1.contentTypes;
const settings = ({ action: action2, section }) => {
  const { category, subCategory, displayName, actionId } = action2;
  section.push({
    displayName,
    category,
    subCategory,
    // TODO: Investigate at which point the action property is transformed to actionId
    // @ts-expect-error - action should be actionID
    action: actionId
  });
};
const plugins = ({ action: action2, section }) => {
  const { pluginName, subCategory, displayName, actionId } = action2;
  section.push({
    displayName,
    // @ts-expect-error - plugin should be pluginName, TODO: Investigate at which point the plugin property
    plugin: pluginName,
    subCategory,
    action: actionId
  });
};
const contentTypesBase = ({
  action: action2,
  section
}) => {
  const { displayName, actionId, subjects, options } = action2;
  section.actions.push({
    // @ts-expect-error - label should be displayName, TODO: Investigate at which point the label property
    label: displayName,
    actionId,
    subjects,
    ...getValidOptions(options)
  });
};
const subjectsHandlerFor = (kind) => ({ action: action2, section: contentTypesSection }) => {
  const { subjects } = action2;
  if (!subjects?.length) {
    return;
  }
  const newSubjects = subjects.filter(isNotInSubjects(contentTypesSection.subjects)).map(resolveContentType).filter(isOfKind(kind)).map(toSubjectTemplate);
  contentTypesSection.subjects.push(...newSubjects);
};
const buildNode = (model, attributeName, attribute) => {
  if (!isVisibleAttribute(model, attributeName)) {
    return null;
  }
  const node = { label: attributeName, value: attributeName };
  if (attribute.required) {
    Object.assign(node, { required: true });
  }
  if (attribute.type === "component") {
    const component = strapi.components[attribute.component];
    return { ...node, children: buildDeepAttributesCollection(component) };
  }
  return node;
};
const buildDeepAttributesCollection = (model) => {
  return Object.entries(model.attributes).map(([attributeName, attribute]) => buildNode(model, attributeName, attribute)).filter((node) => node !== null);
};
const fieldsProperty = ({ action: action2, section }) => {
  const { subjects } = action2;
  section.subjects.filter((subject2) => subjects?.includes(subject2.uid)).forEach((subject2) => {
    const { uid } = subject2;
    const contentType2 = resolveContentType(uid);
    if (hasProperty("fields", subject2)) {
      return;
    }
    const fields = buildDeepAttributesCollection(contentType2);
    const fieldsProp = { label: "Fields", value: "fields", children: fields };
    subject2.properties.push(fieldsProp);
  });
};
const sectionPropMatcher = fp.propEq("section");
const createContentTypesInitialState = () => ({
  actions: [],
  subjects: []
});
const createDefaultSectionBuilder = () => {
  const builder = createSectionBuilder();
  builder.createSection("plugins", {
    initialStateFactory: () => [],
    handlers: [plugins],
    matchers: [sectionPropMatcher("plugins")]
  });
  builder.createSection("settings", {
    initialStateFactory: () => [],
    handlers: [settings],
    matchers: [sectionPropMatcher("settings")]
  });
  builder.createSection("singleTypes", {
    initialStateFactory: createContentTypesInitialState,
    handlers: [contentTypesBase, subjectsHandlerFor("singleType"), fieldsProperty],
    matchers: [sectionPropMatcher("contentTypes")]
  });
  builder.createSection("collectionTypes", {
    initialStateFactory: createContentTypesInitialState,
    handlers: [contentTypesBase, subjectsHandlerFor("collectionType"), fieldsProperty],
    matchers: [sectionPropMatcher("contentTypes")]
  });
  return builder;
};
const deleteByRolesIds = async (rolesIds) => {
  const permissionsToDelete = await strapi.query("admin::permission").findMany({
    select: ["id"],
    where: {
      role: { id: rolesIds }
    }
  });
  if (permissionsToDelete.length > 0) {
    await deleteByIds(permissionsToDelete.map(fp.prop("id")));
  }
};
const deleteByIds = async (ids) => {
  const result = [];
  for (const id of ids) {
    const queryResult = await strapi.query("admin::permission").delete({ where: { id } });
    result.push(queryResult);
  }
  strapi.eventHub.emit("permission.delete", { permissions: result });
};
const createMany = async (permissions2) => {
  const createdPermissions = [];
  for (const permission2 of permissions2) {
    const newPerm = await strapi.query("admin::permission").create({ data: permission2 });
    createdPermissions.push(newPerm);
  }
  const permissionsToReturn = permissionDomain.toPermission(createdPermissions);
  strapi.eventHub.emit("permission.create", { permissions: permissionsToReturn });
  return permissionsToReturn;
};
const update$2 = async (params, attributes) => {
  const updatedPermission = await strapi.query("admin::permission").update({ where: params, data: attributes });
  const permissionToReturn = permissionDomain.toPermission(updatedPermission);
  strapi.eventHub.emit("permission.update", { permissions: permissionToReturn });
  return permissionToReturn;
};
const findMany = async (params = {}) => {
  const rawPermissions = await strapi.query("admin::permission").findMany(params);
  return permissionDomain.toPermission(rawPermissions);
};
const findUserPermissions = async (user2) => {
  return findMany({ where: { role: { users: { id: user2.id } } } });
};
const filterPermissionsToRemove = async (permissions2) => {
  const { actionProvider: actionProvider2 } = getService("permission");
  const permissionsToRemove = [];
  for (const permission2 of permissions2) {
    const { subjects, options = {} } = actionProvider2.get(permission2.action) || {};
    const { applyToProperties } = options;
    const invalidProperties = await Promise.all(
      (applyToProperties || []).map(async (property) => {
        const applies = await actionProvider2.appliesToProperty(
          property,
          permission2.action,
          permission2.subject
        );
        return applies && fp.isNil(permissionDomain.getProperty(property, permission2));
      })
    );
    const isRegisteredAction = actionProvider2.has(permission2.action);
    const hasInvalidProperties = fp.isArray(applyToProperties) && invalidProperties.every(fp.eq(true));
    const isInvalidSubject = fp.isArray(subjects) && !subjects.includes(permission2.subject);
    if (!isRegisteredAction || isInvalidSubject || hasInvalidProperties) {
      permissionsToRemove.push(permission2);
    }
  }
  return permissionsToRemove;
};
const cleanPermissionsInDatabase = async () => {
  const pageSize = 200;
  const contentTypeService = getService("content-type");
  const total = await strapi.query("admin::permission").count();
  const pageCount = Math.ceil(total / pageSize);
  for (let page = 0; page < pageCount; page += 1) {
    const results = await strapi.query("admin::permission").findMany({ limit: pageSize, offset: page * pageSize });
    const permissions2 = permissionDomain.toPermission(results);
    const permissionsToRemove = await filterPermissionsToRemove(permissions2);
    const permissionsIdToRemove = fp.map(fp.prop("id"), permissionsToRemove);
    const remainingPermissions = permissions2.filter(
      (permission2) => !permissionsIdToRemove.includes(permission2.id)
    );
    const permissionsWithCleanFields = contentTypeService.cleanPermissionFields(
      remainingPermissions
    );
    const permissionsNeedingToBeUpdated = fp.differenceWith(
      (a, b) => {
        return a.id === b.id && fp.xor(a.properties.fields, b.properties.fields).length === 0;
      },
      permissionsWithCleanFields,
      remainingPermissions
    );
    const updatePromiseProvider = (permission2) => {
      return update$2({ id: permission2.id }, permission2);
    };
    await Promise.all([
      deleteByIds(permissionsIdToRemove),
      pmap__default.default(permissionsNeedingToBeUpdated, updatePromiseProvider, {
        concurrency: 100,
        stopOnError: true
      })
    ]);
  }
};
const actionProvider = createActionProvider();
const conditionProvider = createConditionProvider();
const sectionsBuilder = createDefaultSectionBuilder();
const sanitizePermission = permissionDomain.sanitizePermissionFields;
const engine$1 = createPermissionEngine({
  providers: { action: actionProvider, condition: conditionProvider }
});
const permission$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  actionProvider,
  cleanPermissionsInDatabase,
  conditionProvider,
  createMany,
  createPermissionsManager: index$4,
  deleteByIds,
  deleteByRolesIds,
  engine: engine$1,
  findMany,
  findUserPermissions,
  sanitizePermission,
  sectionsBuilder
}, Symbol.toStringTag, { value: "Module" }));
const getNestedFields = (model, {
  prefix = "",
  nestingLevel = 15,
  components = {},
  requiredOnly = false,
  existingFields = []
}) => {
  if (nestingLevel === 0) {
    return prefix ? [prefix] : [];
  }
  const nonAuthorizableFields = utils$1.contentTypes.getNonVisibleAttributes(model);
  return ___default.default.reduce(
    model.attributes,
    (fields, attr, key) => {
      if (nonAuthorizableFields.includes(key))
        return fields;
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      const shouldBeIncluded = !requiredOnly || attr.required === true;
      const insideExistingFields = existingFields && existingFields.some(fp.startsWith(fieldPath));
      if (attr.type === "component") {
        if (shouldBeIncluded || insideExistingFields) {
          const compoFields = getNestedFields(components[attr.component], {
            nestingLevel: nestingLevel - 1,
            prefix: fieldPath,
            components,
            requiredOnly,
            existingFields
          });
          if (compoFields.length === 0 && shouldBeIncluded) {
            return fields.concat(fieldPath);
          }
          return fields.concat(compoFields);
        }
        return fields;
      }
      if (shouldBeIncluded) {
        return fields.concat(fieldPath);
      }
      return fields;
    },
    []
  );
};
const getNestedFieldsWithIntermediate = (model, { prefix = "", nestingLevel = 15, components = {} }) => {
  if (nestingLevel === 0) {
    return [];
  }
  const nonAuthorizableFields = utils$1.contentTypes.getNonVisibleAttributes(model);
  return ___default.default.reduce(
    model.attributes,
    (fields, attr, key) => {
      if (nonAuthorizableFields.includes(key))
        return fields;
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      fields.push(fieldPath);
      if (attr.type === "component") {
        const compoFields = getNestedFieldsWithIntermediate(components[attr.component], {
          nestingLevel: nestingLevel - 1,
          prefix: fieldPath,
          components
        });
        fields.push(...compoFields);
      }
      return fields;
    },
    []
  );
};
const getPermissionsWithNestedFields = (actions2, { nestingLevel, restrictedSubjects = [] } = {}) => {
  return actions2.reduce((permissions2, action2) => {
    const validSubjects = action2.subjects.filter(
      (subject2) => !restrictedSubjects.includes(subject2)
    );
    for (const subject2 of validSubjects) {
      const fields = actionDomain.appliesToProperty("fields", action2) ? getNestedFields(strapi.contentTypes[subject2], {
        components: strapi.components,
        nestingLevel
      }) : void 0;
      const permission2 = permissionDomain.create({
        action: action2.actionId,
        subject: subject2,
        properties: { fields }
      });
      permissions2.push(permission2);
    }
    return permissions2;
  }, []);
};
const cleanPermissionFields = (permissions2, { nestingLevel } = {}) => {
  const { actionProvider: actionProvider2 } = getService("permission");
  return permissions2.map((permission2) => {
    const {
      action: actionId,
      subject: subject2,
      properties: { fields }
    } = permission2;
    const action2 = actionProvider2.get(actionId);
    if (!actionDomain.appliesToProperty("fields", action2)) {
      return permissionDomain.deleteProperty("fields", permission2);
    }
    if (!subject2 || !strapi.contentTypes[subject2]) {
      return permission2;
    }
    const possibleFields = getNestedFieldsWithIntermediate(strapi.contentTypes[subject2], {
      components: strapi.components,
      nestingLevel
    });
    const requiredFields = getNestedFields(strapi.contentTypes[subject2], {
      components: strapi.components,
      requiredOnly: true,
      nestingLevel,
      existingFields: fields
    });
    const badNestedFields = fp.uniq([...fp.intersection(fields, possibleFields), ...requiredFields]);
    const newFields = badNestedFields.filter(
      (field) => !badNestedFields.some(fp.startsWith(`${field}.`))
    );
    return permissionDomain.setProperty("fields", newFields, permission2);
  }, []);
};
const contentType = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanPermissionFields,
  getNestedFields,
  getNestedFieldsWithIntermediate,
  getPermissionsWithNestedFields
}, Symbol.toStringTag, { value: "Module" }));
const isValidCondition = (condition2) => {
  const { conditionProvider: conditionProvider2 } = getService("permission");
  return fp.isString(condition2) && conditionProvider2.has(condition2);
};
const condition = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isValidCondition
}, Symbol.toStringTag, { value: "Module" }));
const { AUTHOR_CODE, PUBLISH_ACTION } = constants$3;
const { NotFoundError: NotFoundError$2 } = utils$1.errors;
const getAllowedActionsForRole = async (roleId) => {
  const { actionProvider: actionProvider2 } = getService("permission");
  if (!fp.isNil(roleId)) {
    const role2 = await getService("role").findOne({ id: roleId });
    if (!role2) {
      throw new NotFoundError$2("role.notFound");
    }
    if (role2.code === AUTHOR_CODE) {
      return actionProvider2.values().filter(({ actionId }) => actionId !== PUBLISH_ACTION);
    }
  }
  return actionProvider2.values();
};
const action = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getAllowedActionsForRole
}, Symbol.toStringTag, { value: "Module" }));
const { ValidationError: ValidationError$2, NotFoundError: NotFoundError$1 } = utils$1.errors;
const SELECT_FIELDS$1 = [
  "id",
  "name",
  "description",
  "lastUsedAt",
  "type",
  "lifespan",
  "expiresAt",
  "createdAt",
  "updatedAt"
];
const POPULATE_FIELDS$1 = ["permissions"];
const assertCustomTokenPermissionsValidity = (type, permissions2) => {
  if (type !== constants$3.API_TOKEN_TYPE.CUSTOM && !fp.isEmpty(permissions2)) {
    throw new ValidationError$2("Non-custom tokens should not reference permissions");
  }
  if (type === constants$3.API_TOKEN_TYPE.CUSTOM && !fp.isArray(permissions2)) {
    throw new ValidationError$2("Missing permissions attribute for custom token");
  }
  if (type === constants$3.API_TOKEN_TYPE.CUSTOM) {
    const validPermissions = strapi.contentAPI.permissions.providers.action.keys();
    const invalidPermissions = fp.difference(permissions2, validPermissions);
    if (!fp.isEmpty(invalidPermissions)) {
      throw new ValidationError$2(`Unknown permissions provided: ${invalidPermissions.join(", ")}`);
    }
  }
};
const isValidLifespan$1 = (lifespan) => {
  if (fp.isNil(lifespan)) {
    return true;
  }
  if (!fp.isNumber(lifespan) || !Object.values(constants$3.API_TOKEN_LIFESPANS).includes(lifespan)) {
    return false;
  }
  return true;
};
const assertValidLifespan$1 = (lifespan) => {
  if (!isValidLifespan$1(lifespan)) {
    throw new ValidationError$2(
      `lifespan must be one of the following values: 
      ${Object.values(constants$3.API_TOKEN_LIFESPANS).join(", ")}`
    );
  }
};
const flattenTokenPermissions$1 = (token2) => {
  if (!token2) {
    return token2;
  }
  return {
    ...token2,
    permissions: fp.isArray(token2.permissions) ? fp.map("action", token2.permissions) : token2.permissions
  };
};
const getBy$1 = async (whereParams = {}) => {
  if (Object.keys(whereParams).length === 0) {
    return null;
  }
  const token2 = await strapi.query("admin::api-token").findOne({ select: SELECT_FIELDS$1, populate: POPULATE_FIELDS$1, where: whereParams });
  if (!token2) {
    return token2;
  }
  return flattenTokenPermissions$1(token2);
};
const exists$1 = async (whereParams = {}) => {
  const apiToken2 = await getBy$1(whereParams);
  return !!apiToken2;
};
const hash$1 = (accessKey) => {
  return crypto__default.default.createHmac("sha512", strapi.config.get("admin.apiToken.salt")).update(accessKey).digest("hex");
};
const getExpirationFields$1 = (lifespan) => {
  const isValidNumber = fp.isNumber(lifespan) && Number.isFinite(lifespan) && lifespan > 0;
  if (!isValidNumber && !fp.isNil(lifespan)) {
    throw new ValidationError$2("lifespan must be a positive number or null");
  }
  return {
    lifespan: lifespan || null,
    expiresAt: lifespan ? Date.now() + lifespan : null
  };
};
const create$1 = async (attributes) => {
  const accessKey = crypto__default.default.randomBytes(128).toString("hex");
  assertCustomTokenPermissionsValidity(attributes.type, attributes.permissions);
  assertValidLifespan$1(attributes.lifespan);
  const apiToken2 = await strapi.query("admin::api-token").create({
    select: SELECT_FIELDS$1,
    populate: POPULATE_FIELDS$1,
    data: {
      ...fp.omit("permissions", attributes),
      accessKey: hash$1(accessKey),
      ...getExpirationFields$1(attributes.lifespan)
    }
  });
  const result = { ...apiToken2, accessKey };
  if (attributes.type === constants$3.API_TOKEN_TYPE.CUSTOM) {
    await Promise.all(
      fp.uniq(attributes.permissions).map(
        (action2) => strapi.query("admin::api-token-permission").create({
          data: { action: action2, token: apiToken2 }
        })
      )
    );
    const currentPermissions = await strapi.entityService.load(
      "admin::api-token",
      apiToken2,
      "permissions"
    );
    if (currentPermissions) {
      Object.assign(result, { permissions: fp.map("action", currentPermissions) });
    }
  }
  return result;
};
const regenerate$1 = async (id) => {
  const accessKey = crypto__default.default.randomBytes(128).toString("hex");
  const apiToken2 = await strapi.query("admin::api-token").update({
    select: ["id", "accessKey"],
    where: { id },
    data: {
      accessKey: hash$1(accessKey)
    }
  });
  if (!apiToken2) {
    throw new NotFoundError$1("The provided token id does not exist");
  }
  return {
    ...apiToken2,
    accessKey
  };
};
const checkSaltIsDefined$1 = () => {
  if (!strapi.config.get("admin.apiToken.salt")) {
    if (process.env.API_TOKEN_SALT) {
      process.emitWarning(`[deprecated] In future versions, Strapi will stop reading directly from the environment variable API_TOKEN_SALT. Please set apiToken.salt in config/admin.js instead.
For security reasons, keep storing the secret in an environment variable and use env() to read it in config/admin.js (ex: \`apiToken: { salt: env('API_TOKEN_SALT') }\`). See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`);
      strapi.config.set("admin.apiToken.salt", process.env.API_TOKEN_SALT);
    } else {
      throw new Error(
        `Missing apiToken.salt. Please set apiToken.salt in config/admin.js (ex: you can generate one using Node with \`crypto.randomBytes(16).toString('base64')\`).
For security reasons, prefer storing the secret in an environment variable and read it in config/admin.js. See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`
      );
    }
  }
};
const list$1 = async () => {
  const tokens = await strapi.query("admin::api-token").findMany({
    select: SELECT_FIELDS$1,
    populate: POPULATE_FIELDS$1,
    orderBy: { name: "ASC" }
  });
  if (!tokens) {
    return tokens;
  }
  return tokens.map((token2) => flattenTokenPermissions$1(token2));
};
const revoke$1 = async (id) => {
  return strapi.query("admin::api-token").delete({ select: SELECT_FIELDS$1, populate: POPULATE_FIELDS$1, where: { id } });
};
const getById$1 = async (id) => {
  return getBy$1({ id });
};
const getByName$1 = async (name2) => {
  return getBy$1({ name: name2 });
};
const update$1 = async (id, attributes) => {
  const originalToken = await strapi.query("admin::api-token").findOne({ where: { id } });
  if (!originalToken) {
    throw new NotFoundError$1("Token not found");
  }
  const changingTypeToCustom = attributes.type === constants$3.API_TOKEN_TYPE.CUSTOM && originalToken.type !== constants$3.API_TOKEN_TYPE.CUSTOM;
  if (attributes.permissions || changingTypeToCustom) {
    assertCustomTokenPermissionsValidity(
      attributes.type || originalToken.type,
      attributes.permissions || originalToken.permissions
    );
  }
  assertValidLifespan$1(attributes.lifespan);
  const updatedToken = await strapi.query("admin::api-token").update({
    select: SELECT_FIELDS$1,
    where: { id },
    data: fp.omit("permissions", attributes)
  });
  if (updatedToken.type === constants$3.API_TOKEN_TYPE.CUSTOM && attributes.permissions) {
    const currentPermissionsResult = await strapi.entityService.load(
      "admin::api-token",
      updatedToken,
      "permissions"
    );
    const currentPermissions = fp.map("action", currentPermissionsResult || []);
    const newPermissions = fp.uniq(attributes.permissions);
    const actionsToDelete = fp.difference(currentPermissions, newPermissions);
    const actionsToAdd = fp.difference(newPermissions, currentPermissions);
    await Promise.all(
      actionsToDelete.map(
        (action2) => strapi.query("admin::api-token-permission").delete({
          where: { action: action2, token: id }
        })
      )
    );
    await Promise.all(
      actionsToAdd.map(
        (action2) => strapi.query("admin::api-token-permission").create({
          data: { action: action2, token: id }
        })
      )
    );
  } else if (updatedToken.type !== constants$3.API_TOKEN_TYPE.CUSTOM) {
    await strapi.query("admin::api-token-permission").delete({
      where: { token: id }
    });
  }
  const permissionsFromDb = await strapi.entityService.load(
    "admin::api-token",
    updatedToken,
    "permissions"
  );
  return {
    ...updatedToken,
    permissions: permissionsFromDb ? permissionsFromDb.map((p) => p.action) : void 0
  };
};
const apiToken$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  checkSaltIsDefined: checkSaltIsDefined$1,
  create: create$1,
  exists: exists$1,
  getBy: getBy$1,
  getById: getById$1,
  getByName: getByName$1,
  hash: hash$1,
  list: list$1,
  regenerate: regenerate$1,
  revoke: revoke$1,
  update: update$1
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_TRANSFER_ACTIONS = ["push", "pull"];
const providers = {
  action: utils$1.providerFactory(),
  condition: utils$1.providerFactory()
};
DEFAULT_TRANSFER_ACTIONS.forEach((action2) => {
  providers.action.register(action2, { action: action2 });
});
const engine = permissions__default.default.engine.new({ providers });
const permission$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  engine,
  providers
}, Symbol.toStringTag, { value: "Module" }));
const { ValidationError: ValidationError$1, NotFoundError } = utils$1.errors;
const TRANSFER_TOKEN_UID = "admin::transfer-token";
const TRANSFER_TOKEN_PERMISSION_UID = "admin::transfer-token-permission";
const SELECT_FIELDS = [
  "id",
  "name",
  "description",
  "lastUsedAt",
  "lifespan",
  "expiresAt",
  "createdAt",
  "updatedAt"
];
const POPULATE_FIELDS = ["permissions"];
const list = async () => {
  const tokens = await strapi.query(TRANSFER_TOKEN_UID).findMany({
    select: SELECT_FIELDS,
    populate: POPULATE_FIELDS,
    orderBy: { name: "ASC" }
  });
  if (!tokens)
    return tokens;
  return tokens.map((token2) => flattenTokenPermissions(token2));
};
const generateRandomAccessKey = () => crypto__default.default.randomBytes(128).toString("hex");
const validateAccessKey = (accessKey) => {
  assert__default.default(typeof accessKey === "string", "Access key needs to be a string");
  assert__default.default(accessKey.length >= 15, "Access key needs to have at least 15 characters");
  return accessKey;
};
const hasAccessKey = (attributes) => {
  return "accessKey" in attributes;
};
const create = async (attributes) => {
  const accessKey = hasAccessKey(attributes) ? validateAccessKey(attributes.accessKey) : generateRandomAccessKey();
  delete attributes.accessKey;
  assertTokenPermissionsValidity(attributes);
  assertValidLifespan(attributes.lifespan);
  const result = await strapi.db.transaction(async () => {
    const transferToken2 = await strapi.query(TRANSFER_TOKEN_UID).create({
      select: SELECT_FIELDS,
      populate: POPULATE_FIELDS,
      data: {
        ...fp.omit("permissions", attributes),
        accessKey: hash(accessKey),
        ...getExpirationFields(attributes.lifespan)
      }
    });
    await Promise.all(
      fp.uniq(attributes.permissions).map(
        (action2) => strapi.query(TRANSFER_TOKEN_PERMISSION_UID).create({ data: { action: action2, token: transferToken2 } })
      )
    );
    const currentPermissions = await strapi.entityService.load(
      TRANSFER_TOKEN_UID,
      transferToken2,
      "permissions"
    );
    if (currentPermissions) {
      Object.assign(transferToken2, { permissions: fp.map("action", currentPermissions) });
    }
    return transferToken2;
  });
  return { ...result, accessKey };
};
const update = async (id, attributes) => {
  const originalToken = await strapi.query(TRANSFER_TOKEN_UID).findOne({ where: { id } });
  if (!originalToken) {
    throw new NotFoundError("Token not found");
  }
  assertTokenPermissionsValidity(attributes);
  assertValidLifespan(attributes.lifespan);
  return strapi.db.transaction(async () => {
    const updatedToken = await strapi.query(TRANSFER_TOKEN_UID).update({
      select: SELECT_FIELDS,
      where: { id },
      data: {
        ...fp.omit("permissions", attributes)
      }
    });
    if (attributes.permissions) {
      const currentPermissionsResult = await strapi.entityService.load(
        TRANSFER_TOKEN_UID,
        updatedToken,
        "permissions"
      );
      const currentPermissions = fp.map("action", currentPermissionsResult || []);
      const newPermissions = fp.uniq(attributes.permissions);
      const actionsToDelete = fp.difference(currentPermissions, newPermissions);
      const actionsToAdd = fp.difference(newPermissions, currentPermissions);
      await Promise.all(
        actionsToDelete.map(
          (action2) => strapi.query(TRANSFER_TOKEN_PERMISSION_UID).delete({
            where: { action: action2, token: id }
          })
        )
      );
      await Promise.all(
        actionsToAdd.map(
          (action2) => strapi.query(TRANSFER_TOKEN_PERMISSION_UID).create({
            data: { action: action2, token: id }
          })
        )
      );
    }
    const permissionsFromDb = await strapi.entityService.load(
      TRANSFER_TOKEN_UID,
      updatedToken,
      "permissions"
    );
    return {
      ...updatedToken,
      permissions: permissionsFromDb ? permissionsFromDb.map((p) => p.action) : void 0
    };
  });
};
const revoke = async (id) => {
  return strapi.db.transaction(
    async () => strapi.query(TRANSFER_TOKEN_UID).delete({ select: SELECT_FIELDS, populate: POPULATE_FIELDS, where: { id } })
  );
};
const getBy = async (whereParams = {}) => {
  if (Object.keys(whereParams).length === 0) {
    return null;
  }
  const token2 = await strapi.query(TRANSFER_TOKEN_UID).findOne({ select: SELECT_FIELDS, populate: POPULATE_FIELDS, where: whereParams });
  if (!token2) {
    return token2;
  }
  return flattenTokenPermissions(token2);
};
const getById = async (id) => {
  return getBy({ id });
};
const getByName = async (name2) => {
  return getBy({ name: name2 });
};
const exists = async (whereParams = {}) => {
  const transferToken2 = await getBy(whereParams);
  return !!transferToken2;
};
const regenerate = async (id) => {
  const accessKey = crypto__default.default.randomBytes(128).toString("hex");
  const transferToken2 = await strapi.db.transaction(
    async () => strapi.query(TRANSFER_TOKEN_UID).update({
      select: ["id", "accessKey"],
      where: { id },
      data: {
        accessKey: hash(accessKey)
      }
    })
  );
  if (!transferToken2) {
    throw new NotFoundError("The provided token id does not exist");
  }
  return {
    ...transferToken2,
    accessKey
  };
};
const getExpirationFields = (lifespan) => {
  const isValidNumber = fp.isNumber(lifespan) && Number.isFinite(lifespan) && lifespan > 0;
  if (!isValidNumber && !fp.isNil(lifespan)) {
    throw new ValidationError$1("lifespan must be a positive number or null");
  }
  return {
    lifespan: lifespan || null,
    expiresAt: lifespan ? Date.now() + lifespan : null
  };
};
const hash = (accessKey) => {
  const { hasValidTokenSalt: hasValidTokenSalt2 } = getService("transfer").utils;
  if (!hasValidTokenSalt2()) {
    throw new TypeError("Required token salt is not defined");
  }
  return crypto__default.default.createHmac("sha512", strapi.config.get("admin.transfer.token.salt")).update(accessKey).digest("hex");
};
const checkSaltIsDefined = () => {
  const { hasValidTokenSalt: hasValidTokenSalt2, isDisabledFromEnv: isDisabledFromEnv2 } = getService("transfer").utils;
  if (isDisabledFromEnv2()) {
    return;
  }
  if (!hasValidTokenSalt2()) {
    process.emitWarning(
      `Missing transfer.token.salt: Data transfer features have been disabled.
Please set transfer.token.salt in config/admin.js (ex: you can generate one using Node with \`crypto.randomBytes(16).toString('base64')\`)
For security reasons, prefer storing the secret in an environment variable and read it in config/admin.js. See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`
    );
  }
};
const flattenTokenPermissions = (token2) => {
  if (!token2) {
    return token2;
  }
  return {
    ...token2,
    permissions: fp.isArray(token2.permissions) ? fp.map("action", token2.permissions) : token2.permissions
  };
};
const assertTokenPermissionsValidity = (attributes) => {
  const permissionService = strapi.admin.services.transfer.permission;
  const validPermissions = permissionService.providers.action.keys();
  const invalidPermissions = fp.difference(attributes.permissions, validPermissions);
  if (!fp.isEmpty(invalidPermissions)) {
    throw new ValidationError$1(`Unknown permissions provided: ${invalidPermissions.join(", ")}`);
  }
};
const isValidLifespan = (lifespan) => {
  if (fp.isNil(lifespan)) {
    return true;
  }
  if (!fp.isNumber(lifespan) || !Object.values(constants$3.TRANSFER_TOKEN_LIFESPANS).includes(lifespan)) {
    return false;
  }
  return true;
};
const assertValidLifespan = (lifespan) => {
  if (!isValidLifespan(lifespan)) {
    throw new ValidationError$1(
      `lifespan must be one of the following values: 
      ${Object.values(constants$3.TRANSFER_TOKEN_LIFESPANS).join(", ")}`
    );
  }
};
const token$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  checkSaltIsDefined,
  create,
  exists,
  getBy,
  getById,
  getByName,
  hasAccessKey,
  hash,
  list,
  regenerate,
  revoke,
  update
}, Symbol.toStringTag, { value: "Module" }));
const isDisabledFromEnv = () => {
  return utils$1.env.bool("STRAPI_DISABLE_REMOTE_DATA_TRANSFER", false);
};
const hasValidTokenSalt = () => {
  const salt = strapi.config.get("admin.transfer.token.salt", null);
  return typeof salt === "string" && salt.length > 0;
};
const isDataTransferEnabled = () => {
  const { utils: utils2 } = getService("transfer");
  return !utils2.isDisabledFromEnv() && utils2.hasValidTokenSalt();
};
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasValidTokenSalt,
  isDataTransferEnabled,
  isDisabledFromEnv
}, Symbol.toStringTag, { value: "Module" }));
const transfer$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  permission: permission$1,
  token: token$2,
  utils
}, Symbol.toStringTag, { value: "Module" }));
const PROJECT_SETTINGS_FILE_INPUTS = ["menuLogo", "authLogo"];
const parseFilesData = async (files) => {
  const formatedFilesData = {};
  await Promise.all(
    PROJECT_SETTINGS_FILE_INPUTS.map(async (inputName) => {
      const file = files[inputName];
      if (!file) {
        return;
      }
      const getStream = () => fs__default.default.createReadStream(file.path);
      formatedFilesData[inputName] = await strapi.plugin("upload").service("upload").formatFileInfo({
        filename: file.name,
        type: file.type,
        size: file.size
      });
      Object.assign(
        formatedFilesData[inputName],
        await strapi.plugin("upload").service("image-manipulation").getDimensions({ getStream })
      );
      Object.assign(formatedFilesData[inputName], {
        stream: getStream(),
        tmpPath: file.path,
        // TODO
        // @ts-expect-error define the correct return type
        provider: strapi.config.get("plugin.upload").provider
      });
    })
  );
  return formatedFilesData;
};
const getProjectSettings = async () => {
  const store = strapi.store({ type: "core", name: "admin" });
  const defaultProjectSettings = PROJECT_SETTINGS_FILE_INPUTS.reduce((prev, cur) => {
    prev[cur] = null;
    return prev;
  }, {});
  const projectSettings2 = {
    ...defaultProjectSettings,
    // @ts-expect-error spread can be applied to return value
    ...await store.get({ key: "project-settings" })
  };
  PROJECT_SETTINGS_FILE_INPUTS.forEach((inputName) => {
    if (!projectSettings2[inputName]) {
      return;
    }
    projectSettings2[inputName] = _$1.pick(projectSettings2[inputName], [
      "name",
      "url",
      "width",
      "height",
      "ext",
      "size"
    ]);
  });
  return projectSettings2;
};
const uploadFiles = async (files = {}) => {
  return Promise.all(
    Object.values(files).filter((file) => file?.stream instanceof fs__default.default.ReadStream).map((file) => strapi.plugin("upload").provider.uploadStream(file))
  );
};
const deleteOldFiles = async ({ previousSettings, newSettings }) => {
  return Promise.all(
    PROJECT_SETTINGS_FILE_INPUTS.map(async (inputName) => {
      if (!previousSettings) {
        return;
      }
      if (!previousSettings[inputName]) {
        return;
      }
      if (newSettings[inputName] && previousSettings[inputName].hash === newSettings[inputName].hash) {
        return;
      }
      if (strapi.config.get("plugin.upload").provider !== previousSettings[inputName].provider) {
        return;
      }
      strapi.plugin("upload").provider.delete(previousSettings[inputName]);
    })
  );
};
const updateProjectSettings$1 = async (newSettings) => {
  const store = strapi.store({ type: "core", name: "admin" });
  const previousSettings = await store.get({ key: "project-settings" });
  const files = _$1.pick(newSettings, PROJECT_SETTINGS_FILE_INPUTS);
  await uploadFiles(files);
  PROJECT_SETTINGS_FILE_INPUTS.forEach((inputName) => {
    if (newSettings[inputName] !== void 0 && !(typeof newSettings[inputName] === "object")) {
      newSettings[inputName] = null;
      return;
    }
    if (!newSettings[inputName] && previousSettings) {
      newSettings[inputName] = previousSettings[inputName];
      return;
    }
    newSettings[inputName] = _$1.pick(newSettings[inputName], [
      "name",
      "hash",
      "url",
      "width",
      "height",
      "ext",
      "size",
      "provider"
    ]);
  });
  deleteOldFiles({ previousSettings, newSettings });
  await store.set({
    key: "project-settings",
    value: { ...previousSettings, ...newSettings }
  });
  return getProjectSettings();
};
const projectSettings = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deleteOldFiles,
  getProjectSettings,
  parseFilesData,
  updateProjectSettings: updateProjectSettings$1
}, Symbol.toStringTag, { value: "Module" }));
const index$3 = {
  auth,
  user: user$1,
  role: role$1,
  passport,
  token: token$3,
  permission: permission$2,
  metrics,
  "content-type": contentType,
  constants: constants$4,
  condition,
  action,
  "api-token": apiToken$2,
  transfer: transfer$1,
  "project-settings": projectSettings
};
const MAX_IMAGE_WIDTH = 750;
const MAX_IMAGE_HEIGHT = MAX_IMAGE_WIDTH;
const MAX_IMAGE_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_FILE_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const updateProjectSettings = utils$1.yup.object({
  menuLogo: utils$1.yup.string(),
  authLogo: utils$1.yup.string()
}).noUnknown();
const updateProjectSettingsLogo = utils$1.yup.object({
  name: utils$1.yup.string(),
  type: utils$1.yup.string().oneOf(ALLOWED_IMAGE_FILE_TYPES),
  size: utils$1.yup.number().max(MAX_IMAGE_FILE_SIZE)
});
const updateProjectSettingsFiles = utils$1.yup.object({
  menuLogo: updateProjectSettingsLogo,
  authLogo: updateProjectSettingsLogo
}).noUnknown();
const logoDimensions = utils$1.yup.object({
  width: utils$1.yup.number().max(MAX_IMAGE_WIDTH),
  height: utils$1.yup.number().max(MAX_IMAGE_HEIGHT)
});
const updateProjectSettingsImagesDimensions = utils$1.yup.object({
  menuLogo: logoDimensions,
  authLogo: logoDimensions
}).noUnknown();
const validateUpdateProjectSettings = utils$1.validateYupSchemaSync(updateProjectSettings);
const validateUpdateProjectSettingsFiles = utils$1.validateYupSchemaSync(updateProjectSettingsFiles);
const validateUpdateProjectSettingsImagesDimensions = utils$1.validateYupSchemaSync(
  updateProjectSettingsImagesDimensions
);
const { isUsingTypeScript } = tsUtils__default.default;
const admin = {
  // TODO very temporary to check the switch ee/ce
  // When removing this we need to update the /admin/src/index.js file
  // whe,re we set the strapi.window.isEE value
  // NOTE: admin/ee/server overrides this controller, and adds the EE features
  // This returns an empty feature list for CE
  async getProjectType() {
    const flags = strapi.config.get("admin.flags", {});
    return { data: { isEE: false, features: [], flags } };
  },
  async init() {
    let uuid = strapi.config.get("uuid", false);
    const hasAdmin = await getService("user").exists();
    const { menuLogo, authLogo } = await getService("project-settings").getProjectSettings();
    const telemetryDisabled = strapi.config.get(
      "packageJsonStrapi.telemetryDisabled",
      null
    );
    if (telemetryDisabled !== null && telemetryDisabled === true) {
      uuid = false;
    }
    return {
      data: {
        uuid,
        hasAdmin,
        menuLogo: menuLogo ? menuLogo.url : null,
        authLogo: authLogo ? authLogo.url : null
      }
    };
  },
  async getProjectSettings() {
    return getService(
      "project-settings"
    ).getProjectSettings();
  },
  async updateProjectSettings(ctx) {
    const {
      request: { files, body }
    } = ctx;
    const projectSettingsService = getService("project-settings");
    await validateUpdateProjectSettings(body);
    await validateUpdateProjectSettingsFiles(files);
    const formatedFiles = await projectSettingsService.parseFilesData(files);
    await validateUpdateProjectSettingsImagesDimensions(formatedFiles);
    return projectSettingsService.updateProjectSettings({
      ...body,
      ...formatedFiles
    });
  },
  async telemetryProperties(ctx) {
    if (strapi.telemetry.isDisabled) {
      ctx.status = 204;
      return;
    }
    const useTypescriptOnServer = await isUsingTypeScript(strapi.dirs.app.root);
    const useTypescriptOnAdmin = await isUsingTypeScript(
      path__default.default.join(strapi.dirs.app.root, "src", "admin")
    );
    const isHostedOnStrapiCloud = utils$1.env("STRAPI_HOSTING", null) === "strapi.cloud";
    const numberOfAllContentTypes = ___default.default.size(strapi.contentTypes);
    const numberOfComponents = ___default.default.size(strapi.components);
    const getNumberOfDynamicZones = () => {
      return fp.pipe(
        fp.map("attributes"),
        fp.flatMap(fp.values),
        // @ts-expect-error lodash types
        fp.sumBy(fp.propEq("type", "dynamiczone"))
      )(strapi.contentTypes);
    };
    return {
      data: {
        useTypescriptOnServer,
        useTypescriptOnAdmin,
        isHostedOnStrapiCloud,
        numberOfAllContentTypes,
        // TODO: V5: This event should be renamed numberOfContentTypes in V5 as the name is already taken to describe the number of content types using i18n.
        numberOfComponents,
        numberOfDynamicZones: getNumberOfDynamicZones()
      }
    };
  },
  async information() {
    const currentEnvironment = strapi.config.get("environment");
    const autoReload = strapi.config.get("autoReload", false);
    const strapiVersion = strapi.config.get("info.strapi", null);
    const dependencies = strapi.config.get("info.dependencies", {});
    const projectId = strapi.config.get("uuid", null);
    const nodeVersion = process.version;
    const communityEdition = !strapi.EE;
    const useYarn = await fse.exists(path__default.default.join(process.cwd(), "yarn.lock"));
    return {
      data: {
        currentEnvironment,
        autoReload,
        strapiVersion,
        dependencies,
        projectId,
        nodeVersion,
        communityEdition,
        useYarn
      }
    };
  },
  async plugins(ctx) {
    const enabledPlugins = strapi.config.get("enabledPlugins");
    const plugins2 = Object.entries(enabledPlugins).map(([key, plugin]) => ({
      name: plugin.info.name || key,
      displayName: plugin.info.displayName || plugin.info.name || key,
      description: plugin.info.description || "",
      packageName: plugin.info.packageName
    }));
    ctx.send({ plugins: plugins2 });
  }
};
const apiTokenCreationSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1).required(),
  description: utils$1.yup.string().optional(),
  type: utils$1.yup.string().oneOf(Object.values(constants$3.API_TOKEN_TYPE)).required(),
  permissions: utils$1.yup.array().of(utils$1.yup.string()).nullable(),
  lifespan: utils$1.yup.number().min(1).oneOf(Object.values(constants$3.API_TOKEN_LIFESPANS)).nullable()
}).noUnknown().strict();
const apiTokenUpdateSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1).notNull(),
  description: utils$1.yup.string().nullable(),
  type: utils$1.yup.string().oneOf(Object.values(constants$3.API_TOKEN_TYPE)).notNull(),
  permissions: utils$1.yup.array().of(utils$1.yup.string()).nullable()
}).noUnknown().strict();
const validateApiTokenCreationInput = utils$1.validateYupSchema(apiTokenCreationSchema);
const validateApiTokenUpdateInput = utils$1.validateYupSchema(apiTokenUpdateSchema);
const { ApplicationError: ApplicationError$4 } = utils$1.errors;
const apiToken$1 = {
  async create(ctx) {
    const { body } = ctx.request;
    const apiTokenService = getService("api-token");
    const attributes = {
      name: fp.trim(body.name),
      description: fp.trim(body.description),
      type: body.type,
      permissions: body.permissions,
      lifespan: body.lifespan
    };
    await validateApiTokenCreationInput(attributes);
    const alreadyExists = await apiTokenService.exists({ name: attributes.name });
    if (alreadyExists) {
      throw new ApplicationError$4("Name already taken");
    }
    const apiToken2 = await apiTokenService.create(attributes);
    ctx.created({ data: apiToken2 });
  },
  async regenerate(ctx) {
    const { id } = ctx.params;
    const apiTokenService = getService("api-token");
    const apiTokenExists = await apiTokenService.getById(id);
    if (!apiTokenExists) {
      ctx.notFound("API Token not found");
      return;
    }
    const accessToken = await apiTokenService.regenerate(id);
    ctx.created({ data: accessToken });
  },
  async list(ctx) {
    const apiTokenService = getService("api-token");
    const apiTokens2 = await apiTokenService.list();
    ctx.send({ data: apiTokens2 });
  },
  async revoke(ctx) {
    const { id } = ctx.params;
    const apiTokenService = getService("api-token");
    const apiToken2 = await apiTokenService.revoke(id);
    ctx.deleted({ data: apiToken2 });
  },
  async get(ctx) {
    const { id } = ctx.params;
    const apiTokenService = getService("api-token");
    const apiToken2 = await apiTokenService.getById(id);
    if (!apiToken2) {
      ctx.notFound("API Token not found");
      return;
    }
    ctx.send({ data: apiToken2 });
  },
  async update(ctx) {
    const { body } = ctx.request;
    const { id } = ctx.params;
    const apiTokenService = getService("api-token");
    const attributes = body;
    if (fp.has("name", attributes)) {
      attributes.name = fp.trim(body.name);
    }
    if (fp.has("description", attributes) || attributes.description === null) {
      attributes.description = fp.trim(body.description);
    }
    await validateApiTokenUpdateInput(attributes);
    const apiTokenExists = await apiTokenService.getById(id);
    if (!apiTokenExists) {
      return ctx.notFound("API Token not found");
    }
    if (fp.has("name", attributes)) {
      const nameAlreadyTaken = await apiTokenService.getByName(attributes.name);
      if (!!nameAlreadyTaken && !utils$1.stringEquals(nameAlreadyTaken.id, id)) {
        throw new ApplicationError$4("Name already taken");
      }
    }
    const apiToken2 = await apiTokenService.update(id, attributes);
    ctx.send({ data: apiToken2 });
  },
  async getLayout(ctx) {
    const apiTokenService = getService("api-token");
    const layout = await apiTokenService.getApiTokenLayout();
    ctx.send({ data: layout });
  }
};
const userCreationSchema = utils$1.yup.object().shape({
  email: validators.email.required(),
  firstname: validators.firstname.required(),
  lastname: validators.lastname,
  roles: validators.roles.min(1),
  preferedLanguage: utils$1.yup.string().nullable()
}).noUnknown();
const profileUpdateSchema = utils$1.yup.object().shape({
  email: validators.email.notNull(),
  firstname: validators.firstname.notNull(),
  lastname: validators.lastname.nullable(),
  username: validators.username.nullable(),
  password: validators.password.notNull(),
  currentPassword: utils$1.yup.string().when(
    "password",
    (password2, schema) => !fp.isUndefined(password2) ? schema.required() : schema
  ).notNull(),
  preferedLanguage: utils$1.yup.string().nullable()
}).noUnknown();
const userUpdateSchema = utils$1.yup.object().shape({
  email: validators.email.notNull(),
  firstname: validators.firstname.notNull(),
  lastname: validators.lastname.nullable(),
  username: validators.username.nullable(),
  password: validators.password.notNull(),
  isActive: utils$1.yup.bool().notNull(),
  roles: validators.roles.min(1).notNull()
}).noUnknown();
const usersDeleteSchema = utils$1.yup.object().shape({
  ids: utils$1.yup.array().of(utils$1.yup.strapiID()).min(1).required()
}).noUnknown();
const validateUserCreationInput = utils$1.validateYupSchema(userCreationSchema);
const validateProfileUpdateInput = utils$1.validateYupSchema(profileUpdateSchema);
const validateUserUpdateInput = utils$1.validateYupSchema(userUpdateSchema);
const validateUsersDeleteInput = utils$1.validateYupSchema(usersDeleteSchema);
const authenticatedUser = {
  async getMe(ctx) {
    const userInfo = getService("user").sanitizeUser(ctx.state.user);
    ctx.body = {
      data: userInfo
    };
  },
  async updateMe(ctx) {
    const input = ctx.request.body;
    await validateProfileUpdateInput(input);
    const userService = getService("user");
    const authServer = getService("auth");
    const { currentPassword, ...userInfo } = input;
    if (currentPassword && userInfo.password) {
      const isValid = await authServer.validatePassword(currentPassword, ctx.state.user.password);
      if (!isValid) {
        return ctx.badRequest("ValidationError", {
          currentPassword: ["Invalid credentials"]
        });
      }
    }
    const updatedUser = await userService.updateById(ctx.state.user.id, userInfo);
    ctx.body = {
      data: userService.sanitizeUser(updatedUser)
    };
  },
  async getOwnPermissions(ctx) {
    const { findUserPermissions: findUserPermissions2, sanitizePermission: sanitizePermission2 } = getService("permission");
    const { user: user2 } = ctx.state;
    const userPermissions = await findUserPermissions2(user2);
    ctx.body = {
      // @ts-expect-error - transform response type to sanitized permission
      data: userPermissions.map(sanitizePermission2)
    };
  }
};
const registrationSchema = utils$1.yup.object().shape({
  registrationToken: utils$1.yup.string().required(),
  userInfo: utils$1.yup.object().shape({
    firstname: validators.firstname.required(),
    lastname: validators.lastname.nullable(),
    password: validators.password.required()
  }).required().noUnknown()
}).noUnknown();
const registrationInfoQuerySchema = utils$1.yup.object().shape({
  registrationToken: utils$1.yup.string().required()
}).required().noUnknown();
const adminRegistrationSchema = utils$1.yup.object().shape({
  email: validators.email.required(),
  firstname: validators.firstname.required(),
  lastname: validators.lastname.nullable(),
  password: validators.password.required()
}).required().noUnknown();
const validateRegistrationInput = utils$1.validateYupSchema(registrationSchema);
const validateRegistrationInfoQuery = utils$1.validateYupSchema(registrationInfoQuerySchema);
const validateAdminRegistrationInput = utils$1.validateYupSchema(adminRegistrationSchema);
const forgotPasswordSchema = utils$1.yup.object().shape({
  email: validators.email.required()
}).required().noUnknown();
const validateForgotPasswordInput = utils$1.validateYupSchema(forgotPasswordSchema);
const resetPasswordSchema = utils$1.yup.object().shape({
  resetPasswordToken: utils$1.yup.string().required(),
  password: validators.password.required()
}).required().noUnknown();
const validateResetPasswordInput = utils$1.validateYupSchema(resetPasswordSchema);
const renewToken = utils$1.yup.object().shape({ token: utils$1.yup.string().required() }).required().noUnknown();
const validateRenewTokenInput = utils$1.validateYupSchema(renewToken);
const { ApplicationError: ApplicationError$3, ValidationError } = utils$1.errors;
const authentication = {
  login: compose__default.default([
    (ctx, next) => {
      return passport__default.default.authenticate("local", { session: false }, (err, user2, info) => {
        if (err) {
          strapi.eventHub.emit("admin.auth.error", { error: err, provider: "local" });
          if (err.details?.code === "LOGIN_NOT_ALLOWED") {
            throw err;
          }
          return ctx.notImplemented();
        }
        if (!user2) {
          strapi.eventHub.emit("admin.auth.error", {
            error: new Error(info.message),
            provider: "local"
          });
          throw new ApplicationError$3(info.message);
        }
        const query = ctx.state;
        query.user = user2;
        const sanitizedUser = getService("user").sanitizeUser(user2);
        strapi.eventHub.emit("admin.auth.success", { user: sanitizedUser, provider: "local" });
        return next();
      })(ctx, next);
    },
    (ctx) => {
      const { user: user2 } = ctx.state;
      ctx.body = {
        data: {
          token: getService("token").createJwtToken(user2),
          user: getService("user").sanitizeUser(ctx.state.user)
          // TODO: fetch more detailed info
        }
      };
    }
  ]),
  async renewToken(ctx) {
    await validateRenewTokenInput(ctx.request.body);
    const { token: token2 } = ctx.request.body;
    const { isValid, payload } = getService("token").decodeJwtToken(token2);
    if (!isValid) {
      throw new ValidationError("Invalid token");
    }
    ctx.body = {
      data: {
        token: getService("token").createJwtToken({ id: payload.id })
      }
    };
  },
  async registrationInfo(ctx) {
    await validateRegistrationInfoQuery(ctx.request.query);
    const { registrationToken } = ctx.request.query;
    const registrationInfo = await getService("user").findRegistrationInfo(registrationToken);
    if (!registrationInfo) {
      throw new ValidationError("Invalid registrationToken");
    }
    ctx.body = { data: registrationInfo };
  },
  async register(ctx) {
    const input = ctx.request.body;
    await validateRegistrationInput(input);
    const user2 = await getService("user").register(input);
    ctx.body = {
      data: {
        token: getService("token").createJwtToken(user2),
        user: getService("user").sanitizeUser(user2)
      }
    };
  },
  async registerAdmin(ctx) {
    const input = ctx.request.body;
    await validateAdminRegistrationInput(input);
    const hasAdmin = await getService("user").exists();
    if (hasAdmin) {
      throw new ApplicationError$3("You cannot register a new super admin");
    }
    const superAdminRole = await getService("role").getSuperAdmin();
    if (!superAdminRole) {
      throw new ApplicationError$3(
        "Cannot register the first admin because the super admin role doesn't exist."
      );
    }
    const user2 = await getService("user").create({
      ...input,
      registrationToken: null,
      isActive: true,
      roles: superAdminRole ? [superAdminRole.id] : []
    });
    strapi.telemetry.send("didCreateFirstAdmin");
    ctx.body = {
      data: {
        token: getService("token").createJwtToken(user2),
        user: getService("user").sanitizeUser(user2)
      }
    };
  },
  async forgotPassword(ctx) {
    const input = ctx.request.body;
    await validateForgotPasswordInput(input);
    getService("auth").forgotPassword(input);
    ctx.status = 204;
  },
  async resetPassword(ctx) {
    const input = ctx.request.body;
    await validateResetPasswordInput(input);
    const user2 = await getService("auth").resetPassword(input);
    ctx.body = {
      data: {
        token: getService("token").createJwtToken(user2),
        user: getService("user").sanitizeUser(user2)
      }
    };
  },
  logout(ctx) {
    const sanitizedUser = getService("user").sanitizeUser(ctx.state.user);
    strapi.eventHub.emit("admin.logout", { user: sanitizedUser });
    ctx.body = { data: {} };
  }
};
const publicFields = ["id", "displayName", "category"];
const formatConditions = fp.map(fp.pick(publicFields));
const permission = {
  /**
   * Check each permissions from `request.body.permissions` and returns an array of booleans
   * @param {KoaContext} ctx - koa context
   */
  async check(ctx) {
    const { body: input } = ctx.request;
    const { userAbility } = ctx.state;
    await validateCheckPermissionsInput(input);
    const { engine: engine2 } = getService("permission");
    const checkPermissionsFn = engine2.checkMany(userAbility);
    ctx.body = {
      data: checkPermissionsFn(input.permissions)
    };
  },
  /**
   * Returns every permissions, in nested format
   * @param {KoaContext} ctx - koa context
   */
  async getAll(ctx) {
    const { sectionsBuilder: sectionsBuilder2, actionProvider: actionProvider2, conditionProvider: conditionProvider2 } = getService("permission");
    const actions2 = actionProvider2.values();
    const conditions2 = conditionProvider2.values();
    const sections = await sectionsBuilder2.build(actions2);
    ctx.body = {
      data: {
        // @ts-expect-error - refactor to use a proper type
        conditions: formatConditions(conditions2),
        sections
      }
    };
  }
};
const roleCreateSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1).required(),
  description: utils$1.yup.string().nullable()
}).noUnknown();
const rolesDeleteSchema = utils$1.yup.object().shape({
  ids: utils$1.yup.array().of(utils$1.yup.strapiID()).min(1).required().test("roles-deletion-checks", "Roles deletion checks have failed", async function(ids) {
    try {
      await strapi.admin.services.role.checkRolesIdForDeletion(ids);
    } catch (e) {
      return this.createError({ path: "ids", message: e.message });
    }
    return true;
  })
}).noUnknown();
const roleDeleteSchema = utils$1.yup.strapiID().required().test("no-admin-single-delete", "Role deletion checks have failed", async function(id) {
  try {
    await strapi.admin.services.role.checkRolesIdForDeletion([id]);
  } catch (e) {
    return this.createError({ path: "id", message: e.message });
  }
  return true;
});
const roleUpdateSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1),
  description: utils$1.yup.string().nullable()
}).noUnknown();
const validateRoleCreateInput = utils$1.validateYupSchema(roleCreateSchema);
const validateRoleUpdateInput = utils$1.validateYupSchema(roleUpdateSchema);
const validateRolesDeleteInput = utils$1.validateYupSchema(rolesDeleteSchema);
const validateRoleDeleteInput = utils$1.validateYupSchema(roleDeleteSchema);
const { ApplicationError: ApplicationError$2 } = utils$1.errors;
const { SUPER_ADMIN_CODE } = constants$3;
const role = {
  /**
   * Create a new role
   * @param {KoaContext} ctx - koa context
   */
  async create(ctx) {
    const { body } = ctx.request;
    await validateRoleCreateInput(body);
    const roleService = getService("role");
    const role2 = await roleService.create(body);
    const sanitizedRole = roleService.sanitizeRole(role2);
    ctx.created({ data: sanitizedRole });
  },
  /**
   * Returns on role by id
   * @param {KoaContext} ctx - koa context
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const role2 = await getService("role").findOneWithUsersCount({ id });
    if (!role2) {
      return ctx.notFound("role.notFound");
    }
    ctx.body = {
      data: role2
    };
  },
  /**
   * Returns every roles
   * @param {KoaContext} ctx - koa context
   */
  async findAll(ctx) {
    const { query } = ctx.request;
    const permissionsManager = getService("permission").createPermissionsManager({
      ability: ctx.state.userAbility,
      model: "admin::role"
    });
    await permissionsManager.validateQuery(query);
    const sanitizedQuery = await permissionsManager.sanitizeQuery(query);
    const roles2 = await getService("role").findAllWithUsersCount(sanitizedQuery);
    ctx.body = {
      data: roles2
    };
  },
  /**
   * Updates a role by id
   * @param {KoaContext} ctx - koa context
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;
    const roleService = getService("role");
    await validateRoleUpdateInput(body);
    const role2 = await roleService.findOne({ id });
    if (!role2) {
      return ctx.notFound("role.notFound");
    }
    if (role2.code === SUPER_ADMIN_CODE) {
      throw new ApplicationError$2("Super admin can't be edited.");
    }
    const updatedRole = await roleService.update({ id }, body);
    const sanitizedRole = roleService.sanitizeRole(updatedRole);
    ctx.body = {
      data: sanitizedRole
    };
  },
  /**
   * Returns the permissions assigned to a role
   * @param {KoaContext} ctx - koa context
   */
  async getPermissions(ctx) {
    const { id } = ctx.params;
    const roleService = getService("role");
    const permissionService = getService("permission");
    const role2 = await roleService.findOne({ id });
    if (!role2) {
      return ctx.notFound("role.notFound");
    }
    const permissions2 = await permissionService.findMany({ where: { role: { id: role2.id } } });
    const sanitizedPermissions = permissions2.map(permissionService.sanitizePermission);
    ctx.body = {
      // @ts-expect-error - transform response type to sanitized permission
      data: sanitizedPermissions
    };
  },
  /**
   * Updates the permissions assigned to a role
   * @param {KoaContext} ctx - koa context
   */
  async updatePermissions(ctx) {
    const { id } = ctx.params;
    const { body: input } = ctx.request;
    const roleService = getService("role");
    const permissionService = getService("permission");
    const role2 = await roleService.findOne({ id });
    if (!role2) {
      return ctx.notFound("role.notFound");
    }
    if (role2.code === SUPER_ADMIN_CODE) {
      throw new ApplicationError$2("Super admin permissions can't be edited.");
    }
    await validatedUpdatePermissionsInput(input);
    if (!role2) {
      return ctx.notFound("role.notFound");
    }
    const permissions2 = await roleService.assignPermissions(role2.id, input.permissions);
    const sanitizedPermissions = permissions2.map(permissionService.sanitizePermission);
    ctx.body = {
      data: sanitizedPermissions
    };
  },
  /**
   * Delete a role
   * @param {KoaContext} ctx - koa context
   */
  async deleteOne(ctx) {
    const { id } = ctx.params;
    await validateRoleDeleteInput(id);
    const roleService = getService("role");
    const roles2 = await roleService.deleteByIds([id]);
    const sanitizedRole = roles2.map((role2) => roleService.sanitizeRole(role2))[0] || null;
    return ctx.deleted({
      data: sanitizedRole
    });
  },
  /**
   * delete several roles
   * @param {KoaContext} ctx - koa context
   */
  async deleteMany(ctx) {
    const { body } = ctx.request;
    await validateRolesDeleteInput(body);
    const roleService = getService("role");
    const roles2 = await roleService.deleteByIds(body.ids);
    const sanitizedRoles = roles2.map(roleService.sanitizeRole);
    return ctx.deleted({
      data: sanitizedRoles
    });
  }
};
const {
  remote: {
    handlers: { createPushController, createPullController }
  }
} = dataTransfer$1.strapi;
const { UnauthorizedError } = utils$1.errors;
const verify = async (ctx, scope) => {
  const { auth: auth2 } = ctx.state;
  if (!auth2) {
    throw new UnauthorizedError();
  }
  await dataTransferAuthStrategy.verify(auth2, { scope });
};
const push = createPushController({ verify });
const pull = createPullController({ verify });
const runner = {
  push,
  pull
};
const transferTokenCreationSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1).required(),
  description: utils$1.yup.string().optional(),
  permissions: utils$1.yup.array().min(1).of(utils$1.yup.string().oneOf(Object.values(constants$3.TRANSFER_TOKEN_TYPE))).required(),
  lifespan: utils$1.yup.number().min(1).oneOf(Object.values(constants$3.TRANSFER_TOKEN_LIFESPANS)).nullable()
}).noUnknown().strict();
const transferTokenUpdateSchema = utils$1.yup.object().shape({
  name: utils$1.yup.string().min(1).notNull(),
  description: utils$1.yup.string().nullable(),
  permissions: utils$1.yup.array().min(1).of(utils$1.yup.string().oneOf(Object.values(constants$3.TRANSFER_TOKEN_TYPE))).nullable()
}).noUnknown().strict();
const validateTransferTokenCreationInput$1 = utils$1.validateYupSchema(transferTokenCreationSchema);
const validateTransferTokenUpdateInput$1 = utils$1.validateYupSchema(transferTokenUpdateSchema);
const token$1 = {
  validateTransferTokenCreationInput: validateTransferTokenCreationInput$1,
  validateTransferTokenUpdateInput: validateTransferTokenUpdateInput$1
};
const { ApplicationError: ApplicationError$1 } = utils$1.errors;
const { validateTransferTokenCreationInput, validateTransferTokenUpdateInput } = token$1;
const token = {
  async list(ctx) {
    const transferService = getService("transfer");
    const transferTokens = await transferService.token.list();
    ctx.body = { data: transferTokens };
  },
  async getById(ctx) {
    const { id } = ctx.params;
    const tokenService = getService("transfer").token;
    const transferToken2 = await tokenService.getById(id);
    if (!transferToken2) {
      ctx.notFound("Transfer token not found");
      return;
    }
    ctx.body = { data: transferToken2 };
  },
  async create(ctx) {
    const { body } = ctx.request;
    const { token: tokenService } = getService("transfer");
    const attributes = {
      name: fp.trim(body.name),
      description: fp.trim(body.description),
      permissions: body.permissions,
      lifespan: body.lifespan
    };
    await validateTransferTokenCreationInput(attributes);
    const alreadyExists = await tokenService.exists({ name: attributes.name });
    if (alreadyExists) {
      throw new ApplicationError$1("Name already taken");
    }
    const transferTokens = await tokenService.create(attributes);
    ctx.created({ data: transferTokens });
  },
  async update(ctx) {
    const { body } = ctx.request;
    const { id } = ctx.params;
    const { token: tokenService } = getService("transfer");
    const attributes = body;
    if (fp.has("name", attributes)) {
      attributes.name = fp.trim(body.name);
    }
    if (fp.has("description", attributes) || attributes.description === null) {
      attributes.description = fp.trim(body.description);
    }
    await validateTransferTokenUpdateInput(attributes);
    const apiTokenExists = await tokenService.getById(id);
    if (!apiTokenExists) {
      return ctx.notFound("Transfer token not found");
    }
    if (fp.has("name", attributes)) {
      const nameAlreadyTaken = await tokenService.getByName(attributes.name);
      if (!!nameAlreadyTaken && !utils$1.stringEquals(nameAlreadyTaken.id, id)) {
        throw new ApplicationError$1("Name already taken");
      }
    }
    const apiToken2 = await tokenService.update(id, attributes);
    ctx.body = { data: apiToken2 };
  },
  async revoke(ctx) {
    const { id } = ctx.params;
    const { token: tokenService } = getService("transfer");
    const transferToken2 = await tokenService.revoke(id);
    ctx.deleted({ data: transferToken2 });
  },
  async regenerate(ctx) {
    const { id } = ctx.params;
    const { token: tokenService } = getService("transfer");
    const exists2 = await tokenService.getById(id);
    if (!exists2) {
      ctx.notFound("Transfer token not found");
      return;
    }
    const accessToken = await tokenService.regenerate(id);
    ctx.created({ data: accessToken });
  }
};
const prefixActionsName = (prefix, dict) => fp.mapKeys((key) => `${prefix}-${key}`, dict);
const transfer = {
  ...prefixActionsName("runner", runner),
  ...prefixActionsName("token", token)
};
const _ = require("lodash");
const { ApplicationError } = utils$1.errors;
const user = {
  async create(ctx) {
    const { body } = ctx.request;
    const cleanData = { ...body, email: _.get(body, `email`, ``).toLowerCase() };
    await validateUserCreationInput(cleanData);
    const attributes = _.pick(cleanData, [
      "firstname",
      "lastname",
      "email",
      "roles",
      "preferedLanguage"
    ]);
    const userAlreadyExists = await getService("user").exists({
      email: attributes.email
    });
    if (userAlreadyExists) {
      throw new ApplicationError("Email already taken");
    }
    const createdUser = await getService("user").create(attributes);
    const userInfo = getService("user").sanitizeUser(createdUser);
    Object.assign(userInfo, { registrationToken: createdUser.registrationToken });
    ctx.created({ data: userInfo });
  },
  async find(ctx) {
    const userService = getService("user");
    const permissionsManager = strapi.admin.services.permission.createPermissionsManager({
      ability: ctx.state.userAbility,
      model: "admin::user"
    });
    await permissionsManager.validateQuery(ctx.query);
    const sanitizedQuery = await permissionsManager.sanitizeQuery(ctx.query);
    const { results, pagination } = await userService.findPage(sanitizedQuery);
    ctx.body = {
      data: {
        results: results.map((user2) => userService.sanitizeUser(user2)),
        pagination
      }
    };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const user2 = await getService("user").findOne(id);
    if (!user2) {
      return ctx.notFound("User does not exist");
    }
    ctx.body = {
      data: getService("user").sanitizeUser(user2)
    };
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body: input } = ctx.request;
    await validateUserUpdateInput(input);
    if (_.has(input, "email")) {
      const uniqueEmailCheck = await getService("user").exists({
        id: { $ne: id },
        email: input.email
      });
      if (uniqueEmailCheck) {
        throw new ApplicationError("A user with this email address already exists");
      }
    }
    const updatedUser = await getService("user").updateById(id, input);
    if (!updatedUser) {
      return ctx.notFound("User does not exist");
    }
    ctx.body = {
      data: getService("user").sanitizeUser(updatedUser)
    };
  },
  async deleteOne(ctx) {
    const { id } = ctx.params;
    const deletedUser = await getService("user").deleteById(id);
    if (!deletedUser) {
      return ctx.notFound("User not found");
    }
    return ctx.deleted({
      data: getService("user").sanitizeUser(deletedUser)
    });
  },
  /**
   * Delete several users
   * @param ctx - koa context
   */
  async deleteMany(ctx) {
    const { body } = ctx.request;
    await validateUsersDeleteInput(body);
    const users2 = await getService("user").deleteByIds(body.ids);
    const sanitizedUsers = users2.map(getService("user").sanitizeUser);
    return ctx.deleted({
      data: sanitizedUsers
    });
  }
};
const urlRegex = /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)(?:\.(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
const webhookValidator = utils$1.yup.object({
  name: utils$1.yup.string().required(),
  url: utils$1.yup.string().matches(urlRegex, "url must be a valid URL").required().test(
    "is-public-url",
    "Url is not supported because it isn't reachable over the public internet",
    async (url) => {
      if (process.env.NODE_ENV !== "production") {
        return true;
      }
      try {
        const parsedUrl = new URL(punycode__default.default.toASCII(url));
        const isLocalUrl = await isLocalhostIp__default.default(parsedUrl.hostname);
        return !isLocalUrl;
      } catch {
        return false;
      }
    }
  ),
  headers: utils$1.yup.lazy((data) => {
    if (typeof data !== "object") {
      return utils$1.yup.object().required();
    }
    return utils$1.yup.object(
      // @ts-expect-error lodash types
      ___default.default.mapValues(data, () => {
        utils$1.yup.string().min(1).required();
      })
    ).required();
  }),
  events: utils$1.yup.array().of(utils$1.yup.string()).required()
}).noUnknown();
const updateWebhookValidator = webhookValidator.shape({
  isEnabled: utils$1.yup.boolean()
});
const webhooks = {
  async listWebhooks(ctx) {
    const webhooks2 = await strapi.webhookStore.findWebhooks();
    ctx.send({ data: webhooks2 });
  },
  async getWebhook(ctx) {
    const { id } = ctx.params;
    const webhook = await strapi.webhookStore.findWebhook(id);
    if (!webhook) {
      return ctx.notFound("webhook.notFound");
    }
    ctx.send({ data: webhook });
  },
  async createWebhook(ctx) {
    const { body } = ctx.request;
    await utils$1.validateYupSchema(webhookValidator)(body);
    const webhook = await strapi.webhookStore.createWebhook(body);
    strapi.webhookRunner.add(webhook);
    ctx.created({ data: webhook });
  },
  async updateWebhook(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;
    await utils$1.validateYupSchema(updateWebhookValidator)(body);
    const webhook = await strapi.webhookStore.findWebhook(id);
    if (!webhook) {
      return ctx.notFound("webhook.notFound");
    }
    const updatedWebhook = await strapi.webhookStore.updateWebhook(id, {
      ...webhook,
      ...body
    });
    if (!updatedWebhook) {
      return ctx.notFound("webhook.notFound");
    }
    strapi.webhookRunner.update(updatedWebhook);
    ctx.send({ data: updatedWebhook });
  },
  async deleteWebhook(ctx) {
    const { id } = ctx.params;
    const webhook = await strapi.webhookStore.findWebhook(id);
    if (!webhook) {
      return ctx.notFound("webhook.notFound");
    }
    await strapi.webhookStore.deleteWebhook(id);
    strapi.webhookRunner.remove(webhook);
    ctx.body = { data: webhook };
  },
  async deleteWebhooks(ctx) {
    const { ids } = ctx.request.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest("ids must be an array of id");
    }
    for (const id of ids) {
      const webhook = await strapi.webhookStore.findWebhook(id);
      if (webhook) {
        await strapi.webhookStore.deleteWebhook(id);
        strapi.webhookRunner.remove(webhook);
      }
    }
    ctx.send({ data: ids });
  },
  async triggerWebhook(ctx) {
    const { id } = ctx.params;
    const webhook = await strapi.webhookStore.findWebhook(id);
    const response = await strapi.webhookRunner.run(webhook, "trigger-test", {});
    ctx.body = { data: response };
  }
};
const contentApi = {
  async getPermissions(ctx) {
    const actionsMap = await strapi.contentAPI.permissions.getActionsMap();
    ctx.send({ data: actionsMap });
  },
  async getRoutes(ctx) {
    const routesMap = await strapi.contentAPI.getRoutesMap();
    ctx.send({ data: routesMap });
  }
};
const index$2 = {
  admin,
  "api-token": apiToken$1,
  "authenticated-user": authenticatedUser,
  authentication,
  permission,
  role,
  transfer,
  user,
  webhooks,
  "content-api": contentApi
};
const Permission = {
  collectionName: "admin_permissions",
  info: {
    name: "Permission",
    description: "",
    singularName: "permission",
    pluralName: "permissions",
    displayName: "Permission"
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    action: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true
    },
    actionParameters: {
      type: "json",
      configurable: false,
      required: false,
      default: {}
    },
    subject: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: false
    },
    properties: {
      type: "json",
      configurable: false,
      required: false,
      default: {}
    },
    conditions: {
      type: "json",
      configurable: false,
      required: false,
      default: []
    },
    role: {
      configurable: false,
      type: "relation",
      relation: "manyToOne",
      inversedBy: "permissions",
      target: "admin::role"
    }
  }
};
const User = {
  collectionName: "admin_users",
  info: {
    name: "User",
    description: "",
    singularName: "user",
    pluralName: "users",
    displayName: "User"
  },
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    firstname: {
      type: "string",
      unique: false,
      minLength: 1,
      configurable: false,
      required: false
    },
    lastname: {
      type: "string",
      unique: false,
      minLength: 1,
      configurable: false,
      required: false
    },
    username: {
      type: "string",
      unique: false,
      configurable: false,
      required: false
    },
    email: {
      type: "email",
      minLength: 6,
      configurable: false,
      required: true,
      unique: true,
      private: true
    },
    password: {
      type: "password",
      minLength: 6,
      configurable: false,
      required: false,
      private: true,
      searchable: false
    },
    resetPasswordToken: {
      type: "string",
      configurable: false,
      private: true,
      searchable: false
    },
    registrationToken: {
      type: "string",
      configurable: false,
      private: true,
      searchable: false
    },
    isActive: {
      type: "boolean",
      default: false,
      configurable: false,
      private: true
    },
    roles: {
      configurable: false,
      private: true,
      type: "relation",
      relation: "manyToMany",
      inversedBy: "users",
      target: "admin::role",
      // FIXME: Allow setting this
      collectionName: "strapi_users_roles"
    },
    blocked: {
      type: "boolean",
      default: false,
      configurable: false,
      private: true
    },
    preferedLanguage: {
      type: "string",
      configurable: false,
      required: false,
      searchable: false
    }
  },
  config: {
    attributes: {
      resetPasswordToken: {
        hidden: true
      },
      registrationToken: {
        hidden: true
      }
    }
  }
};
const Role = {
  collectionName: "admin_roles",
  info: {
    name: "Role",
    description: "",
    singularName: "role",
    pluralName: "roles",
    displayName: "Role"
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    name: {
      type: "string",
      minLength: 1,
      unique: true,
      configurable: false,
      required: true
    },
    code: {
      type: "string",
      minLength: 1,
      unique: true,
      configurable: false,
      required: true
    },
    description: {
      type: "string",
      configurable: false
    },
    users: {
      configurable: false,
      type: "relation",
      relation: "manyToMany",
      mappedBy: "roles",
      target: "admin::user"
    },
    permissions: {
      configurable: false,
      type: "relation",
      relation: "oneToMany",
      mappedBy: "role",
      target: "admin::permission"
    }
  }
};
const apiToken = {
  collectionName: "strapi_api_tokens",
  info: {
    name: "Api Token",
    singularName: "api-token",
    pluralName: "api-tokens",
    displayName: "Api Token",
    description: ""
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    name: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true,
      unique: true
    },
    description: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: false,
      default: ""
    },
    type: {
      type: "enumeration",
      enum: Object.values(constants$3.API_TOKEN_TYPE),
      configurable: false,
      required: true,
      default: constants$3.API_TOKEN_TYPE.READ_ONLY
    },
    accessKey: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true,
      searchable: false
    },
    lastUsedAt: {
      type: "datetime",
      configurable: false,
      required: false
    },
    permissions: {
      type: "relation",
      target: "admin::api-token-permission",
      relation: "oneToMany",
      mappedBy: "token",
      configurable: false,
      required: false
    },
    expiresAt: {
      type: "datetime",
      configurable: false,
      required: false
    },
    lifespan: {
      type: "biginteger",
      configurable: false,
      required: false
    }
  }
};
const apiTokenPermission = {
  collectionName: "strapi_api_token_permissions",
  info: {
    name: "API Token Permission",
    description: "",
    singularName: "api-token-permission",
    pluralName: "api-token-permissions",
    displayName: "API Token Permission"
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    action: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true
    },
    token: {
      configurable: false,
      type: "relation",
      relation: "manyToOne",
      inversedBy: "permissions",
      target: "admin::api-token"
    }
  }
};
const transferToken = {
  collectionName: "strapi_transfer_tokens",
  info: {
    name: "Transfer Token",
    singularName: "transfer-token",
    pluralName: "transfer-tokens",
    displayName: "Transfer Token",
    description: ""
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    name: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true,
      unique: true
    },
    description: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: false,
      default: ""
    },
    accessKey: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true
    },
    lastUsedAt: {
      type: "datetime",
      configurable: false,
      required: false
    },
    permissions: {
      type: "relation",
      target: "admin::transfer-token-permission",
      relation: "oneToMany",
      mappedBy: "token",
      configurable: false,
      required: false
    },
    expiresAt: {
      type: "datetime",
      configurable: false,
      required: false
    },
    lifespan: {
      type: "biginteger",
      configurable: false,
      required: false
    }
  }
};
const transferTokenPermission = {
  collectionName: "strapi_transfer_token_permissions",
  info: {
    name: "Transfer Token Permission",
    description: "",
    singularName: "transfer-token-permission",
    pluralName: "transfer-token-permissions",
    displayName: "Transfer Token Permission"
  },
  options: {},
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    action: {
      type: "string",
      minLength: 1,
      configurable: false,
      required: true
    },
    token: {
      configurable: false,
      type: "relation",
      relation: "manyToOne",
      inversedBy: "permissions",
      target: "admin::transfer-token"
    }
  }
};
const index$1 = {
  permission: { schema: Permission },
  user: { schema: User },
  role: { schema: Role },
  "api-token": { schema: apiToken },
  "api-token-permission": { schema: apiTokenPermission },
  "transfer-token": { schema: transferToken },
  "transfer-token-permission": { schema: transferTokenPermission }
};
const { RateLimitError } = utils__default.default.errors;
const rateLimit = (config, { strapi: strapi2 }) => async (ctx, next) => {
  let rateLimitConfig = strapi2.config.get("admin.rateLimit");
  if (!rateLimitConfig) {
    rateLimitConfig = {
      enabled: true
    };
  }
  if (!fp.has("enabled", rateLimitConfig)) {
    rateLimitConfig.enabled = true;
  }
  if (rateLimitConfig.enabled === true) {
    const rateLimit2 = require("koa2-ratelimit").RateLimit;
    const userEmail = fp.toLower(ctx.request.body.email) || "unknownEmail";
    const requestPath = fp.isString(ctx.request.path) ? fp.toLower(path__default.default.normalize(ctx.request.path)).replace(/\/$/, "") : "invalidPath";
    const loadConfig = {
      interval: { min: 5 },
      max: 5,
      prefixKey: `${userEmail}:${requestPath}:${ctx.request.ip}`,
      handler() {
        throw new RateLimitError();
      },
      ...rateLimitConfig,
      ...config
    };
    return rateLimit2.middleware(loadConfig)(ctx, next);
  }
  return next();
};
const dataTransfer = () => async (ctx, next) => {
  const transferUtils = getService("transfer").utils;
  const { hasValidTokenSalt: hasValidTokenSalt2, isDataTransferEnabled: isDataTransferEnabled2, isDisabledFromEnv: isDisabledFromEnv2 } = transferUtils;
  if (isDataTransferEnabled2()) {
    return next();
  }
  if (!hasValidTokenSalt2()) {
    return ctx.notImplemented(
      "The server configuration for data transfer is invalid. Please contact your server administrator.",
      // @ts-expect-error have to pass multiple arguments to surface the error details
      {
        code: "INVALID_TOKEN_SALT"
      }
    );
  }
  if (isDisabledFromEnv2()) {
    return ctx.notFound();
  }
  throw new Error("Unexpected error while trying to access a data transfer route");
};
const index = {
  rateLimit,
  "data-transfer": dataTransfer
};
exports.bootstrap = bootstrap;
exports.config = index$6;
exports.contentTypes = index$1;
exports.controllers = index$2;
exports.destroy = destroy;
exports.middlewares = index;
exports.policies = index$5;
exports.register = register$1;
exports.routes = routes;
exports.services = index$3;
//# sourceMappingURL=index.js.map
