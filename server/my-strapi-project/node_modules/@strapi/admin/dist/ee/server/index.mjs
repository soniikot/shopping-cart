import EE from "@strapi/strapi/dist/utils/ee";
import { resolve, basename, join, extname } from "path";
import fse from "fs-extra";
import koaStatic from "koa-static";
import "@strapi/types";
import { isNil, castArray, pipe, pickBy, get, keys, differenceWith, isEqual, getOr, has, clamp, difference, set, merge, map, uniq, isEmpty, toLower, isFunction, toString, toNumber, assign, reverse, take, prop, drop, pick, isString, defaultsDeep, forEach, filter, cond, stubTrue, flow, size, mean, max, sum, defaultTo, mapValues, curry, includes, isArray, omit, isUndefined, update, property } from "lodash/fp";
import { differenceInHours, parseISO, add } from "date-fns";
import { errors, mapAsync, pipeAsync, getAbsoluteAdminUrl, stringIncludes, reduceAsync, yup, validateYupSchema, env } from "@strapi/utils";
import semver from "semver";
import localProvider from "@strapi/provider-audit-logs-local";
import { scheduleJob } from "node-schedule";
import _ from "lodash";
import { Strategy } from "passport-local";
import passport$2 from "koa-passport";
import "koa-bodyparser";
import compose from "koa-compose";
const registerAdminPanelRoute = ({ strapi: strapi2 }) => {
  let buildDir = resolve(strapi2.dirs.dist.root, "build");
  if (!fse.pathExistsSync(buildDir)) {
    buildDir = resolve(__dirname, "../../build");
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
    ctx.body = fse.createReadStream(join(buildDir, "index.html"));
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
          setHeaders(res, path) {
            const ext = extname(path);
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
  const serve = koaStatic(filesDir, koaStaticOptions);
  return async (ctx, next) => {
    const prev = ctx.path;
    const newPath = basename(ctx.path);
    ctx.path = newPath;
    await serve(ctx, async () => {
      ctx.path = prev;
      await next();
      ctx.path = newPath;
    });
    ctx.path = prev;
  };
};
const getService$1 = (name2) => {
  return strapi.service(`admin::${name2}`);
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
  const token = parts[1];
  const { payload, isValid } = getService$1("token").decodeJwtToken(token);
  if (!isValid) {
    return { authenticated: false };
  }
  const user2 = await strapi.query("admin::user").findOne({ where: { id: payload.id }, populate: ["roles"] });
  if (!user2 || !(user2.isActive === true)) {
    return { authenticated: false };
  }
  const userAbility = await getService$1("permission").engine.generateUserAbility(user2);
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
const constants = {
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
const { UnauthorizedError: UnauthorizedError$1, ForbiddenError: ForbiddenError$1 } = errors;
const isReadScope = (scope) => scope.endsWith("find") || scope.endsWith("findOne");
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
const authenticate$1 = async (ctx) => {
  const apiTokenService = getService$1("api-token");
  const token = extractToken(ctx);
  if (!token) {
    return { authenticated: false };
  }
  const apiToken = await apiTokenService.getBy({
    accessKey: apiTokenService.hash(token)
  });
  if (!apiToken) {
    return { authenticated: false };
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!isNil(apiToken.expiresAt)) {
    const expirationDate = new Date(apiToken.expiresAt);
    if (expirationDate < currentDate) {
      return { authenticated: false, error: new UnauthorizedError$1("Token expired") };
    }
  }
  const hoursSinceLastUsed = differenceInHours(currentDate, parseISO(apiToken.lastUsedAt));
  if (hoursSinceLastUsed >= 1) {
    await strapi.query("admin::api-token").update({
      where: { id: apiToken.id },
      data: { lastUsedAt: currentDate }
    });
  }
  if (apiToken.type === constants.API_TOKEN_TYPE.CUSTOM) {
    const ability = await strapi.contentAPI.permissions.engine.generateAbility(
      apiToken.permissions.map((action) => ({ action }))
    );
    return { authenticated: true, ability, credentials: apiToken };
  }
  return { authenticated: true, credentials: apiToken };
};
const verify = (auth2, config) => {
  const { credentials: apiToken, ability } = auth2;
  if (!apiToken) {
    throw new UnauthorizedError$1("Token not found");
  }
  const currentDate = /* @__PURE__ */ new Date();
  if (!isNil(apiToken.expiresAt)) {
    const expirationDate = new Date(apiToken.expiresAt);
    if (expirationDate < currentDate) {
      throw new UnauthorizedError$1("Token expired");
    }
  }
  if (apiToken.type === constants.API_TOKEN_TYPE.FULL_ACCESS) {
    return;
  }
  if (apiToken.type === constants.API_TOKEN_TYPE.READ_ONLY) {
    const scopes = castArray(config.scope);
    if (config.scope && scopes.every(isReadScope)) {
      return;
    }
  } else if (apiToken.type === constants.API_TOKEN_TYPE.CUSTOM) {
    if (!ability) {
      throw new ForbiddenError$1();
    }
    const scopes = castArray(config.scope);
    const isAllowed = scopes.every((scope) => ability.can(scope));
    if (isAllowed) {
      return;
    }
  }
  throw new ForbiddenError$1();
};
const apiTokenAuthStrategy = {
  name: "api-token",
  authenticate: authenticate$1,
  verify
};
const executeCERegister = ({ strapi: strapi2 }) => {
  const passportMiddleware = strapi2.admin?.services.passport.init();
  strapi2.server.api("admin").use(passportMiddleware);
  strapi2.container.get("auth").register("admin", adminAuthStrategy);
  strapi2.container.get("auth").register("content-api", apiTokenAuthStrategy);
  if (strapi2.config.serveAdminPanel) {
    registerAdminPanelRoute({ strapi: strapi2 });
  }
};
async function migrateAuditLogsTable({ oldContentTypes, contentTypes }) {
  const oldName = oldContentTypes?.["admin::audit-log"]?.collectionName;
  const newName = contentTypes["admin::audit-log"]?.collectionName;
  const hasRenamedAuditLogsTable = oldName === "audit_logs" && newName === "strapi_audit_logs";
  if (!hasRenamedAuditLogsTable) {
    return;
  }
  const hasAuditLogsTable = await strapi.db.getSchemaConnection().hasTable("audit_logs");
  const hasLinkTable = await strapi.db.getSchemaConnection().hasTable("audit_logs_user_links");
  if (!hasAuditLogsTable || !hasLinkTable) {
    return;
  }
  const auditLogsColumnInfo = await strapi.db.connection("audit_logs").columnInfo();
  const linkColumnInfo = await strapi.db.connection("audit_logs_user_links").columnInfo();
  if (!auditLogsColumnInfo.action || !auditLogsColumnInfo.date || !auditLogsColumnInfo.payload || !linkColumnInfo.audit_log_id || !linkColumnInfo.user_id) {
    return;
  }
  await strapi.db.getSchemaConnection().renameTable("audit_logs", "strapi_audit_logs");
  await strapi.db.getSchemaConnection().renameTable("audit_logs_user_links", "strapi_audit_logs_user_links");
}
const WORKFLOW_MODEL_UID = "admin::workflow";
const STAGE_MODEL_UID = "admin::workflow-stage";
const STAGE_TRANSITION_UID = "admin::review-workflows.stage.transition";
const STAGE_DEFAULT_COLOR = "#4945FF";
const ENTITY_STAGE_ATTRIBUTE = "strapi_stage";
const ENTITY_ASSIGNEE_ATTRIBUTE = "strapi_assignee";
const MAX_WORKFLOWS = 200;
const MAX_STAGES_PER_WORKFLOW = 200;
const ERRORS = {
  WORKFLOW_WITHOUT_STAGES: "A workflow must have at least one stage.",
  WORKFLOWS_LIMIT: "You’ve reached the limit of workflows in your plan. Delete a workflow or contact Sales to enable more workflows.",
  STAGES_LIMIT: "You’ve reached the limit of stages for this workflow in your plan. Try deleting some stages or contact Sales to enable more stages.",
  DUPLICATED_STAGE_NAME: "Stage names must be unique."
};
const WORKFLOW_POPULATE = {
  stages: {
    populate: {
      permissions: {
        fields: ["action", "actionParameters"],
        populate: {
          role: { fields: ["id", "name"] }
        }
      }
    }
  }
};
async function migrateReviewWorkflowStagesColor({ oldContentTypes, contentTypes }) {
  const hadColor = !!oldContentTypes?.["admin::workflow-stage"]?.attributes?.color;
  const hasColor = !!contentTypes?.["admin::workflow-stage"]?.attributes?.color;
  if (!hadColor && hasColor) {
    await strapi.query("admin::workflow-stage").updateMany({
      data: {
        color: STAGE_DEFAULT_COLOR
      }
    });
  }
}
const getService = (name2, { strapi: strapi2 } = { strapi: global.strapi }) => {
  return strapi2.service(`admin::${name2}`);
};
async function migrateReviewWorkflowStagesRoles({ oldContentTypes, contentTypes }) {
  const stageUID = "admin::workflow-stage";
  const hadRolePermissions = !!oldContentTypes?.[stageUID]?.attributes?.permissions;
  const hasRolePermissions = !!contentTypes?.[stageUID]?.attributes?.permissions;
  if (!hadRolePermissions && hasRolePermissions) {
    const roleUID = "admin::role";
    strapi.log.info(
      `Migrating all existing review workflow stages to have RBAC permissions for all ${roleUID}.`
    );
    const stagePermissionsService = getService("stage-permissions");
    const stages2 = await strapi.query(stageUID).findMany();
    const roles2 = await strapi.query(roleUID).findMany();
    const groupedPermissions = {};
    roles2.map((role2) => role2.id).forEach((roleId) => {
      stages2.map((stage) => stage.id).forEach((stageId) => {
        if (!groupedPermissions[stageId]) {
          groupedPermissions[stageId] = [];
        }
        groupedPermissions[stageId].push({
          roleId,
          fromStage: stageId,
          action: STAGE_TRANSITION_UID
        });
      });
    });
    for (const [stageId, permissions] of Object.entries(groupedPermissions)) {
      const numericalStageId = Number(stageId);
      if (Number.isNaN(numericalStageId)) {
        strapi.log.warn(
          `Unable to apply ${roleUID} migration for ${stageUID} with id ${stageId}. The stage does not have a numerical id.`
        );
        continue;
      }
      const stagePermissions2 = await stagePermissionsService.registerMany(permissions);
      await strapi.entityService.update(STAGE_MODEL_UID, numericalStageId, {
        data: {
          permissions: stagePermissions2.flat().map((permission2) => permission2.id)
        }
      });
    }
  }
}
const name = "Default";
const defaultWorkflow = {
  name
};
async function migrateReviewWorkflowName({ oldContentTypes, contentTypes }) {
  const hadName = !!oldContentTypes?.[WORKFLOW_MODEL_UID]?.attributes?.name;
  const hasName = !!contentTypes?.[WORKFLOW_MODEL_UID]?.attributes?.name;
  if (!hadName && hasName) {
    await strapi.query(WORKFLOW_MODEL_UID).updateMany({
      where: {
        name: { $null: true }
      },
      data: {
        name: defaultWorkflow.name
      }
    });
  }
}
async function migrateWorkflowsContentTypes({ oldContentTypes, contentTypes }) {
  const hadContentTypes = !!oldContentTypes?.[WORKFLOW_MODEL_UID]?.attributes?.contentTypes;
  const hasContentTypes = !!contentTypes?.[WORKFLOW_MODEL_UID]?.attributes?.contentTypes;
  if (!hadContentTypes && hasContentTypes) {
    await strapi.query(WORKFLOW_MODEL_UID).updateMany({ data: { contentTypes: [] } });
    const contentTypes2 = pipe([pickBy(get("options.reviewWorkflows")), keys])(oldContentTypes);
    if (contentTypes2.length) {
      await strapi.query(WORKFLOW_MODEL_UID).update({ where: { id: { $notNull: true } }, data: { contentTypes: contentTypes2 } });
    }
  }
}
const transformTableName = (table) => {
  if (typeof table === "string") {
    return { name: table };
  }
  return table;
};
async function findTables({ strapi: strapi2 }, regex) {
  const tables = await strapi2.db.dialect.schemaInspector.getTables();
  return tables.filter((tableName) => regex.test(tableName));
}
async function addPersistTables({ strapi: strapi2 }, tableNames) {
  const persistedTables = await getPersistedTables({ strapi: strapi2 });
  const tables = tableNames.map(transformTableName);
  const notPersistedTableNames = differenceWith(isEqual, tables, persistedTables);
  const tablesToPersist = differenceWith(
    (t1, t2) => t1.name === t2.name,
    persistedTables,
    notPersistedTableNames
  );
  if (!notPersistedTableNames.length) {
    return;
  }
  tablesToPersist.push(...notPersistedTableNames);
  await strapi2.store.set({
    type: "core",
    key: "persisted_tables",
    value: tablesToPersist
  });
}
async function getPersistedTables({ strapi: strapi2 }) {
  const persistedTables = await strapi2.store.get({
    type: "core",
    key: "persisted_tables"
  });
  return (persistedTables || []).map(transformTableName);
}
async function setPersistedTables({ strapi: strapi2 }, tableNames) {
  await strapi2.store.set({
    type: "core",
    key: "persisted_tables",
    value: tableNames
  });
}
const persistTablesWithPrefix = async (tableNamePrefix) => {
  const tableNameRegex = new RegExp(`^${tableNamePrefix}.*`);
  const tableNames = await findTables({ strapi }, tableNameRegex);
  await addPersistTables({ strapi }, tableNames);
};
const removePersistedTablesWithSuffix = async (tableNameSuffix) => {
  const tableNameRegex = new RegExp(`.*${tableNameSuffix}$`);
  const persistedTables = await getPersistedTables({ strapi });
  const filteredPersistedTables = persistedTables.filter((table) => {
    return !tableNameRegex.test(table.name);
  });
  if (filteredPersistedTables.length === persistedTables.length) {
    return;
  }
  await setPersistedTables({ strapi }, filteredPersistedTables);
};
const persistTables = async (tables) => {
  await addPersistTables({ strapi }, tables);
};
function checkVersionThreshold(startVersion, currentVersion, thresholdVersion) {
  return semver.gte(currentVersion, thresholdVersion) && semver.lt(startVersion, thresholdVersion);
}
async function migrateStageAttribute({ oldContentTypes, contentTypes }) {
  const getRWVersion = getOr("0.0.0", `${STAGE_MODEL_UID}.options.version`);
  const oldRWVersion = getRWVersion(oldContentTypes);
  const currentRWVersion = getRWVersion(contentTypes);
  const migrationNeeded = checkVersionThreshold(oldRWVersion, currentRWVersion, "1.1.0");
  if (migrationNeeded) {
    const oldAttributeTableName = "strapi_review_workflows_stage";
    const newAttributeTableName = "strapi_stage";
    const tables = await findTables({ strapi }, new RegExp(oldAttributeTableName));
    await mapAsync(tables, async (tableName) => {
      const newTableName = tableName.replace(oldAttributeTableName, newAttributeTableName);
      const alreadyHasNextTable = await strapi.db.connection.schema.hasTable(newTableName);
      if (alreadyHasNextTable) {
        const dataInTable = await strapi.db.connection(newTableName).select().limit(1);
        if (!dataInTable.length) {
          await strapi.db.connection.schema.dropTable(newTableName);
        }
      }
      try {
        await strapi.db.connection.schema.renameTable(tableName, newTableName);
      } catch (e) {
        strapi.log.warn(
          `An error occurred during the migration of ${tableName} table to ${newTableName}.
If ${newTableName} already exists, migration can't be done automatically.`
        );
        strapi.log.warn(e.message);
      }
    });
  }
}
const getVisibleContentTypesUID = pipe([
  // Pick only content-types visible in the content-manager and option is not false
  pickBy(
    (value) => getOr(true, "pluginOptions.content-manager.visible", value) && !getOr(false, "options.noStageAttribute", value)
  ),
  // Get UIDs
  keys
]);
const hasStageAttribute = has(["attributes", ENTITY_STAGE_ATTRIBUTE]);
const getWorkflowContentTypeFilter = ({ strapi: strapi2 }, contentType) => {
  if (strapi2.db.dialect.supportsOperator("$jsonSupersetOf")) {
    return { $jsonSupersetOf: JSON.stringify([contentType]) };
  }
  return { $contains: `"${contentType}"` };
};
const clampMaxWorkflows = clamp(1, MAX_WORKFLOWS);
const clampMaxStagesPerWorkflow = clamp(1, MAX_STAGES_PER_WORKFLOW);
async function migrateDeletedCTInWorkflows({ oldContentTypes, contentTypes }) {
  const deletedContentTypes = difference(keys(oldContentTypes), keys(contentTypes)) ?? [];
  if (deletedContentTypes.length) {
    await mapAsync(deletedContentTypes, async (deletedContentTypeUID) => {
      const workflow2 = await strapi.query(WORKFLOW_MODEL_UID).findOne({
        select: ["id", "contentTypes"],
        where: {
          contentTypes: getWorkflowContentTypeFilter({ strapi }, deletedContentTypeUID)
        }
      });
      if (workflow2) {
        await strapi.query(WORKFLOW_MODEL_UID).update({
          where: { id: workflow2.id },
          data: {
            contentTypes: workflow2.contentTypes.filter(
              (contentTypeUID) => contentTypeUID !== deletedContentTypeUID
            )
          }
        });
      }
    });
  }
}
const DEFAULT_RETENTION_DAYS = 90;
const defaultEvents = [
  "entry.create",
  "entry.update",
  "entry.delete",
  "entry.publish",
  "entry.unpublish",
  "media.create",
  "media.update",
  "media.delete",
  "media-folder.create",
  "media-folder.update",
  "media-folder.delete",
  "user.create",
  "user.update",
  "user.delete",
  "admin.auth.success",
  "admin.logout",
  "content-type.create",
  "content-type.update",
  "content-type.delete",
  "component.create",
  "component.update",
  "component.delete",
  "role.create",
  "role.update",
  "role.delete",
  "permission.create",
  "permission.update",
  "permission.delete"
];
const getSanitizedUser = (user2) => {
  let displayName = user2.email;
  if (user2.username) {
    displayName = user2.username;
  } else if (user2.firstname && user2.lastname) {
    displayName = `${user2.firstname} ${user2.lastname}`;
  }
  return {
    id: user2.id,
    email: user2.email,
    displayName
  };
};
const getEventMap = (defaultEvents2) => {
  const getDefaultPayload = (...args) => args[0];
  return defaultEvents2.reduce((acc, event) => {
    acc[event] = getDefaultPayload;
    return acc;
  }, {});
};
const getRetentionDays = (strapi2) => {
  const licenseRetentionDays = EE.features.get("audit-logs")?.options.retentionDays;
  const userRetentionDays = strapi2.config.get("admin.auditLogs.retentionDays");
  if (licenseRetentionDays == null) {
    return userRetentionDays ?? DEFAULT_RETENTION_DAYS;
  }
  if (userRetentionDays && userRetentionDays < licenseRetentionDays) {
    return userRetentionDays;
  }
  return licenseRetentionDays;
};
const createAuditLogsService = (strapi2) => {
  const state = {};
  const eventMap = getEventMap(defaultEvents);
  const processEvent = (name2, ...args) => {
    const requestState = strapi2.requestContext.get()?.state;
    const isUsingAdminAuth = requestState?.auth?.strategy.name === "admin";
    const user2 = requestState?.user;
    if (!isUsingAdminAuth || !user2) {
      return null;
    }
    const getPayload = eventMap[name2];
    if (!getPayload) {
      return null;
    }
    const ignoredUids = ["plugin::upload.file", "plugin::upload.folder"];
    if (ignoredUids.includes(args[0]?.uid)) {
      return null;
    }
    return {
      action: name2,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      payload: getPayload(...args) || {},
      userId: user2.id
    };
  };
  async function handleEvent(name2, ...args) {
    const processedEvent = processEvent(name2, ...args);
    if (processedEvent) {
      await strapi2.db.transaction(({ onCommit }) => {
        onCommit(() => state.provider.saveEvent(processedEvent));
      });
    }
  }
  return {
    async register() {
      if (!state.eeEnableUnsubscribe) {
        state.eeEnableUnsubscribe = strapi2.eventHub.on("ee.enable", () => {
          this.destroy();
          this.register();
        });
      }
      if (!state.eeUpdateUnsubscribe) {
        state.eeUpdateUnsubscribe = strapi2.eventHub.on("ee.update", () => {
          this.destroy();
          this.register();
        });
      }
      state.eeDisableUnsubscribe = strapi2.eventHub.on("ee.disable", () => {
        this.destroy();
      });
      state.provider = await localProvider.register({ strapi: strapi2 });
      if (!EE.features.isEnabled("audit-logs")) {
        return this;
      }
      state.eventHubUnsubscribe = strapi2.eventHub.subscribe(handleEvent.bind(this));
      const retentionDays = getRetentionDays(strapi2);
      state.deleteExpiredJob = scheduleJob("0 0 * * *", () => {
        const expirationDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1e3);
        state.provider.deleteExpiredEvents(expirationDate);
      });
      return this;
    },
    async findMany(query) {
      const { results, pagination } = await state.provider.findMany(query);
      const sanitizedResults = results.map((result) => {
        const { user: user2, ...rest } = result;
        return {
          ...rest,
          user: user2 ? getSanitizedUser(user2) : null
        };
      });
      return {
        results: sanitizedResults,
        pagination
      };
    },
    async findOne(id) {
      const result = await state.provider.findOne(id);
      if (!result) {
        return null;
      }
      const { user: user2, ...rest } = result;
      return {
        ...rest,
        user: user2 ? getSanitizedUser(user2) : null
      };
    },
    unsubscribe() {
      if (state.eeDisableUnsubscribe) {
        state.eeDisableUnsubscribe();
      }
      if (state.eventHubUnsubscribe) {
        state.eventHubUnsubscribe();
      }
      if (state.deleteExpiredJob) {
        state.deleteExpiredJob.cancel();
      }
      return this;
    },
    destroy() {
      return this.unsubscribe();
    }
  };
};
function contentTypeMiddleware(strapi2) {
  const moveReviewWorkflowOption = (ctx) => {
    const { reviewWorkflows: reviewWorkflows2, ...contentType } = ctx.request.body.contentType;
    if (typeof reviewWorkflows2 === "boolean") {
      ctx.request.body.contentType = set("options.reviewWorkflows", reviewWorkflows2, contentType);
    }
  };
  strapi2.server.router.use("/content-type-builder/content-types/:uid?", (ctx, next) => {
    if (ctx.method === "PUT" || ctx.method === "POST") {
      moveReviewWorkflowOption(ctx);
    }
    return next();
  });
}
const reviewWorkflowsMiddlewares = {
  contentTypeMiddleware
};
const register = async ({ strapi: strapi2 }) => {
  const auditLogsIsEnabled = strapi2.config.get("admin.auditLogs.enabled", true);
  if (auditLogsIsEnabled) {
    strapi2.hook("strapi::content-types.beforeSync").register(migrateAuditLogsTable);
    const auditLogsService = createAuditLogsService(strapi2);
    strapi2.container.register("audit-logs", auditLogsService);
    await auditLogsService.register();
  }
  if (EE.features.isEnabled("review-workflows")) {
    strapi2.hook("strapi::content-types.beforeSync").register(migrateStageAttribute);
    strapi2.hook("strapi::content-types.afterSync").register(migrateReviewWorkflowStagesColor).register(migrateReviewWorkflowStagesRoles).register(migrateReviewWorkflowName).register(migrateWorkflowsContentTypes).register(migrateDeletedCTInWorkflows);
    const reviewWorkflowService = getService("review-workflows");
    reviewWorkflowsMiddlewares.contentTypeMiddleware(strapi2);
    await reviewWorkflowService.register(EE.features.get("review-workflows"));
  }
  await executeCERegister({ strapi: strapi2 });
};
const workflow = {
  schema: {
    collectionName: "strapi_workflows",
    info: {
      name: "Workflow",
      description: "",
      singularName: "workflow",
      pluralName: "workflows",
      displayName: "Workflow"
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
        required: true,
        unique: true
      },
      stages: {
        type: "relation",
        target: "admin::workflow-stage",
        relation: "oneToMany",
        mappedBy: "workflow"
      },
      contentTypes: {
        type: "json",
        required: true,
        default: []
      }
    }
  }
};
const workflowStage = {
  schema: {
    collectionName: "strapi_workflows_stages",
    info: {
      name: "Workflow Stage",
      description: "",
      singularName: "workflow-stage",
      pluralName: "workflow-stages",
      displayName: "Stages"
    },
    options: {
      version: "1.1.0"
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
      name: {
        type: "string",
        configurable: false
      },
      color: {
        type: "string",
        configurable: false,
        default: STAGE_DEFAULT_COLOR
      },
      workflow: {
        type: "relation",
        target: "admin::workflow",
        relation: "manyToOne",
        inversedBy: "stages",
        configurable: false
      },
      permissions: {
        type: "relation",
        target: "admin::permission",
        relation: "manyToMany",
        configurable: false
      }
    }
  }
};
const index$3 = {
  workflow,
  "workflow-stage": workflowStage
};
const actions$1 = [
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
  actions: actions$1
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
  await getService$1("permission").actionProvider.registerMany(adminActions.actions);
};
const registerAdminConditions = async () => {
  await getService$1("permission").conditionProvider.registerMany(adminConditions.conditions);
};
const registerModelHooks = () => {
  const { sendDidChangeInterfaceLanguage } = getService$1("metrics");
  strapi.db.lifecycles.subscribe({
    models: ["admin::user"],
    afterCreate: sendDidChangeInterfaceLanguage,
    afterDelete: sendDidChangeInterfaceLanguage,
    afterUpdate({ params }) {
      if (params.data.preferedLanguage) {
        sendDidChangeInterfaceLanguage();
      }
    }
  });
};
const syncAuthSettings = async () => {
  const adminStore = await strapi.store({ type: "core", name: "admin" });
  const adminAuthSettings = await adminStore.get({ key: "auth" });
  const newAuthSettings = merge(defaultAdminAuthSettings, adminAuthSettings);
  const roleExists = await getService$1("role").exists({
    id: newAuthSettings.providers.defaultRole
  });
  if (!roleExists) {
    newAuthSettings.providers.defaultRole = null;
  }
  await adminStore.set({ key: "auth", value: newAuthSettings });
};
const syncAPITokensPermissions = async () => {
  const validPermissions = strapi.contentAPI.permissions.providers.action.keys();
  const permissionsInDB = await pipeAsync(
    strapi.query("admin::api-token-permission").findMany,
    // @ts-expect-error lodash types
    map("action")
  )();
  const unknownPermissions = uniq(difference(permissionsInDB, validPermissions));
  if (unknownPermissions.length > 0) {
    await strapi.query("admin::api-token-permission").deleteMany({ where: { action: { $in: unknownPermissions } } });
  }
};
const executeCEBootstrap = async ({ strapi: strapi2 }) => {
  await registerAdminConditions();
  await registerPermissionActions();
  registerModelHooks();
  const permissionService = getService$1("permission");
  const userService = getService$1("user");
  const roleService = getService$1("role");
  const apiTokenService = getService$1("api-token");
  const transferService = getService$1("transfer");
  const tokenService = getService$1("token");
  await roleService.createRolesIfNoneExist();
  await roleService.resetSuperAdminPermissions();
  await roleService.displayWarningIfNoSuperAdmin();
  await permissionService.cleanPermissionsInDatabase();
  await userService.displayWarningIfUsersDontHaveRole();
  await syncAuthSettings();
  await syncAPITokensPermissions();
  await getService$1("metrics").sendUpdateProjectInformation();
  getService$1("metrics").startCron(strapi2);
  apiTokenService.checkSaltIsDefined();
  transferService.token.checkSaltIsDefined();
  tokenService.checkSecretIsDefined();
};
const actions = {
  sso: [
    {
      uid: "provider-login.read",
      displayName: "Read",
      pluginName: "admin",
      section: "settings",
      category: "single sign on",
      subCategory: "options"
    },
    {
      uid: "provider-login.update",
      displayName: "Update",
      pluginName: "admin",
      section: "settings",
      category: "single sign on",
      subCategory: "options"
    }
  ],
  auditLogs: [
    {
      uid: "audit-logs.read",
      displayName: "Read",
      pluginName: "admin",
      section: "settings",
      category: "audit logs",
      subCategory: "options"
    }
  ],
  reviewWorkflows: [
    {
      uid: "review-workflows.create",
      displayName: "Create",
      pluginName: "admin",
      section: "settings",
      category: "review workflows",
      subCategory: "options"
    },
    {
      uid: "review-workflows.read",
      displayName: "Read",
      pluginName: "admin",
      section: "settings",
      category: "review workflows",
      subCategory: "options"
    },
    {
      uid: "review-workflows.update",
      displayName: "Update",
      pluginName: "admin",
      section: "settings",
      category: "review workflows",
      subCategory: "options"
    },
    {
      uid: "review-workflows.delete",
      displayName: "Delete",
      pluginName: "admin",
      section: "settings",
      category: "review workflows",
      subCategory: "options"
    },
    {
      uid: "review-workflows.stage.transition",
      displayName: "Change stage",
      pluginName: "admin",
      section: "internal"
    }
  ]
};
const bootstrap = async (args) => {
  const { actionProvider } = getService("permission");
  if (EE.features.isEnabled("sso")) {
    await actionProvider.registerMany(actions.sso);
  }
  if (EE.features.isEnabled("audit-logs")) {
    await persistTablesWithPrefix("strapi_audit_logs");
    await actionProvider.registerMany(actions.auditLogs);
  }
  if (EE.features.isEnabled("review-workflows")) {
    await persistTablesWithPrefix("strapi_workflows");
    const { bootstrap: rwBootstrap } = getService("review-workflows");
    await rwBootstrap();
    await actionProvider.registerMany(actions.reviewWorkflows);
    const { decorator: decorator2 } = getService("review-workflows-decorator");
    strapi.entityService.decorate(decorator2);
    await getService("review-workflows-weekly-metrics").registerCron();
  }
  await getService("seat-enforcement").seatEnforcementWorkflow();
  await executeCEBootstrap(args);
};
const executeCEDestroy = async () => {
  const { conditionProvider, actionProvider } = getService$1("permission");
  await conditionProvider.clear();
  await actionProvider.clear();
};
const destroy = async ({ strapi: strapi2 }) => {
  if (EE.features.isEnabled("audit-logs")) {
    strapi2.container.get("audit-logs").destroy();
  }
  await executeCEDestroy();
};
const enableFeatureMiddleware = (featureName) => (ctx, next) => {
  if (EE.features.isEnabled(featureName)) {
    return next();
  }
  ctx.status = 404;
};
const sso$1 = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/providers",
      handler: "authentication.getProviders",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        auth: false
      }
    },
    {
      method: "GET",
      path: "/connect/:provider",
      handler: "authentication.providerLogin",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        auth: false
      }
    },
    {
      method: "POST",
      path: "/connect/:provider",
      handler: "authentication.providerLogin",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        auth: false
      }
    },
    {
      method: "GET",
      path: "/providers/options",
      handler: "authentication.getProviderLoginOptions",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        policies: [
          "admin::isAuthenticatedAdmin",
          { name: "admin::hasPermissions", config: { actions: ["admin::provider-login.read"] } }
        ]
      }
    },
    {
      method: "PUT",
      path: "/providers/options",
      handler: "authentication.updateProviderLoginOptions",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        policies: [
          "admin::isAuthenticatedAdmin",
          { name: "admin::hasPermissions", config: { actions: ["admin::provider-login.update"] } }
        ]
      }
    },
    {
      method: "GET",
      path: "/providers/isSSOLocked",
      handler: "user.isSSOLocked",
      config: {
        middlewares: [enableFeatureMiddleware("sso")],
        policies: ["admin::isAuthenticatedAdmin"]
      }
    }
  ]
};
const licenseLimit = {
  type: "admin",
  routes: [
    // License limit infos
    {
      method: "GET",
      path: "/license-limit-information",
      handler: "admin.licenseLimitInformation",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: [
                "admin::users.create",
                "admin::users.read",
                "admin::users.update",
                "admin::users.delete"
              ]
            }
          }
        ]
      }
    }
  ]
};
const auditLogs$1 = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/audit-logs",
      handler: "auditLogs.findMany",
      config: {
        middlewares: [enableFeatureMiddleware("audit-logs")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::audit-logs.read"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/audit-logs/:id",
      handler: "auditLogs.findOne",
      config: {
        middlewares: [enableFeatureMiddleware("audit-logs")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::audit-logs.read"]
            }
          }
        ]
      }
    }
  ]
};
const reviewWorkflows$1 = {
  type: "admin",
  routes: [
    // Review workflow
    {
      method: "POST",
      path: "/review-workflows/workflows",
      handler: "workflows.create",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.create"]
            }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/review-workflows/workflows/:id",
      handler: "workflows.update",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.update"]
            }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/review-workflows/workflows/:id",
      handler: "workflows.delete",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.delete"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/review-workflows/workflows",
      handler: "workflows.find",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.read"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/review-workflows/workflows/:id",
      handler: "workflows.findById",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.read"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/review-workflows/workflows/:workflow_id/stages",
      handler: "stages.find",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.read"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/review-workflows/workflows/:workflow_id/stages/:id",
      handler: "stages.findById",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::review-workflows.read"]
            }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/content-manager/(collection|single)-types/:model_uid/:id/stage",
      handler: "stages.updateEntity",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "GET",
      path: "/content-manager/(collection|single)-types/:model_uid/:id/stages",
      handler: "stages.listAvailableStages",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "PUT",
      path: "/content-manager/(collection|single)-types/:model_uid/:id/assignee",
      handler: "assignees.updateEntity",
      config: {
        middlewares: [enableFeatureMiddleware("review-workflows")],
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["admin::users.read", "admin::review-workflows.read"]
            }
          }
        ]
      }
    }
  ]
};
const index$2 = {
  sso: sso$1,
  "license-limit": licenseLimit,
  "audit-logs": auditLogs$1,
  "review-workflows": reviewWorkflows$1
};
const isSsoLocked = async (user2) => {
  if (!EE.features.isEnabled("sso")) {
    return false;
  }
  if (!user2) {
    throw new Error("Missing user object");
  }
  const adminStore = await strapi.store({ type: "core", name: "admin" });
  const { providers } = await adminStore.get({ key: "auth" });
  const lockedRoles = providers.ssoLockedRoles ?? [];
  if (isEmpty(lockedRoles)) {
    return false;
  }
  const roles2 = (
    // If the roles are pre-loaded for the given user, then use them
    user2.roles ?? // Otherwise, try to load the role based on the given user ID
    await strapi.query("admin::user").load(user2, "roles", { roles: { fields: ["id"] } }) ?? // If the query fails somehow, default to an empty array
    []
  );
  const isLocked = lockedRoles.some(
    (lockedId) => (
      // lockedRoles will be a string to avoid issues with frontend and bigints
      roles2.some((role2) => lockedId === role2.id.toString())
    )
  );
  return isLocked;
};
const { ApplicationError: ApplicationError$6 } = errors;
const forgotPassword = async ({ email: email2 } = {}) => {
  const user2 = await strapi.query("admin::user").findOne({ where: { email: email2, isActive: true } });
  if (!user2 || await isSsoLocked(user2)) {
    return;
  }
  const resetPasswordToken = getService("token").createToken();
  await getService("user").updateById(user2.id, { resetPasswordToken });
  const url = `${getAbsoluteAdminUrl(
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
      user: _.pick(user2, ["email", "firstname", "lastname", "username"])
    }
  ).catch((err) => {
    strapi.log.error(err);
  });
};
const resetPassword = async ({ resetPasswordToken, password: password2 } = {}) => {
  const matchingUser = await strapi.query("admin::user").findOne({ where: { resetPasswordToken, isActive: true } });
  if (!matchingUser || await isSsoLocked(matchingUser)) {
    throw new ApplicationError$6();
  }
  return getService("user").updateById(matchingUser.id, {
    password: password2,
    resetPasswordToken: null
  });
};
const auth = {
  forgotPassword,
  resetPassword
};
const createLocalStrategy = (strapi2, middleware) => {
  return new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false
    },
    (email2, password2, done) => {
      return getService$1("auth").checkCredentials({ email: toLower(email2), password: password2 }).then(async ([error, user2, message]) => {
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
const valueIsFunctionType = ([, value]) => isFunction(value);
const keyIsValidEventName = ([key]) => {
  return Object.keys(strapi.admin.services.passport.authEventsMapper).includes(key);
};
const getPassportStrategies$1 = () => [createLocalStrategy(strapi)];
const registerAuthEvents = () => {
  const { events = {} } = strapi.config.get("admin.auth", {});
  const { authEventsMapper: authEventsMapper2 } = strapi.admin.services.passport;
  const eventList = Object.entries(events).filter(keyIsValidEventName).filter(valueIsFunctionType);
  for (const [eventName, handler] of eventList) {
    strapi.eventHub.on(authEventsMapper2[eventName], handler);
  }
};
const init = () => {
  strapi.admin.services.passport.getPassportStrategies().forEach((strategy) => passport$2.use(strategy));
  registerAuthEvents();
  return passport$2.initialize();
};
const passport$1 = { init, getPassportStrategies: getPassportStrategies$1, authEventsMapper };
const createProviderRegistry = () => {
  const registry = /* @__PURE__ */ new Map();
  Object.assign(registry, {
    register(provider) {
      if (strapi.isLoaded) {
        throw new Error(`You can't register new provider after the bootstrap`);
      }
      this.set(provider.uid, provider);
    },
    registerMany(providers) {
      providers.forEach((provider) => {
        this.register(provider);
      });
    },
    getAll() {
      return Array.from(this.values());
    }
  });
  return registry;
};
const providerRegistry = createProviderRegistry();
const errorMessage = "SSO is disabled. Its functionnalities cannot be accessed.";
const getStrategyCallbackURL = (providerName) => {
  if (!EE.features.isEnabled("sso")) {
    throw new Error(errorMessage);
  }
  return `/admin/connect/${providerName}`;
};
const syncProviderRegistryWithConfig = () => {
  if (!EE.features.isEnabled("sso")) {
    throw new Error(errorMessage);
  }
  const { providers = [] } = strapi.config.get("admin.auth", {});
  providerRegistry.registerMany(providers);
};
const SSOAuthEventsMapper = {
  onSSOAutoRegistration: "admin.auth.autoRegistration"
};
const sso = {
  providerRegistry,
  getStrategyCallbackURL,
  syncProviderRegistryWithConfig,
  authEventsMapper: { ...passport$1.authEventsMapper, ...SSOAuthEventsMapper }
};
const { UnauthorizedError } = errors;
const localStrategyMiddleware = async ([error, user2, message], done) => {
  if (user2 && !error && await isSsoLocked(user2)) {
    return done(
      new UnauthorizedError("Login not allowed, please contact your administrator", {
        code: "LOGIN_NOT_ALLOWED"
      }),
      user2,
      message
    );
  }
  return done(error, user2, message);
};
const getPassportStrategies = () => {
  if (!EE.features.isEnabled("sso")) {
    return [createLocalStrategy(strapi)];
  }
  const localStrategy = createLocalStrategy(strapi, localStrategyMiddleware);
  if (!strapi.isLoaded) {
    sso.syncProviderRegistryWithConfig();
  }
  const providers = sso.providerRegistry.getAll();
  const strategies = providers.map((provider) => provider.createStrategy(strapi));
  return [localStrategy, ...strategies];
};
const passport = {
  getPassportStrategies,
  ...sso
};
const { ApplicationError: ApplicationError$5 } = errors;
const ssoCheckRolesIdForDeletion = async (ids) => {
  const adminStore = await strapi.store({ type: "core", name: "admin" });
  const {
    providers: { defaultRole }
  } = await adminStore.get({ key: "auth" });
  for (const roleId of ids) {
    if (defaultRole && toString(defaultRole) === toString(roleId)) {
      throw new ApplicationError$5(
        "This role is used as the default SSO role. Make sure to change this configuration before deleting the role"
      );
    }
  }
};
const role$1 = {
  ssoCheckRolesIdForDeletion
};
const { SUPER_ADMIN_CODE: SUPER_ADMIN_CODE$2 } = constants;
const hasSuperAdminRole = (user2) => {
  return user2.roles.filter((role2) => role2.code === SUPER_ADMIN_CODE$2).length > 0;
};
const { ValidationError: ValidationError$3 } = errors;
const { SUPER_ADMIN_CODE: SUPER_ADMIN_CODE$1 } = constants;
const updateEEDisabledUsersList = async (id, input) => {
  const disabledUsers = await getService("seat-enforcement").getDisabledUserList();
  if (!disabledUsers) {
    return;
  }
  const user2 = disabledUsers.find((user22) => user22.id === Number(id));
  if (!user2) {
    return;
  }
  if (user2.isActive !== input.isActive) {
    const newDisabledUsersList = disabledUsers.filter((user22) => user22.id !== Number(id));
    await strapi.store.set({
      type: "ee",
      key: "disabled_users",
      value: newDisabledUsersList
    });
  }
};
const castNumberArray = pipe(castArray, map(toNumber));
const removeFromEEDisabledUsersList = async (ids) => {
  let idsToCheck;
  if (typeof ids === "object") {
    idsToCheck = castNumberArray(ids);
  } else {
    idsToCheck = [Number(ids)];
  }
  const disabledUsers = await getService("seat-enforcement").getDisabledUserList();
  if (!disabledUsers) {
    return;
  }
  const newDisabledUsersList = disabledUsers.filter((user2) => !idsToCheck.includes(user2.id));
  await strapi.store.set({
    type: "ee",
    key: "disabled_users",
    value: newDisabledUsersList
  });
};
const updateById = async (id, attributes) => {
  if (_.has(attributes, "roles")) {
    const lastAdminUser = await isLastSuperAdminUser(id);
    const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
    const willRemoveSuperAdminRole = !stringIncludes(attributes.roles, superAdminRole.id);
    if (lastAdminUser && willRemoveSuperAdminRole) {
      throw new ValidationError$3("You must have at least one user with super admin role.");
    }
  }
  if (attributes.isActive === false) {
    const lastAdminUser = await isLastSuperAdminUser(id);
    if (lastAdminUser) {
      throw new ValidationError$3("You must have at least one user with super admin role.");
    }
  }
  if (_.has(attributes, "password")) {
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
  await updateEEDisabledUsersList(id, attributes);
  if (updatedUser) {
    strapi.eventHub.emit("user.update", { user: sanitizeUser(updatedUser) });
  }
  return updatedUser;
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
    if (userToDelete.roles.some((r) => r.code === SUPER_ADMIN_CODE$1)) {
      const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
      if (superAdminRole.usersCount === 1) {
        throw new ValidationError$3("You must have at least one user with super admin role.");
      }
    }
  }
  const deletedUser = await strapi.query("admin::user").delete({ where: { id }, populate: ["roles"] });
  await removeFromEEDisabledUsersList(id);
  strapi.eventHub.emit("user.delete", { user: sanitizeUser(deletedUser) });
  return deletedUser;
};
const deleteByIds = async (ids) => {
  const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
  const nbOfSuperAdminToDelete = await strapi.query("admin::user").count({
    where: {
      id: ids,
      roles: { id: superAdminRole.id }
    }
  });
  if (superAdminRole.usersCount === nbOfSuperAdminToDelete) {
    throw new ValidationError$3("You must have at least one user with super admin role.");
  }
  const deletedUsers = [];
  for (const id of ids) {
    const deletedUser = await strapi.query("admin::user").delete({
      where: { id },
      populate: ["roles"]
    });
    deletedUsers.push(deletedUser);
  }
  await removeFromEEDisabledUsersList(ids);
  strapi.eventHub.emit("user.delete", {
    users: deletedUsers.map((deletedUser) => sanitizeUser(deletedUser))
  });
  return deletedUsers;
};
const sanitizeUserRoles = (role2) => _.pick(role2, ["id", "name", "description", "code"]);
const isLastSuperAdminUser = async (userId) => {
  const user2 = await findOne(userId);
  const superAdminRole = await getService("role").getSuperAdminWithUsersCount();
  return superAdminRole.usersCount === 1 && hasSuperAdminRole(user2);
};
const sanitizeUser = (user2) => {
  return {
    ..._.omit(user2, ["password", "resetPasswordToken", "registrationToken", "roles"]),
    roles: user2.roles && user2.roles.map(sanitizeUserRoles)
  };
};
const findOne = async (id, populate = ["roles"]) => {
  return strapi.entityService.findOne("admin::user", id, { populate });
};
const getCurrentActiveUserCount = async () => {
  return strapi.db.query("admin::user").count({ where: { isActive: true } });
};
const user$1 = {
  updateEEDisabledUsersList,
  removeFromEEDisabledUsersList,
  getCurrentActiveUserCount,
  deleteByIds,
  deleteById,
  updateById
};
const getSSOProvidersList = async () => {
  const { providerRegistry: providerRegistry2 } = strapi.admin.services.passport;
  return providerRegistry2.getAll().map(({ uid }) => uid);
};
const sendUpdateProjectInformation = async () => {
  let groupProperties = {};
  const numberOfActiveAdminUsers = await getService("user").count({ isActive: true });
  const numberOfAdminUsers = await getService("user").count();
  if (EE.features.isEnabled("sso")) {
    const SSOProviders = await getSSOProvidersList();
    groupProperties = assign(groupProperties, {
      SSOProviders,
      isSSOConfigured: SSOProviders.length !== 0
    });
  }
  if (EE.features.isEnabled("cms-content-releases")) {
    const numberOfContentReleases = await strapi.db.query("plugin::content-releases.release").count();
    const numberOfPublishedContentReleases = await strapi.db.query("plugin::content-releases.release").count({
      filters: { releasedAt: { $notNull: true } }
    });
    groupProperties = assign(groupProperties, {
      numberOfContentReleases,
      numberOfPublishedContentReleases
    });
  }
  groupProperties = assign(groupProperties, { numberOfActiveAdminUsers, numberOfAdminUsers });
  strapi.telemetry.send("didUpdateProjectInformation", {
    groupProperties
  });
};
const startCron = (strapi2) => {
  strapi2.cron.add({
    "0 0 0 * * *": () => sendUpdateProjectInformation()
  });
};
const metrics = { startCron, getSSOProvidersList, sendUpdateProjectInformation };
const { SUPER_ADMIN_CODE } = constants;
const getDisabledUserList = async () => {
  return strapi.store.get({ type: "ee", key: "disabled_users" });
};
const enableMaximumUserCount = async (numberOfUsersToEnable) => {
  const disabledUsers = await getDisabledUserList();
  const orderedDisabledUsers = reverse(disabledUsers);
  const usersToEnable = take(numberOfUsersToEnable, orderedDisabledUsers);
  await strapi.db.query("admin::user").updateMany({
    where: { id: map(prop("id"), usersToEnable) },
    data: { isActive: true }
  });
  const remainingDisabledUsers = drop(numberOfUsersToEnable, orderedDisabledUsers);
  await strapi.store.set({
    type: "ee",
    key: "disabled_users",
    value: remainingDisabledUsers
  });
};
const disableUsersAboveLicenseLimit = async (numberOfUsersToDisable) => {
  const currentlyDisabledUsers = await getDisabledUserList() ?? [];
  const usersToDisable = [];
  const nonSuperAdminUsersToDisable = await strapi.db.query("admin::user").findMany({
    where: {
      isActive: true,
      roles: {
        code: { $ne: SUPER_ADMIN_CODE }
      }
    },
    orderBy: { createdAt: "DESC" },
    limit: numberOfUsersToDisable
  });
  usersToDisable.push(...nonSuperAdminUsersToDisable);
  if (nonSuperAdminUsersToDisable.length < numberOfUsersToDisable) {
    const superAdminUsersToDisable = await strapi.db.query("admin::user").findMany({
      where: {
        isActive: true,
        roles: { code: SUPER_ADMIN_CODE }
      },
      orderBy: { createdAt: "DESC" },
      limit: numberOfUsersToDisable - nonSuperAdminUsersToDisable.length
    });
    usersToDisable.push(...superAdminUsersToDisable);
  }
  await strapi.db.query("admin::user").updateMany({
    where: { id: map(prop("id"), usersToDisable) },
    data: { isActive: false }
  });
  await strapi.store.set({
    type: "ee",
    key: "disabled_users",
    value: currentlyDisabledUsers.concat(map(pick(["id", "isActive"]), usersToDisable))
  });
};
const syncDisabledUserRecords = async () => {
  const disabledUsers = await strapi.store.get({ type: "ee", key: "disabled_users" });
  if (!disabledUsers) {
    return;
  }
  await strapi.db.query("admin::user").updateMany({
    where: { id: map(prop("id"), disabledUsers) },
    data: { isActive: false }
  });
};
const seatEnforcementWorkflow = async () => {
  const adminSeats = EE.seats;
  if (isNil(adminSeats)) {
    return;
  }
  await syncDisabledUserRecords();
  const currentActiveUserCount = await getService("user").getCurrentActiveUserCount();
  const adminSeatsLeft = adminSeats - currentActiveUserCount;
  if (adminSeatsLeft > 0) {
    await enableMaximumUserCount(adminSeatsLeft);
  } else if (adminSeatsLeft < 0) {
    await disableUsersAboveLicenseLimit(-adminSeatsLeft);
  }
};
const seatEnforcement = {
  seatEnforcementWorkflow,
  getDisabledUserList
};
const workflowsContentTypesFactory = ({ strapi: strapi2 }) => {
  const contentManagerContentTypeService = strapi2.plugin("content-manager").service("content-types");
  const stagesService = getService("stages", { strapi: strapi2 });
  const updateContentTypeConfig = async (uid, reviewWorkflowOption) => {
    const modelConfig = await contentManagerContentTypeService.findConfiguration(uid);
    await contentManagerContentTypeService.updateConfiguration(
      { uid },
      { options: merge(modelConfig.options, { reviewWorkflows: reviewWorkflowOption }) }
    );
  };
  return {
    /**
     * Migrates entities stages. Used when a content type is assigned to a workflow.
     * @param {*} options
     * @param {Array<string>} options.srcContentTypes - The content types assigned to the previous workflow
     * @param {Array<string>} options.destContentTypes - The content types assigned to the new workflow
     * @param {Workflow.Stage} options.stageId - The new stage to assign the entities to
     */
    async migrate({ srcContentTypes = [], destContentTypes, stageId }) {
      const workflowsService = getService("workflows", { strapi: strapi2 });
      const { created, deleted } = diffContentTypes(srcContentTypes, destContentTypes);
      await mapAsync(
        created,
        async (uid) => {
          const srcWorkflows = await workflowsService._getAssignedWorkflows(uid, {});
          if (srcWorkflows.length) {
            await stagesService.updateEntitiesStage(uid, { toStageId: stageId });
            await mapAsync(
              srcWorkflows,
              (srcWorkflow) => this.transferContentTypes(srcWorkflow, uid)
            );
          }
          await updateContentTypeConfig(uid, true);
          return stagesService.updateEntitiesStage(uid, {
            fromStageId: null,
            toStageId: stageId
          });
        },
        // transferContentTypes can cause race conditions if called in parallel when updating the same workflow
        { concurrency: 1 }
      );
      await mapAsync(deleted, async (uid) => {
        await updateContentTypeConfig(uid, false);
        await stagesService.deleteAllEntitiesStage(uid, {});
      });
    },
    /**
     * Filters the content types assigned to a workflow
     * @param {Workflow} srcWorkflow - The workflow to transfer from
     * @param {string} uid - The content type uid
     */
    async transferContentTypes(srcWorkflow, uid) {
      await strapi2.entityService.update(WORKFLOW_MODEL_UID, srcWorkflow.id, {
        data: {
          contentTypes: srcWorkflow.contentTypes.filter((contentType) => contentType !== uid)
        }
      });
    }
  };
};
const diffContentTypes = (srcContentTypes, destContentTypes) => {
  const created = difference(destContentTypes, srcContentTypes);
  const deleted = difference(srcContentTypes, destContentTypes);
  return { created, deleted };
};
const { ApplicationError: ApplicationError$4 } = errors;
const processFilters = ({ strapi: strapi2 }, filters = {}) => {
  const processedFilters = { ...filters };
  if (isString(filters.contentTypes)) {
    processedFilters.contentTypes = getWorkflowContentTypeFilter({ strapi: strapi2 }, filters.contentTypes);
  }
  return processedFilters;
};
const processPopulate = (populate) => {
  if (!populate) {
    return populate;
  }
  return WORKFLOW_POPULATE;
};
const workflows$1 = ({ strapi: strapi2 }) => {
  const workflowsContentTypes = workflowsContentTypesFactory({ strapi: strapi2 });
  const workflowsValidationService = getService("review-workflows-validation", { strapi: strapi2 });
  const metrics2 = getService("review-workflows-metrics", { strapi: strapi2 });
  return {
    /**
     * Returns all the workflows matching the user-defined filters.
     * @param {object} opts - Options for the query.
     * @param {object} opts.filters - Filters object.
     * @returns {Promise<object[]>} - List of workflows that match the user's filters.
     */
    async find(opts = {}) {
      const filters = processFilters({ strapi: strapi2 }, opts.filters);
      const populate = processPopulate(opts.populate);
      return strapi2.entityService.findMany(WORKFLOW_MODEL_UID, { ...opts, filters, populate });
    },
    /**
     * Returns the workflow with the specified ID.
     * @param {string} id - ID of the requested workflow.
     * @param {object} opts - Options for the query.
     * @returns {Promise<object>} - Workflow object matching the requested ID.
     */
    findById(id, opts) {
      const populate = processPopulate(opts.populate);
      return strapi2.entityService.findOne(WORKFLOW_MODEL_UID, id, { ...opts, populate });
    },
    /**
     * Creates a new workflow.
     * @param {object} opts - Options for creating the new workflow.
     * @returns {Promise<object>} - Workflow object that was just created.
     * @throws {ValidationError} - If the workflow has no stages.
     */
    async create(opts) {
      let createOpts = { ...opts, populate: WORKFLOW_POPULATE };
      workflowsValidationService.validateWorkflowStages(opts.data.stages);
      await workflowsValidationService.validateWorkflowCount(1);
      return strapi2.db.transaction(async () => {
        const stages2 = await getService("stages", { strapi: strapi2 }).createMany(opts.data.stages);
        const mapIds = map(get("id"));
        createOpts = set("data.stages", mapIds(stages2), createOpts);
        if (opts.data.contentTypes) {
          await workflowsContentTypes.migrate({
            destContentTypes: opts.data.contentTypes,
            stageId: stages2[0].id
          });
        }
        metrics2.sendDidCreateWorkflow();
        return strapi2.entityService.create(WORKFLOW_MODEL_UID, createOpts);
      });
    },
    /**
     * Updates an existing workflow.
     * @param {object} workflow - The existing workflow to update.
     * @param {object} opts - Options for updating the workflow.
     * @returns {Promise<object>} - Workflow object that was just updated.
     * @throws {ApplicationError} - If the supplied stage ID does not belong to the workflow.
     */
    async update(workflow2, opts) {
      const stageService = getService("stages", { strapi: strapi2 });
      let updateOpts = { ...opts, populate: { ...WORKFLOW_POPULATE } };
      let updatedStageIds;
      await workflowsValidationService.validateWorkflowCount();
      return strapi2.db.transaction(async () => {
        if (opts.data.stages) {
          workflowsValidationService.validateWorkflowStages(opts.data.stages);
          opts.data.stages.forEach(
            (stage) => this.assertStageBelongsToWorkflow(stage.id, workflow2)
          );
          updatedStageIds = await stageService.replaceStages(workflow2.stages, opts.data.stages, workflow2.contentTypes).then((stages2) => stages2.map((stage) => stage.id));
          updateOpts = set("data.stages", updatedStageIds, updateOpts);
        }
        if (opts.data.contentTypes) {
          await workflowsContentTypes.migrate({
            srcContentTypes: workflow2.contentTypes,
            destContentTypes: opts.data.contentTypes,
            stageId: updatedStageIds ? updatedStageIds[0] : workflow2.stages[0].id
          });
        }
        metrics2.sendDidEditWorkflow();
        return strapi2.entityService.update(WORKFLOW_MODEL_UID, workflow2.id, updateOpts);
      });
    },
    /**
     * Deletes an existing workflow.
     * Also deletes all the workflow stages and migrate all assigned the content types.
     * @param {*} workflow
     * @param {*} opts
     * @returns
     */
    async delete(workflow2, opts) {
      const stageService = getService("stages", { strapi: strapi2 });
      const workflowCount = await this.count();
      if (workflowCount <= 1) {
        throw new ApplicationError$4("Can not delete the last workflow");
      }
      return strapi2.db.transaction(async () => {
        await stageService.deleteMany(workflow2.stages);
        await workflowsContentTypes.migrate({
          srcContentTypes: workflow2.contentTypes,
          destContentTypes: []
        });
        return strapi2.entityService.delete(WORKFLOW_MODEL_UID, workflow2.id, opts);
      });
    },
    /**
     * Returns the total count of workflows.
     * @returns {Promise<number>} - Total count of workflows.
     */
    count() {
      return strapi2.entityService.count(WORKFLOW_MODEL_UID);
    },
    /**
     * Finds the assigned workflow for a given content type ID.
     * @param {string} uid - Content type ID to find the assigned workflow for.
     * @param {object} opts - Options for the query.
     * @returns {Promise<object|null>} - Assigned workflow object if found, or null.
     */
    async getAssignedWorkflow(uid, opts = {}) {
      const workflows2 = await this._getAssignedWorkflows(uid, opts);
      return workflows2.length > 0 ? workflows2[0] : null;
    },
    /**
     * Finds all the assigned workflows for a given content type ID.
     * Normally, there should only be one workflow assigned to a content type.
     * However, edge cases can occur where a content type is assigned to multiple workflows.
     * @param {string} uid - Content type ID to find the assigned workflows for.
     * @param {object} opts - Options for the query.
     * @returns {Promise<object[]>} - List of assigned workflow objects.
     */
    async _getAssignedWorkflows(uid, opts = {}) {
      return this.find({
        ...opts,
        filters: { contentTypes: getWorkflowContentTypeFilter({ strapi: strapi2 }, uid) }
      });
    },
    /**
     * Asserts that a content type has an assigned workflow.
     * @param {string} uid - Content type ID to verify the assignment of.
     * @returns {Promise<object>} - Workflow object associated with the content type ID.
     * @throws {ApplicationError} - If no assigned workflow is found for the content type ID.
     */
    async assertContentTypeBelongsToWorkflow(uid) {
      const workflow2 = await this.getAssignedWorkflow(uid, {
        populate: "stages"
      });
      if (!workflow2) {
        throw new ApplicationError$4(`Review workflows is not activated on Content Type ${uid}.`);
      }
      return workflow2;
    },
    /**
     * Asserts that a stage belongs to a given workflow.
     * @param {string} stageId - ID of stage to check.
     * @param {object} workflow - Workflow object to check against.
     * @returns
     * @throws {ApplicationError} - If the stage does not belong to the specified workflow.
     */
    assertStageBelongsToWorkflow(stageId, workflow2) {
      if (!stageId) {
        return;
      }
      const belongs = workflow2.stages.some((stage) => stage.id === stageId);
      if (!belongs) {
        throw new ApplicationError$4(`Stage does not belong to workflow "${workflow2.name}"`);
      }
    }
  };
};
const { ApplicationError: ApplicationError$3, ValidationError: ValidationError$2 } = errors;
const sanitizedStageFields = ["id", "name", "workflow", "color"];
const sanitizeStageFields = pick(sanitizedStageFields);
const stages$1 = ({ strapi: strapi2 }) => {
  const metrics2 = getService("review-workflows-metrics", { strapi: strapi2 });
  const stagePermissionsService = getService("stage-permissions", { strapi: strapi2 });
  const workflowsValidationService = getService("review-workflows-validation", { strapi: strapi2 });
  return {
    find({ workflowId, populate }) {
      const params = {
        filters: { workflow: workflowId },
        populate
      };
      return strapi2.entityService.findMany(STAGE_MODEL_UID, params);
    },
    findById(id, { populate } = {}) {
      const params = {
        populate
      };
      return strapi2.entityService.findOne(STAGE_MODEL_UID, id, params);
    },
    async createMany(stagesList, { fields } = {}) {
      const params = { select: fields ?? "*" };
      const stages2 = await Promise.all(
        stagesList.map(
          (stage) => strapi2.entityService.create(STAGE_MODEL_UID, {
            data: sanitizeStageFields(stage),
            ...params
          })
        )
      );
      await reduceAsync(stagesList)(async (_2, stage, idx) => {
        if (!stage.permissions || stage.permissions.length === 0) {
          return;
        }
        const stagePermissions2 = stage.permissions;
        const stageId = stages2[idx].id;
        const permissions = await mapAsync(
          stagePermissions2,
          // Register each stage permission
          (permission2) => stagePermissionsService.register({
            roleId: permission2.role,
            action: permission2.action,
            fromStage: stageId
          })
        );
        await strapi2.entityService.update(STAGE_MODEL_UID, stageId, {
          data: {
            permissions: permissions.flat().map((p) => p.id)
          }
        });
      }, []);
      metrics2.sendDidCreateStage();
      return stages2;
    },
    async update(srcStage, destStage) {
      let stagePermissions2 = srcStage?.permissions ?? [];
      const stageId = destStage.id;
      if (destStage.permissions) {
        await this.deleteStagePermissions([srcStage]);
        const permissions = await mapAsync(
          destStage.permissions,
          (permission2) => stagePermissionsService.register({
            roleId: permission2.role,
            action: permission2.action,
            fromStage: stageId
          })
        );
        stagePermissions2 = permissions.flat().map((p) => p.id);
      }
      const stage = await strapi2.entityService.update(STAGE_MODEL_UID, stageId, {
        data: {
          ...destStage,
          permissions: stagePermissions2
        }
      });
      metrics2.sendDidEditStage();
      return stage;
    },
    async delete(stage) {
      await this.deleteStagePermissions([stage]);
      const deletedStage = await strapi2.entityService.delete(STAGE_MODEL_UID, stage.id);
      metrics2.sendDidDeleteStage();
      return deletedStage;
    },
    async deleteMany(stages2) {
      await this.deleteStagePermissions(stages2);
      return strapi2.entityService.deleteMany(STAGE_MODEL_UID, {
        filters: { id: { $in: stages2.map((s) => s.id) } }
      });
    },
    async deleteStagePermissions(stages2) {
      const permissions = stages2.map((s) => s.permissions || []).flat();
      await stagePermissionsService.unregister(permissions || []);
    },
    count({ workflowId } = {}) {
      const opts = {};
      if (workflowId) {
        opts.where = {
          workflow: workflowId
        };
      }
      return strapi2.entityService.count(STAGE_MODEL_UID, opts);
    },
    async replaceStages(srcStages, destStages, contentTypesToMigrate = []) {
      const { created, updated, deleted } = getDiffBetweenStages(srcStages, destStages);
      assertAtLeastOneStageRemain(srcStages || [], { created, deleted });
      return strapi2.db.transaction(async ({ trx }) => {
        const createdStages = await this.createMany(created, { fields: ["id"] });
        const createdStagesIds = map("id", createdStages);
        await mapAsync(updated, (destStage) => {
          const srcStage = srcStages.find((s) => s.id === destStage.id);
          return this.update(srcStage, destStage);
        });
        await mapAsync(deleted, async (stage) => {
          const nearestStage = findNearestMatchingStage(
            [...srcStages, ...createdStages],
            srcStages.findIndex((s) => s.id === stage.id),
            (targetStage) => {
              return !deleted.find((s) => s.id === targetStage.id);
            }
          );
          await mapAsync(contentTypesToMigrate, (contentTypeUID) => {
            this.updateEntitiesStage(contentTypeUID, {
              fromStageId: stage.id,
              toStageId: nearestStage.id,
              trx
            });
          });
          return this.delete(stage);
        });
        return destStages.map((stage) => ({
          ...stage,
          id: stage.id ?? createdStagesIds.shift()
        }));
      });
    },
    /**
     * Update the stage of an entity
     *
     * @param {object} entityInfo
     * @param {number} entityInfo.id - Entity id
     * @param {string} entityInfo.modelUID - the content-type of the entity
     * @param {number} stageId - The id of the stage to assign to the entity
     */
    async updateEntity(entityInfo, stageId) {
      const stage = await this.findById(stageId);
      await workflowsValidationService.validateWorkflowCount();
      if (!stage) {
        throw new ApplicationError$3(`Selected stage does not exist`);
      }
      const entity = await strapi2.entityService.update(entityInfo.modelUID, entityInfo.id, {
        // @ts-expect-error - entity service can not receive any type of attribute
        data: { [ENTITY_STAGE_ATTRIBUTE]: stageId },
        populate: [ENTITY_STAGE_ATTRIBUTE]
      });
      metrics2.sendDidChangeEntryStage();
      return entity;
    },
    /**
     * Updates entity stages of a content type:
     *  - If fromStageId is undefined, all entities with an existing stage will be assigned the new stage
     *  - If fromStageId is null, all entities without a stage will be assigned the new stage
     *  - If fromStageId is a number, all entities with that stage will be assigned the new stage
     *
     * For performance reasons we use knex queries directly.
     *
     * @param {string} contentTypeUID
     * @param {number | undefined | null} fromStageId
     * @param {number} toStageId
     * @param {import('knex').Knex.Transaction} trx
     * @returns
     */
    async updateEntitiesStage(contentTypeUID, { fromStageId, toStageId }) {
      const { attributes, tableName } = strapi2.db.metadata.get(contentTypeUID);
      const joinTable = attributes[ENTITY_STAGE_ATTRIBUTE].joinTable;
      const joinColumn = joinTable.joinColumn.name;
      const invJoinColumn = joinTable.inverseJoinColumn.name;
      await workflowsValidationService.validateWorkflowCount();
      return strapi2.db.transaction(async ({ trx }) => {
        if (fromStageId === void 0) {
          return strapi2.db.getConnection().from(joinTable.name).update({ [invJoinColumn]: toStageId }).transacting(trx);
        }
        const selectStatement = strapi2.db.getConnection().select({ [joinColumn]: "t1.id", [invJoinColumn]: toStageId }).from(`${tableName} as t1`).leftJoin(`${joinTable.name} as t2`, `t1.id`, `t2.${joinColumn}`).where(`t2.${invJoinColumn}`, fromStageId).toSQL();
        return strapi2.db.getConnection(joinTable.name).insert(
          strapi2.db.connection.raw(
            `(${joinColumn}, ${invJoinColumn})  ${selectStatement.sql}`,
            selectStatement.bindings
          )
        ).transacting(trx);
      });
    },
    /**
     * Deletes all entity stages of a content type
     * @param {string} contentTypeUID
     * @returns
     */
    async deleteAllEntitiesStage(contentTypeUID) {
      const { attributes } = strapi2.db.metadata.get(contentTypeUID);
      const joinTable = attributes[ENTITY_STAGE_ATTRIBUTE].joinTable;
      return strapi2.db.transaction(
        async ({ trx }) => strapi2.db.getConnection().from(joinTable.name).delete().transacting(trx)
      );
    }
  };
};
function getDiffBetweenStages(sourceStages, comparisonStages) {
  const result = comparisonStages.reduce(
    // ...
    (acc, stageToCompare) => {
      const srcStage = sourceStages.find((stage) => stage.id === stageToCompare.id);
      if (!srcStage) {
        acc.created.push(stageToCompare);
      } else if (!isEqual(
        pick(["name", "color", "permissions"], srcStage),
        pick(["name", "color", "permissions"], stageToCompare)
      )) {
        acc.updated.push(stageToCompare);
      }
      return acc;
    },
    { created: [], updated: [] }
  );
  result.deleted = sourceStages.filter(
    (srcStage) => !comparisonStages.some((cmpStage) => cmpStage.id === srcStage.id)
  );
  return result;
}
function assertAtLeastOneStageRemain(workflowStages, diffStages) {
  const remainingStagesCount = workflowStages.length - diffStages.deleted.length + diffStages.created.length;
  if (remainingStagesCount < 1) {
    throw new ValidationError$2(ERRORS.WORKFLOW_WITHOUT_STAGES);
  }
}
function findNearestMatchingStage(stages2, startIndex, condition) {
  for (let i = startIndex; i >= 0; i -= 1) {
    if (condition(stages2[i])) {
      return stages2[i];
    }
  }
  const remainingArray = stages2.slice(startIndex + 1);
  const nearestObject = remainingArray.filter(condition)[0];
  return nearestObject;
}
const { ApplicationError: ApplicationError$2 } = errors;
const validActions = [STAGE_TRANSITION_UID];
const stagePermissions = ({ strapi: strapi2 }) => {
  const roleService = getService("role");
  const permissionService = getService("permission");
  return {
    async register({ roleId, action, fromStage }) {
      if (!validActions.includes(action)) {
        throw new ApplicationError$2(`Invalid action ${action}`);
      }
      const permissions = await roleService.addPermissions(roleId, [
        {
          action,
          actionParameters: {
            from: fromStage
          }
        }
      ]);
      return permissions;
    },
    async registerMany(permissions) {
      return mapAsync(permissions, this.register);
    },
    async unregister(permissions) {
      const permissionIds = permissions.map(prop("id"));
      await permissionService.deleteByIds(permissionIds);
    },
    can(action, fromStage) {
      const requestState = strapi2.requestContext.get()?.state;
      if (!requestState) {
        return false;
      }
      const userRoles = requestState.user?.roles;
      if (userRoles?.some((role2) => role2.code === "strapi-super-admin")) {
        return true;
      }
      return requestState.userAbility.can({
        name: action,
        params: { from: fromStage }
      });
    }
  };
};
const { ApplicationError: ApplicationError$1 } = errors;
const assignees$1 = ({ strapi: strapi2 }) => {
  const metrics2 = getService("review-workflows-metrics", { strapi: strapi2 });
  return {
    async findEntityAssigneeId(id, model) {
      const entity = await strapi2.entityService.findOne(model, id, {
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: []
      });
      return entity?.[ENTITY_ASSIGNEE_ATTRIBUTE]?.id ?? null;
    },
    /**
     * Update the assignee of an entity
     */
    async updateEntityAssignee(id, model, assigneeId) {
      if (isNil(assigneeId)) {
        return this.deleteEntityAssignee(id, model);
      }
      const userExists = await getService("user", { strapi: strapi2 }).exists({ id: assigneeId });
      if (!userExists) {
        throw new ApplicationError$1(`Selected user does not exist`);
      }
      metrics2.sendDidEditAssignee(await this.findEntityAssigneeId(id, model), assigneeId);
      return strapi2.entityService.update(model, id, {
        // @ts-expect-error check entity service types
        data: { [ENTITY_ASSIGNEE_ATTRIBUTE]: assigneeId },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: []
      });
    },
    async deleteEntityAssignee(id, model) {
      metrics2.sendDidEditAssignee(await this.findEntityAssigneeId(id, model), null);
      return strapi2.entityService.update(model, id, {
        // @ts-expect-error check entity service types
        data: { [ENTITY_ASSIGNEE_ATTRIBUTE]: null },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: []
      });
    }
  };
};
const defaultStages = [
  {
    name: "To do",
    color: "#4945FF"
  },
  {
    name: "Ready to review",
    color: "#9736E8"
  },
  {
    name: "In progress",
    color: "#EE5E52"
  },
  {
    name: "Reviewed",
    color: "#328048"
  }
];
const WORKFLOW_UPDATE_STAGE = "review-workflows.updateEntryStage";
const webhookEvents = {
  WORKFLOW_UPDATE_STAGE
};
const MAX_DB_TABLE_NAME_LEN = 63;
const MAX_JOIN_TABLE_NAME_SUFFIX = 1 + ENTITY_STAGE_ATTRIBUTE.length + "_links_inv_fk".length;
const MAX_CONTENT_TYPE_NAME_LEN = MAX_DB_TABLE_NAME_LEN - MAX_JOIN_TABLE_NAME_SUFFIX;
const DEFAULT_OPTIONS = {
  numberOfWorkflows: MAX_WORKFLOWS,
  stagesPerWorkflow: MAX_STAGES_PER_WORKFLOW
};
async function initDefaultWorkflow({ workflowsService, stagesService }) {
  const wfCount = await workflowsService.count();
  const stagesCount = await stagesService.count();
  if (wfCount === 0 && stagesCount === 0) {
    const workflow2 = {
      ...defaultWorkflow,
      stages: defaultStages
    };
    await workflowsService.create({ data: workflow2 });
  }
}
function extendReviewWorkflowContentTypes({ strapi: strapi2 }) {
  const extendContentType = (contentTypeUID) => {
    const assertContentTypeCompatibility = (contentType) => contentType.collectionName.length <= MAX_CONTENT_TYPE_NAME_LEN;
    const incompatibleContentTypeAlert = (contentType) => {
      strapi2.log.warn(
        `Review Workflow cannot be activated for the content type with the name '${contentType.info.displayName}' because the name exceeds the maximum length of ${MAX_CONTENT_TYPE_NAME_LEN} characters.`
      );
      return contentType;
    };
    const setRelation = (path, target) => set(path, {
      writable: true,
      private: false,
      configurable: false,
      visible: false,
      useJoinTable: true,
      // We want a join table to persist data when downgrading to CE
      type: "relation",
      relation: "oneToOne",
      target
    });
    const setReviewWorkflowAttributes = pipe([
      setRelation(`attributes.${ENTITY_STAGE_ATTRIBUTE}`, STAGE_MODEL_UID),
      setRelation(`attributes.${ENTITY_ASSIGNEE_ATTRIBUTE}`, "admin::user")
    ]);
    const extendContentTypeIfCompatible = cond([
      [assertContentTypeCompatibility, setReviewWorkflowAttributes],
      [stubTrue, incompatibleContentTypeAlert]
    ]);
    strapi2.container.get("content-types").extend(contentTypeUID, extendContentTypeIfCompatible);
  };
  pipe([
    getVisibleContentTypesUID,
    // Iterate over UIDs to extend the content-type
    forEach(extendContentType)
  ])(strapi2.contentTypes);
}
function persistStagesJoinTables({ strapi: strapi2 }) {
  return async ({ contentTypes }) => {
    const getStageTableToPersist = (contentTypeUID) => {
      const { attributes, tableName } = strapi2.db.metadata.get(contentTypeUID);
      const joinTableName = attributes[ENTITY_STAGE_ATTRIBUTE].joinTable.name;
      return { name: joinTableName, dependsOn: [{ name: tableName }] };
    };
    const joinTablesToPersist = pipe([
      getVisibleContentTypesUID,
      filter((uid) => hasStageAttribute(contentTypes[uid])),
      map(getStageTableToPersist)
    ])(contentTypes);
    await removePersistedTablesWithSuffix("_strapi_stage_links");
    await persistTables(joinTablesToPersist);
  };
}
const registerWebhookEvents = async ({ strapi: strapi2 }) => Object.entries(webhookEvents).forEach(
  ([eventKey, event]) => strapi2.webhookStore.addAllowedEvent(eventKey, event)
);
const reviewWorkflows = ({ strapi: strapi2 }) => {
  const workflowsService = getService("workflows", { strapi: strapi2 });
  const stagesService = getService("stages", { strapi: strapi2 });
  const workflowsValidationService = getService("review-workflows-validation", { strapi: strapi2 });
  return {
    async bootstrap() {
      await registerWebhookEvents({ strapi: strapi2 });
      await initDefaultWorkflow({ workflowsService, stagesService, strapi: strapi2 });
    },
    async register({ options } = { options: {} }) {
      extendReviewWorkflowContentTypes({ strapi: strapi2 });
      strapi2.hook("strapi::content-types.afterSync").register(persistStagesJoinTables({ strapi: strapi2 }));
      const reviewWorkflowsOptions = defaultsDeep(DEFAULT_OPTIONS, options);
      workflowsValidationService.register(reviewWorkflowsOptions);
    }
  };
};
const { ValidationError: ValidationError$1 } = errors;
const reviewWorkflowsValidation = ({ strapi: strapi2 }) => {
  return {
    limits: {
      numberOfWorkflows: MAX_WORKFLOWS,
      stagesPerWorkflow: MAX_STAGES_PER_WORKFLOW
    },
    register({ numberOfWorkflows, stagesPerWorkflow }) {
      if (!Object.isFrozen(this.limits)) {
        this.limits.numberOfWorkflows = clampMaxWorkflows(
          numberOfWorkflows || this.limits.numberOfWorkflows
        );
        this.limits.stagesPerWorkflow = clampMaxStagesPerWorkflow(
          stagesPerWorkflow || this.limits.stagesPerWorkflow
        );
        Object.freeze(this.limits);
      }
    },
    /**
     * Validates the stages of a workflow.
     * @param {Array} stages - Array of stages to be validated.
     * @throws {ValidationError} - If the workflow has no stages or exceeds the limit.
     */
    validateWorkflowStages(stages2) {
      if (!stages2 || stages2.length === 0) {
        throw new ValidationError$1(ERRORS.WORKFLOW_WITHOUT_STAGES);
      }
      if (stages2.length > this.limits.stagesPerWorkflow) {
        throw new ValidationError$1(ERRORS.STAGES_LIMIT);
      }
      const stageNames = stages2.map((stage) => stage.name);
      if (uniq(stageNames).length !== stageNames.length) {
        throw new ValidationError$1(ERRORS.DUPLICATED_STAGE_NAME);
      }
    },
    async validateWorkflowCountStages(workflowId, countAddedStages = 0) {
      const stagesService = getService("stages", { strapi: strapi2 });
      const countWorkflowStages = await stagesService.count({ workflowId });
      if (countWorkflowStages + countAddedStages > this.limits.stagesPerWorkflow) {
        throw new ValidationError$1(ERRORS.STAGES_LIMIT);
      }
    },
    /**
     * Validates the count of existing and added workflows.
     * @param {number} [countAddedWorkflows=0] - The count of workflows to be added.
     * @throws {ValidationError} - If the total count of workflows exceeds the limit.
     * @returns {Promise<void>} - A Promise that resolves when the validation is completed.
     */
    async validateWorkflowCount(countAddedWorkflows = 0) {
      const workflowsService = getService("workflows", { strapi: strapi2 });
      const countWorkflows = await workflowsService.count();
      if (countWorkflows + countAddedWorkflows > this.limits.numberOfWorkflows) {
        throw new ValidationError$1(ERRORS.WORKFLOWS_LIMIT);
      }
    }
  };
};
const getDataWithStage = async (workflow2, data) => {
  if (!isNil(ENTITY_STAGE_ATTRIBUTE)) {
    return { ...data, [ENTITY_STAGE_ATTRIBUTE]: workflow2.stages[0].id };
  }
  return data;
};
const getEntityStage = async (uid, id) => {
  const entity = await strapi.entityService.findOne(uid, id, {
    populate: {
      [ENTITY_STAGE_ATTRIBUTE]: {
        populate: {
          workflow: true
        }
      }
    }
  });
  return entity?.[ENTITY_STAGE_ATTRIBUTE] ?? {};
};
const decorator = (service) => ({
  async create(uid, opts = {}) {
    const workflow2 = await getService("workflows").getAssignedWorkflow(uid, {
      populate: "stages"
    });
    if (!workflow2) {
      return service.create.call(this, uid, opts);
    }
    const data = await getDataWithStage(workflow2, opts.data);
    return service.create.call(this, uid, { ...opts, data });
  },
  async update(uid, entityId, opts = {}) {
    const data = { ...opts.data };
    if (isNil(data[ENTITY_STAGE_ATTRIBUTE])) {
      delete data[ENTITY_STAGE_ATTRIBUTE];
      return service.update.call(this, uid, entityId, { ...opts, data });
    }
    const previousStage = await getEntityStage(uid, entityId);
    const updatedEntity = await service.update.call(this, uid, entityId, { ...opts, data });
    const updatedStage = updatedEntity[ENTITY_STAGE_ATTRIBUTE];
    if (updatedStage && previousStage?.id && previousStage.id !== updatedStage.id) {
      const model = strapi.getModel(uid);
      strapi.eventHub.emit(WORKFLOW_UPDATE_STAGE, {
        model: model.modelName,
        uid: model.uid,
        entity: {
          id: entityId
        },
        workflow: {
          id: previousStage.workflow.id,
          stages: {
            from: {
              id: previousStage.id,
              name: previousStage.name
            },
            to: {
              id: updatedStage.id,
              name: updatedStage.name
            }
          }
        }
      });
    }
    return updatedEntity;
  }
});
const reviewWorkflowsDecorator = () => ({
  decorator
});
const sendDidCreateStage = async () => {
  strapi.telemetry.send("didCreateStage", {});
};
const sendDidEditStage = async () => {
  strapi.telemetry.send("didEditStage", {});
};
const sendDidDeleteStage = async () => {
  strapi.telemetry.send("didDeleteStage", {});
};
const sendDidChangeEntryStage = async () => {
  strapi.telemetry.send("didChangeEntryStage", {});
};
const sendDidCreateWorkflow = async () => {
  strapi.telemetry.send("didCreateWorkflow", {});
};
const sendDidEditWorkflow = async () => {
  strapi.telemetry.send("didEditWorkflow", {});
};
const sendDidEditAssignee = async (fromId, toId) => {
  strapi.telemetry.send("didEditAssignee", { from: fromId, to: toId });
};
const sendDidSendReviewWorkflowPropertiesOnceAWeek = async (numberOfActiveWorkflows, avgStagesCount, maxStagesCount, activatedContentTypes) => {
  strapi.telemetry.send("didSendReviewWorkflowPropertiesOnceAWeek", {
    groupProperties: {
      numberOfActiveWorkflows,
      avgStagesCount,
      maxStagesCount,
      activatedContentTypes
    }
  });
};
const reviewWorkflowsMetrics = {
  sendDidCreateStage,
  sendDidEditStage,
  sendDidDeleteStage,
  sendDidChangeEntryStage,
  sendDidCreateWorkflow,
  sendDidEditWorkflow,
  sendDidSendReviewWorkflowPropertiesOnceAWeek,
  sendDidEditAssignee
};
const ONE_WEEK = 7 * 24 * 60 * 60 * 1e3;
const getWeeklyCronScheduleAt = (date) => `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} * * ${date.getDay()}`;
const reviewWorkflowsWeeklyMetrics = ({ strapi: strapi2 }) => {
  const metrics2 = getService("review-workflows-metrics", { strapi: strapi2 });
  const workflowsService = getService("workflows", { strapi: strapi2 });
  const getMetricsStoreValue = async () => {
    const value = await strapi2.store.get({ type: "plugin", name: "ee", key: "metrics" });
    return defaultTo({}, value);
  };
  const setMetricsStoreValue = (value) => strapi2.store.set({ type: "plugin", name: "ee", key: "metrics", value });
  return {
    async computeMetrics() {
      const workflows2 = await workflowsService.find({ populate: "stages" });
      const stagesCount = flow(
        map("stages"),
        // Number of stages per workflow
        map(size)
      )(workflows2);
      const contentTypesCount = flow(
        map("contentTypes"),
        // Number of content types per workflow
        map(size)
      )(workflows2);
      return {
        numberOfActiveWorkflows: size(workflows2),
        avgStagesCount: mean(stagesCount),
        maxStagesCount: max(stagesCount),
        activatedContentTypes: sum(contentTypesCount)
      };
    },
    async sendMetrics() {
      const computedMetrics = await this.computeMetrics();
      metrics2.sendDidSendReviewWorkflowPropertiesOnceAWeek(computedMetrics);
      const metricsInfoStored = await getMetricsStoreValue();
      await setMetricsStoreValue({ ...metricsInfoStored, lastWeeklyUpdate: (/* @__PURE__ */ new Date()).getTime() });
    },
    async ensureWeeklyStoredCronSchedule() {
      const metricsInfoStored = await getMetricsStoreValue();
      const { weeklySchedule: currentSchedule, lastWeeklyUpdate } = metricsInfoStored;
      const now = /* @__PURE__ */ new Date();
      let weeklySchedule = currentSchedule;
      if (!currentSchedule || !lastWeeklyUpdate || lastWeeklyUpdate + ONE_WEEK < now.getTime()) {
        weeklySchedule = getWeeklyCronScheduleAt(add(now, { seconds: 10 }));
        await setMetricsStoreValue({ ...metricsInfoStored, weeklySchedule });
      }
      return weeklySchedule;
    },
    async registerCron() {
      const weeklySchedule = await this.ensureWeeklyStoredCronSchedule();
      strapi2.cron.add({ [weeklySchedule]: this.sendMetrics.bind(this) });
    }
  };
};
const index$1 = {
  auth,
  passport,
  role: role$1,
  user: user$1,
  metrics,
  "seat-enforcement": seatEnforcement,
  workflows: workflows$1,
  stages: stages$1,
  "stage-permissions": stagePermissions,
  assignees: assignees$1,
  "review-workflows": reviewWorkflows,
  "review-workflows-validation": reviewWorkflowsValidation,
  "review-workflows-decorator": reviewWorkflowsDecorator,
  "review-workflows-metrics": reviewWorkflowsMetrics,
  "review-workflows-weekly-metrics": reviewWorkflowsWeeklyMetrics
};
const providerOptionsUpdateSchema = yup.object().shape({
  autoRegister: yup.boolean().required(),
  defaultRole: yup.strapiID().when("autoRegister", (value, initSchema) => {
    return value ? initSchema.required() : initSchema.nullable();
  }).test("is-valid-role", "You must submit a valid default role", (roleId) => {
    if (roleId === null) {
      return true;
    }
    return strapi.admin.services.role.exists({ id: roleId });
  }),
  ssoLockedRoles: yup.array().nullable().of(
    yup.strapiID().test(
      "is-valid-role",
      "You must submit a valid role for the SSO Locked roles",
      (roleId) => {
        return strapi.admin.services.role.exists({ id: roleId });
      }
    )
  )
});
const validateProviderOptionsUpdate = validateYupSchema(providerOptionsUpdateSchema);
const PROVIDER_REDIRECT_BASE = "/auth/login";
const PROVIDER_REDIRECT_SUCCESS = `${PROVIDER_REDIRECT_BASE}/success`;
const PROVIDER_REDIRECT_ERROR = `${PROVIDER_REDIRECT_BASE}/error`;
const PROVIDER_URLS_MAP = {
  success: PROVIDER_REDIRECT_SUCCESS,
  error: PROVIDER_REDIRECT_ERROR
};
const getAdminStore = async () => strapi.store({ type: "core", name: "admin" });
const getPrefixedRedirectUrls = () => {
  const { url: adminUrl } = strapi.config.get("admin");
  const prefixUrl = (url) => `${adminUrl || "/admin"}${url}`;
  return mapValues(prefixUrl, PROVIDER_URLS_MAP);
};
const utils = {
  getAdminStore,
  getPrefixedRedirectUrls
};
const defaultConnectionError = () => new Error("Invalid connection payload");
const authenticate = async (ctx, next) => {
  const {
    params: { provider }
  } = ctx;
  const redirectUrls = utils.getPrefixedRedirectUrls();
  return passport$2.authenticate(provider, null, async (error, profile) => {
    if (error || !profile || !profile.email) {
      if (error) {
        strapi.log.error(error);
      }
      strapi.eventHub.emit("admin.auth.error", {
        error: error || defaultConnectionError(),
        provider
      });
      return ctx.redirect(redirectUrls.error);
    }
    const user2 = await getService("user").findOneByEmail(profile.email);
    const scenario = user2 ? existingUserScenario : nonExistingUserScenario;
    return scenario(ctx, next)(user2 || profile, provider);
  })(ctx, next);
};
const existingUserScenario = (ctx, next) => async (user2, provider) => {
  const redirectUrls = utils.getPrefixedRedirectUrls();
  if (!user2.isActive) {
    strapi.eventHub.emit("admin.auth.error", {
      error: new Error(`Deactivated user tried to login (${user2.id})`),
      provider
    });
    return ctx.redirect(redirectUrls.error);
  }
  ctx.state.user = user2;
  return next();
};
const nonExistingUserScenario = (ctx, next) => async (profile, provider) => {
  const { email: email2, firstname: firstname2, lastname: lastname2, username: username2 } = profile;
  const redirectUrls = utils.getPrefixedRedirectUrls();
  const adminStore = await utils.getAdminStore();
  const { providers } = await adminStore.get({ key: "auth" });
  const isMissingRegisterFields = !username2 && (!firstname2 || !lastname2);
  if (!providers.autoRegister || !providers.defaultRole || isMissingRegisterFields) {
    strapi.eventHub.emit("admin.auth.error", { error: defaultConnectionError(), provider });
    return ctx.redirect(redirectUrls.error);
  }
  const defaultRole = await getService("role").findOne({ id: providers.defaultRole });
  if (!defaultRole) {
    strapi.eventHub.emit("admin.auth.error", { error: defaultConnectionError(), provider });
    return ctx.redirect(redirectUrls.error);
  }
  ctx.state.user = await getService("user").create({
    email: email2,
    username: username2,
    firstname: firstname2,
    lastname: lastname2,
    roles: [defaultRole.id],
    isActive: true,
    registrationToken: null
  });
  strapi.eventHub.emit("admin.auth.autoRegistration", {
    user: ctx.state.user,
    provider
  });
  return next();
};
const redirectWithAuth = (ctx) => {
  const {
    params: { provider }
  } = ctx;
  const redirectUrls = utils.getPrefixedRedirectUrls();
  const domain = strapi.config.get("admin.auth.domain");
  const { user: user2 } = ctx.state;
  const jwt = getService("token").createJwtToken(user2);
  const isProduction = strapi.config.get("environment") === "production";
  const cookiesOptions = { httpOnly: false, secure: isProduction, overwrite: true, domain };
  const sanitizedUser = getService("user").sanitizeUser(user2);
  strapi.eventHub.emit("admin.auth.success", { user: sanitizedUser, provider });
  ctx.cookies.set("jwtToken", jwt, cookiesOptions);
  ctx.redirect(redirectUrls.success);
};
const middlewares = {
  authenticate,
  redirectWithAuth
};
const toProviderDTO = pick(["uid", "displayName", "icon"]);
const toProviderLoginOptionsDTO = pick(["autoRegister", "defaultRole", "ssoLockedRoles"]);
const { ValidationError } = errors;
const providerAuthenticationFlow = compose([
  middlewares.authenticate,
  middlewares.redirectWithAuth
]);
const authentication = {
  async getProviders(ctx) {
    const { providerRegistry: providerRegistry2 } = strapi.admin.services.passport;
    ctx.body = providerRegistry2.getAll().map(toProviderDTO);
  },
  async getProviderLoginOptions(ctx) {
    const adminStore = await utils.getAdminStore();
    const { providers: providersOptions } = await adminStore.get({ key: "auth" });
    ctx.body = {
      data: toProviderLoginOptionsDTO(providersOptions)
    };
  },
  async updateProviderLoginOptions(ctx) {
    const {
      request: { body }
    } = ctx;
    await validateProviderOptionsUpdate(body);
    const adminStore = await utils.getAdminStore();
    const currentAuthOptions = await adminStore.get({ key: "auth" });
    const newAuthOptions = { ...currentAuthOptions, providers: body };
    await adminStore.set({ key: "auth", value: newAuthOptions });
    strapi.telemetry.send("didUpdateSSOSettings");
    ctx.body = {
      data: toProviderLoginOptionsDTO(newAuthOptions.providers)
    };
  },
  providerLogin(ctx, next) {
    const {
      params: { provider: providerName }
    } = ctx;
    const { providerRegistry: providerRegistry2 } = strapi.admin.services.passport;
    if (!providerRegistry2.has(providerName)) {
      throw new ValidationError(`Invalid provider supplied: ${providerName}`);
    }
    return providerAuthenticationFlow(ctx, next);
  }
};
const roleCreateSchema = yup.object().shape({
  name: yup.string().min(1).required(),
  description: yup.string().nullable()
}).noUnknown();
const rolesDeleteSchema = yup.object().shape({
  ids: yup.array().of(yup.strapiID()).min(1).required().test(
    "roles-deletion-checks",
    "Roles deletion checks have failed",
    async function rolesDeletionChecks(ids) {
      try {
        await strapi.admin.services.role.checkRolesIdForDeletion(ids);
        if (EE.features.isEnabled("sso")) {
          await strapi.admin.services.role.ssoCheckRolesIdForDeletion(ids);
        }
      } catch (e) {
        return this.createError({ path: "ids", message: e.message });
      }
      return true;
    }
  )
}).noUnknown();
const roleDeleteSchema = yup.strapiID().required().test(
  "no-admin-single-delete",
  "Role deletion checks have failed",
  async function noAdminSingleDelete(id) {
    try {
      await strapi.admin.services.role.checkRolesIdForDeletion([id]);
      if (EE.features.isEnabled("sso")) {
        await strapi.admin.services.role.ssoCheckRolesIdForDeletion([id]);
      }
    } catch (e) {
      return this.createError({ path: "id", message: e.message });
    }
    return true;
  }
);
const validateRoleCreateInput = validateYupSchema(roleCreateSchema);
const validateRolesDeleteInput = validateYupSchema(rolesDeleteSchema);
const validateRoleDeleteInput = validateYupSchema(roleDeleteSchema);
const role = {
  /**
   * Create a new role
   * @param {KoaContext} ctx - koa context
   */
  async create(ctx) {
    await validateRoleCreateInput(ctx.request.body);
    const roleService = getService("role");
    const role2 = await roleService.create(ctx.request.body);
    const sanitizedRole = roleService.sanitizeRole(role2);
    ctx.created({ data: sanitizedRole });
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
const sanitizeActionAttributes = pick(actionFields);
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
const assignActionId = (attrs) => set("actionId", computeActionId(attrs), attrs);
const assignOrOmitSubCategory = (action) => {
  const shouldHaveSubCategory = ["settings", "plugins"].includes(action.section);
  return shouldHaveSubCategory ? set("subCategory", action.subCategory || "general", action) : omit("subCategory", action);
};
const appliesToProperty = curry((property2, action) => {
  return pipe(prop("options.applyToProperties"), includes(property2))(action);
});
const appliesToSubject = curry((subject, action) => {
  return isArray(action.subjects) && includes(subject, action.subjects);
});
const create = pipe(
  // Create and assign an action identifier to the action
  // (need to be done before the sanitizeActionAttributes since we need the uid here)
  assignActionId,
  // Add or remove the sub category field based on the pluginName attribute
  assignOrOmitSubCategory,
  // Remove unwanted attributes from the payload
  sanitizeActionAttributes,
  // Complete the action creation by adding default values for some attributes
  merge(getDefaultActionAttributes())
);
const actionDomain = {
  actionFields,
  appliesToProperty,
  appliesToSubject,
  assignActionId,
  assignOrOmitSubCategory,
  create,
  computeActionId,
  getDefaultActionAttributes,
  sanitizeActionAttributes
};
const checkFieldsAreCorrectlyNested = (fields) => {
  if (_.isNil(fields)) {
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
  if (_.isNil(fields)) {
    return true;
  }
  if (!Array.isArray(fields)) {
    return false;
  }
  return _.uniq(fields).length === fields.length;
};
const getActionFromProvider = (actionId) => {
  return getService$1("permission").actionProvider.get(actionId);
};
const email = yup.string().email().lowercase();
const firstname = yup.string().trim().min(1);
const lastname = yup.string();
const username = yup.string().min(1);
const password = yup.string().min(8).matches(/[a-z]/, "${path} must contain at least one lowercase character").matches(/[A-Z]/, "${path} must contain at least one uppercase character").matches(/\d/, "${path} must contain at least one number");
const roles = yup.array(yup.strapiID()).min(1);
const isAPluginName = yup.string().test("is-a-plugin-name", "is not a plugin name", function(value) {
  return [void 0, "admin", ...Object.keys(strapi.plugins)].includes(value) ? true : this.createError({ path: this.path, message: `${this.path} is not an existing plugin` });
});
const arrayOfConditionNames = yup.array().of(yup.string()).test("is-an-array-of-conditions", "is not a plugin name", function(value) {
  const ids = strapi.admin.services.permission.conditionProvider.keys();
  return _.isUndefined(value) || _.difference(value, ids).length === 0 ? true : this.createError({ path: this.path, message: `contains conditions that don't exist` });
});
const permissionsAreEquals = (a, b) => a.action === b.action && (a.subject === b.subject || _.isNil(a.subject) && _.isNil(b.subject));
const checkNoDuplicatedPermissions = (permissions) => !Array.isArray(permissions) || permissions.every(
  (permA, i) => permissions.slice(i + 1).every((permB) => !permissionsAreEquals(permA, permB))
);
const checkNilFields = (action) => function(fields) {
  if (isNil(action)) {
    return true;
  }
  return actionDomain.appliesToProperty("fields", action) || isNil(fields);
};
const fieldsPropertyValidation = (action) => yup.array().of(yup.string()).nullable().test(
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
  checkNilFields(action)
);
const permission = yup.object().shape({
  action: yup.string().required().test("action-validity", "action is not an existing permission action", function(actionId) {
    if (isNil(actionId)) {
      return true;
    }
    return !!getActionFromProvider(actionId);
  }),
  actionParameters: yup.object().nullable(),
  subject: yup.string().nullable().test("subject-validity", "Invalid subject submitted", function(subject) {
    const action = getActionFromProvider(this.options.parent.action);
    if (!action) {
      return true;
    }
    if (isNil(action.subjects)) {
      return isNil(subject);
    }
    if (isArray(action.subjects) && !isNil(subject)) {
      return action.subjects.includes(subject);
    }
    return false;
  }),
  properties: yup.object().test("properties-structure", "Invalid property set at ${path}", function(properties) {
    const action = getActionFromProvider(this.options.parent.action);
    const hasNoProperties = isEmpty(properties) || isNil(properties);
    if (!has("options.applyToProperties", action)) {
      return hasNoProperties;
    }
    if (hasNoProperties) {
      return true;
    }
    const { applyToProperties } = action.options;
    if (!isArray(applyToProperties)) {
      return false;
    }
    return Object.keys(properties).every((property2) => applyToProperties.includes(property2));
  }).test(
    "fields-property",
    "Invalid fields property at ${path}",
    async function(properties = {}) {
      const action = getActionFromProvider(this.options.parent.action);
      if (!action || !properties) {
        return true;
      }
      if (!actionDomain.appliesToProperty("fields", action)) {
        return true;
      }
      try {
        await fieldsPropertyValidation(action).validate(properties.fields, {
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
  conditions: yup.array().of(yup.string())
}).noUnknown();
const updatePermissions = yup.object().shape({
  permissions: yup.array().required().of(permission).test(
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
  permission,
  updatePermissions
};
const userCreationSchema = yup.object().shape({
  email: validators.email.required(),
  firstname: validators.firstname.required(),
  lastname: validators.lastname,
  roles: validators.roles.min(1),
  preferedLanguage: yup.string().nullable()
}).noUnknown();
const profileUpdateSchema = yup.object().shape({
  email: validators.email.notNull(),
  firstname: validators.firstname.notNull(),
  lastname: validators.lastname.nullable(),
  username: validators.username.nullable(),
  password: validators.password.notNull(),
  currentPassword: yup.string().when(
    "password",
    (password2, schema) => !isUndefined(password2) ? schema.required() : schema
  ).notNull(),
  preferedLanguage: yup.string().nullable()
}).noUnknown();
const userUpdateSchema = yup.object().shape({
  email: validators.email.notNull(),
  firstname: validators.firstname.notNull(),
  lastname: validators.lastname.nullable(),
  username: validators.username.nullable(),
  password: validators.password.notNull(),
  isActive: yup.bool().notNull(),
  roles: validators.roles.min(1).notNull()
}).noUnknown();
const usersDeleteSchema = yup.object().shape({
  ids: yup.array().of(yup.strapiID()).min(1).required()
}).noUnknown();
validateYupSchema(userCreationSchema);
validateYupSchema(profileUpdateSchema);
const validateUserUpdateInput = validateYupSchema(userUpdateSchema);
validateYupSchema(usersDeleteSchema);
const schemas = {
  userCreationSchema,
  usersDeleteSchema,
  userUpdateSchema
};
const ssoUserCreationInputExtension = yup.object().shape({
  useSSORegistration: yup.boolean()
}).noUnknown();
const validateUserCreationInput = (data) => {
  let schema = schemas.userCreationSchema;
  if (EE.features.isEnabled("sso")) {
    schema = schema.concat(ssoUserCreationInputExtension);
  }
  return validateYupSchema(schema)(data);
};
const { ApplicationError, ForbiddenError } = errors;
const pickUserCreationAttributes = pick(["firstname", "lastname", "email", "roles"]);
const hasAdminSeatsAvaialble = async () => {
  if (!strapi.EE) {
    return true;
  }
  const permittedSeats = EE.seats;
  if (isNil(permittedSeats)) {
    return true;
  }
  const userCount = await strapi.service("admin::user").getCurrentActiveUserCount();
  if (userCount < permittedSeats) {
    return true;
  }
};
const user = {
  async create(ctx) {
    if (!await hasAdminSeatsAvaialble()) {
      throw new ForbiddenError("License seat limit reached. You cannot create a new user");
    }
    const { body } = ctx.request;
    const cleanData = { ...body, email: _.get(body, `email`, ``).toLowerCase() };
    await validateUserCreationInput(cleanData);
    const attributes = pickUserCreationAttributes(cleanData);
    const { useSSORegistration } = cleanData;
    const userAlreadyExists = await getService("user").exists({ email: attributes.email });
    if (userAlreadyExists) {
      throw new ApplicationError("Email already taken");
    }
    if (useSSORegistration) {
      Object.assign(attributes, { registrationToken: null, isActive: true });
    }
    const createdUser = await getService("user").create(attributes);
    const userInfo = getService("user").sanitizeUser(createdUser);
    Object.assign(userInfo, { registrationToken: createdUser.registrationToken });
    ctx.created({ data: userInfo });
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
    const user2 = await getService("user").findOne(id, null);
    if (!await hasAdminSeatsAvaialble() && !user2.isActive && input.isActive) {
      throw new ForbiddenError("License seat limit reached. You cannot active this user");
    }
    const updatedUser = await getService("user").updateById(id, input);
    if (!updatedUser) {
      return ctx.notFound("User does not exist");
    }
    ctx.body = {
      data: getService("user").sanitizeUser(updatedUser)
    };
  },
  async isSSOLocked(ctx) {
    const { user: user2 } = ctx.state;
    const isSSOLocked = await isSsoLocked(user2);
    ctx.body = {
      data: {
        isSSOLocked
      }
    };
  }
};
const ALLOWED_SORT_STRINGS = ["action:ASC", "action:DESC", "date:ASC", "date:DESC"];
const validateFindManySchema = yup.object().shape({
  page: yup.number().integer().min(1),
  pageSize: yup.number().integer().min(1).max(100),
  sort: yup.mixed().oneOf(ALLOWED_SORT_STRINGS)
}).required();
const validateFindMany = validateYupSchema(validateFindManySchema, { strict: false });
const auditLogs = {
  async findMany(ctx) {
    const { query } = ctx.request;
    await validateFindMany(query);
    const auditLogs2 = strapi.container.get("audit-logs");
    const body = await auditLogs2.findMany(query);
    ctx.body = body;
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const auditLogs2 = strapi.container.get("audit-logs");
    const body = await auditLogs2.findOne(id);
    ctx.body = body;
    strapi.telemetry.send("didWatchAnAuditLog");
  }
};
const admin = {
  // NOTE: Overrides CE admin controller
  async getProjectType() {
    const flags = strapi.config.get("admin.flags", {});
    try {
      return { data: { isEE: strapi.EE, features: EE.features.list(), flags } };
    } catch (err) {
      return { data: { isEE: false, features: [], flags } };
    }
  },
  async licenseLimitInformation() {
    const permittedSeats = EE.seats;
    let shouldNotify = false;
    let licenseLimitStatus = null;
    let enforcementUserCount;
    const currentActiveUserCount = await getService("user").getCurrentActiveUserCount();
    const eeDisabledUsers = await getService("seat-enforcement").getDisabledUserList();
    if (eeDisabledUsers) {
      enforcementUserCount = currentActiveUserCount + eeDisabledUsers.length;
    } else {
      enforcementUserCount = currentActiveUserCount;
    }
    if (!isNil(permittedSeats) && enforcementUserCount > permittedSeats) {
      shouldNotify = true;
      licenseLimitStatus = "OVER_LIMIT";
    }
    if (!isNil(permittedSeats) && enforcementUserCount === permittedSeats) {
      shouldNotify = true;
      licenseLimitStatus = "AT_LIMIT";
    }
    const data = {
      enforcementUserCount,
      currentActiveUserCount,
      permittedSeats,
      shouldNotify,
      shouldStopCreate: isNil(permittedSeats) ? false : currentActiveUserCount >= permittedSeats,
      licenseLimitStatus,
      isHostedOnStrapiCloud: env("STRAPI_HOSTING", null) === "strapi.cloud",
      features: EE.features.list() ?? []
    };
    return { data };
  }
};
const stageObject = yup.object().shape({
  id: yup.number().integer().min(1),
  name: yup.string().max(255).required(),
  color: yup.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/i),
  // hex color
  permissions: yup.array().of(
    yup.object().shape({
      role: yup.number().integer().min(1).required(),
      action: yup.string().oneOf([STAGE_TRANSITION_UID]).required(),
      actionParameters: yup.object().shape({
        from: yup.number().integer().min(1).required(),
        to: yup.number().integer().min(1)
      })
    })
  )
});
const validateUpdateStageOnEntitySchema = yup.object().shape({
  id: yup.number().integer().min(1).required()
}).required();
const validateContentTypes = yup.array().of(
  // @ts-expect-error yup types
  yup.string().test({
    name: "content-type-exists",
    message: (value) => `Content type ${value.originalValue} does not exist`,
    test(uid) {
      return strapi.getModel(uid);
    }
  }).test({
    name: "content-type-review-workflow-enabled",
    message: (value) => `Content type ${value.originalValue} does not have review workflow enabled`,
    test(uid) {
      const model = strapi.getModel(uid);
      return hasStageAttribute(model);
    }
  })
);
const validateWorkflowCreateSchema = yup.object().shape({
  name: yup.string().max(255).min(1, "Workflow name can not be empty").required(),
  stages: yup.array().of(stageObject).uniqueProperty("name", "Stage name must be unique").min(1, "Can not create a workflow without stages").max(200, "Can not have more than 200 stages").required("Can not create a workflow without stages"),
  contentTypes: validateContentTypes
});
const validateWorkflowUpdateSchema = yup.object().shape({
  name: yup.string().max(255).min(1, "Workflow name can not be empty"),
  stages: yup.array().of(stageObject).uniqueProperty("name", "Stage name must be unique").min(1, "Can not update a workflow without stages").max(200, "Can not have more than 200 stages"),
  contentTypes: validateContentTypes
});
const validateUpdateAssigneeOnEntitySchema = yup.object().shape({
  id: yup.number().integer().min(1).nullable()
}).required();
const validateWorkflowCreate = validateYupSchema(validateWorkflowCreateSchema);
const validateUpdateStageOnEntity = validateYupSchema(validateUpdateStageOnEntitySchema);
const validateUpdateAssigneeOnEntity = validateYupSchema(
  validateUpdateAssigneeOnEntitySchema
);
const validateWorkflowUpdate = validateYupSchema(validateWorkflowUpdateSchema);
function getWorkflowsPermissionChecker({ strapi: strapi2 }, userAbility) {
  return strapi2.plugin("content-manager").service("permission-checker").create({ userAbility, model: WORKFLOW_MODEL_UID });
}
function formatWorkflowToAdmin(workflow2) {
  if (!workflow2)
    return;
  if (!workflow2.stages)
    return workflow2;
  const transformPermissions = map(update("role", property("id")));
  const transformStages = map(update("permissions", transformPermissions));
  return update("stages", transformStages, workflow2);
}
const workflows = {
  /**
   * Create a new workflow
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async create(ctx) {
    const { body, query } = ctx.request;
    const { sanitizeCreateInput, sanitizeOutput, sanitizedQuery } = getWorkflowsPermissionChecker(
      { strapi },
      ctx.state.userAbility
    );
    const { populate } = await sanitizedQuery.create(query);
    const workflowBody = await validateWorkflowCreate(body.data);
    const workflowService = getService("workflows");
    const createdWorkflow = await workflowService.create({
      data: await sanitizeCreateInput(workflowBody),
      populate
    }).then(formatWorkflowToAdmin);
    ctx.body = {
      data: await sanitizeOutput(createdWorkflow)
    };
  },
  /**
   * Update a workflow
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { body, query } = ctx.request;
    const workflowService = getService("workflows");
    const { sanitizeUpdateInput, sanitizeOutput, sanitizedQuery } = getWorkflowsPermissionChecker(
      { strapi },
      ctx.state.userAbility
    );
    const { populate } = await sanitizedQuery.update(query);
    const workflowBody = await validateWorkflowUpdate(body.data);
    const workflow2 = await workflowService.findById(id, { populate: WORKFLOW_POPULATE });
    if (!workflow2) {
      return ctx.notFound();
    }
    const getPermittedFieldToUpdate = sanitizeUpdateInput(workflow2);
    const dataToUpdate = await getPermittedFieldToUpdate(workflowBody);
    const updatedWorkflow = await workflowService.update(workflow2, {
      data: dataToUpdate,
      populate
    }).then(formatWorkflowToAdmin);
    ctx.body = {
      data: await sanitizeOutput(updatedWorkflow)
    };
  },
  /**
   * Delete a workflow
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const { query } = ctx.request;
    const workflowService = getService("workflows");
    const { sanitizeOutput, sanitizedQuery } = getWorkflowsPermissionChecker(
      { strapi },
      ctx.state.userAbility
    );
    const { populate } = await sanitizedQuery.delete(query);
    const workflow2 = await workflowService.findById(id, { populate: WORKFLOW_POPULATE });
    if (!workflow2) {
      return ctx.notFound("Workflow doesn't exist");
    }
    const deletedWorkflow = await workflowService.delete(workflow2, { populate }).then(formatWorkflowToAdmin);
    ctx.body = {
      data: await sanitizeOutput(deletedWorkflow)
    };
  },
  /**
   * List all workflows
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async find(ctx) {
    const { query } = ctx.request;
    const workflowService = getService("workflows");
    const { sanitizeOutput, sanitizedQuery } = getWorkflowsPermissionChecker(
      { strapi },
      ctx.state.userAbility
    );
    const { populate, filters, sort } = await sanitizedQuery.read(query);
    const [workflows2, workflowCount] = await Promise.all([
      workflowService.find({ populate, filters, sort }).then(map(formatWorkflowToAdmin)),
      workflowService.count()
    ]);
    ctx.body = {
      data: await mapAsync(workflows2, sanitizeOutput),
      meta: {
        workflowCount
      }
    };
  },
  /**
   * Get one workflow based on its id contained in request parameters
   * Returns count of workflows in meta, used to prevent workflow edition when
   * max workflow count is reached for the current plan
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async findById(ctx) {
    const { id } = ctx.params;
    const { query } = ctx.request;
    const { sanitizeOutput, sanitizedQuery } = getWorkflowsPermissionChecker(
      { strapi },
      ctx.state.userAbility
    );
    const { populate } = await sanitizedQuery.read(query);
    const workflowService = getService("workflows");
    const [workflow2, workflowCount] = await Promise.all([
      workflowService.findById(id, { populate }).then(formatWorkflowToAdmin),
      workflowService.count()
    ]);
    ctx.body = {
      data: await sanitizeOutput(workflow2),
      meta: { workflowCount }
    };
  }
};
function sanitizeStage({ strapi: strapi2 }, userAbility) {
  const permissionChecker = strapi2.plugin("content-manager").service("permission-checker").create({ userAbility, model: STAGE_MODEL_UID });
  return (entity) => permissionChecker.sanitizeOutput(entity);
}
const stages = {
  /**
   * List all stages
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async find(ctx) {
    const { workflow_id: workflowId } = ctx.params;
    const { populate } = ctx.query;
    const stagesService = getService("stages");
    const sanitizer = sanitizeStage({ strapi }, ctx.state.userAbility);
    const stages2 = await stagesService.find({
      workflowId,
      populate
    });
    ctx.body = {
      data: await mapAsync(stages2, sanitizer)
    };
  },
  /**
   * Get one stage
   * @param {import('koa').BaseContext} ctx - koa context
   */
  async findById(ctx) {
    const { id, workflow_id: workflowId } = ctx.params;
    const { populate } = ctx.query;
    const stagesService = getService("stages");
    const sanitizer = sanitizeStage({ strapi }, ctx.state.userAbility);
    const stage = await stagesService.findById(id, {
      workflowId,
      populate
    });
    ctx.body = {
      data: await sanitizer(stage)
    };
  },
  /**
   * Updates an entity's stage.
   * @async
   * @param {Object} ctx - The Koa context object.
   * @param {Object} ctx.params - An object containing the parameters from the request URL.
   * @param {string} ctx.params.model_uid - The model UID of the entity.
   * @param {string} ctx.params.id - The ID of the entity to update.
   * @param {Object} ctx.request.body.data - Optional data object containing the new stage ID for the entity.
   * @param {string} ctx.request.body.data.id - The ID of the new stage for the entity.
   * @throws {ApplicationError} If review workflows is not activated on the specified model UID.
   * @throws {ValidationError} If the `data` object in the request body fails to pass validation.
   * @returns {Promise<void>} A promise that resolves when the entity's stage has been updated.
   */
  async updateEntity(ctx) {
    const stagesService = getService("stages");
    const stagePermissions2 = getService("stage-permissions");
    const workflowService = getService("workflows");
    const { model_uid: modelUID, id } = ctx.params;
    const { body } = ctx.request;
    const { sanitizeOutput } = strapi.plugin("content-manager").service("permission-checker").create({ userAbility: ctx.state.userAbility, model: modelUID });
    const entity = await strapi.entityService.findOne(modelUID, Number(id), {
      populate: [ENTITY_STAGE_ATTRIBUTE]
    });
    if (!entity) {
      ctx.throw(404, "Entity not found");
    }
    const canTransition = stagePermissions2.can(
      STAGE_TRANSITION_UID,
      entity[ENTITY_STAGE_ATTRIBUTE]?.id
    );
    if (!canTransition) {
      ctx.throw(403, "Forbidden stage transition");
    }
    const { id: stageId } = await validateUpdateStageOnEntity(
      { id: Number(body?.data?.id) },
      "You should pass an id to the body of the put request."
    );
    const workflow2 = await workflowService.assertContentTypeBelongsToWorkflow(modelUID);
    workflowService.assertStageBelongsToWorkflow(stageId, workflow2);
    const updatedEntity = await stagesService.updateEntity({ id: entity.id, modelUID }, stageId);
    ctx.body = { data: await sanitizeOutput(updatedEntity) };
  },
  /**
   * List all the stages that are available for a user to transition an entity to.
   * If the user has permission to change the current stage of the entity every other stage in the workflow is returned
   * @async
   * @param {*} ctx
   * @param {string} ctx.params.model_uid - The model UID of the entity.
   * @param {string} ctx.params.id - The ID of the entity.
   * @throws {ApplicationError} If review workflows is not activated on the specified model UID.
   */
  async listAvailableStages(ctx) {
    const stagePermissions2 = getService("stage-permissions");
    const workflowService = getService("workflows");
    const { model_uid: modelUID, id } = ctx.params;
    if (strapi.plugin("content-manager").service("permission-checker").create({ userAbility: ctx.state.userAbility, model: modelUID }).cannot.read()) {
      return ctx.forbidden();
    }
    const entity = await strapi.entityService.findOne(modelUID, Number(id), {
      populate: [ENTITY_STAGE_ATTRIBUTE]
    });
    if (!entity) {
      ctx.throw(404, "Entity not found");
    }
    const entityStageId = entity[ENTITY_STAGE_ATTRIBUTE]?.id;
    const canTransition = stagePermissions2.can(STAGE_TRANSITION_UID, entityStageId);
    const [workflowCount, { stages: workflowStages }] = await Promise.all([
      workflowService.count(),
      workflowService.getAssignedWorkflow(modelUID, {
        populate: "stages"
      })
    ]);
    const meta = {
      stageCount: workflowStages.length,
      workflowCount
    };
    if (!canTransition) {
      ctx.body = {
        data: [],
        meta
      };
      return;
    }
    const data = workflowStages.filter((stage) => stage.id !== entityStageId);
    ctx.body = {
      data,
      meta
    };
  }
};
const assignees = {
  /**
   * Updates an entity's assignee.
   * @async
   * @param {Object} ctx - The Koa context object.
   * @param {Object} ctx.params - An object containing the parameters from the request URL.
   * @param {string} ctx.params.model_uid - The model UID of the entity.
   * @param {string} ctx.params.id - The ID of the entity to update.
   * @param {Object} ctx.request.body.data - Optional data object containing the new assignee ID for the entity.
   * @param {string} ctx.request.body.data.id - The ID of the new assignee for the entity.
   * @throws {ApplicationError} If review workflows is not activated on the specified model UID.
   * @throws {ValidationError} If the `data` object in the request body fails to pass validation.
   * @returns {Promise<void>} A promise that resolves when the entity's assignee has been updated.
   */
  async updateEntity(ctx) {
    const assigneeService = getService("assignees");
    const workflowService = getService("workflows");
    const { model_uid: model, id } = ctx.params;
    const { sanitizeOutput } = strapi.plugin("content-manager").service("permission-checker").create({ userAbility: ctx.state.userAbility, model });
    const { id: assigneeId } = await validateUpdateAssigneeOnEntity(
      ctx.request?.body?.data,
      "You should pass a valid id to the body of the put request."
    );
    await workflowService.assertContentTypeBelongsToWorkflow(model);
    const entity = await assigneeService.updateEntityAssignee(id, model, assigneeId);
    ctx.body = { data: await sanitizeOutput(entity) };
  }
};
const index = {
  authentication,
  role,
  user,
  auditLogs,
  admin,
  workflows,
  stages,
  assignees
};
export {
  bootstrap,
  index$3 as contentTypes,
  index as controllers,
  destroy,
  register,
  index$2 as routes,
  index$1 as services
};
//# sourceMappingURL=index.mjs.map
