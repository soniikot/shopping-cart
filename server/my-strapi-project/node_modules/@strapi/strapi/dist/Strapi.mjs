import path from "path";
import _ from "lodash";
import { isFunction } from "lodash/fp";
import { createLogger } from "@strapi/logger";
import { Database } from "@strapi/database";
import { hooks } from "@strapi/utils";
import loadConfiguration from "./core/app-configuration/index.mjs";
import * as factories from "./factories.mjs";
import { isCustomController } from "./factories.mjs";
import compile from "./compile.mjs";
import openBrowser from "./utils/open-browser.mjs";
import isInitialized from "./utils/is-initialized.mjs";
import getDirs from "./utils/get-dirs.mjs";
import { createContainer } from "./container.mjs";
import createStrapiFs from "./services/fs.mjs";
import createEventHub from "./services/event-hub.mjs";
import { createServer } from "./services/server/index.mjs";
import createWebhookRunner from "./services/webhook-runner.mjs";
import { webhookModel, createWebhookStore } from "./services/webhook-store.mjs";
import { coreStoreModel, createCoreStore } from "./services/core-store.mjs";
import createEntityService from "./services/entity-service/index.mjs";
import createCronService from "./services/cron.mjs";
import entityValidator from "./services/entity-validator/index.mjs";
import createTelemetryInstance from "./services/metrics/index.mjs";
import requestCtx from "./services/request-context.mjs";
import createAuthentication from "./services/auth/index.mjs";
import createCustomFields from "./services/custom-fields.mjs";
import createContentAPI from "./services/content-api/index.mjs";
import createUpdateNotifier from "./utils/update-notifier/index.mjs";
import createStartupLogger from "./utils/startup-logger.mjs";
import { createStrapiFetch } from "./utils/fetch.mjs";
import { LIFECYCLES } from "./utils/lifecycles.mjs";
import EE from "./ee/index.mjs";
import contentTypesRegistry from "./core/registries/content-types.mjs";
import servicesRegistry from "./core/registries/services.mjs";
import policiesRegistry from "./core/registries/policies.mjs";
import middlewaresRegistry from "./core/registries/middlewares.mjs";
import hooksRegistry from "./core/registries/hooks.mjs";
import controllersRegistry from "./core/registries/controllers.mjs";
import modulesRegistry from "./core/registries/modules.mjs";
import pluginsRegistry from "./core/registries/plugins.mjs";
import customFieldsRegistry from "./core/registries/custom-fields.mjs";
import createConfigProvider from "./core/registries/config.mjs";
import apisRegistry from "./core/registries/apis.mjs";
import bootstrap from "./core/bootstrap.mjs";
import loaders from "./core/loaders/index.mjs";
import { destroyOnSignal } from "./utils/signals.mjs";
import getNumberOfDynamicZones from "./services/utils/dynamic-zones.mjs";
import sanitizersRegistry from "./core/registries/sanitizers.mjs";
import validatorsRegistry from "./core/registries/validators.mjs";
import convertCustomFieldType from "./utils/convert-custom-field-type.mjs";
import { disable as disableDraftAndPublish, enable as enableDraftAndPublish } from "./migrations/draft-publish.mjs";
import { createFeaturesService } from "./services/features.mjs";
const resolveWorkingDirectories = (opts) => {
  const cwd = process.cwd();
  const appDir = opts.appDir ? path.resolve(cwd, opts.appDir) : cwd;
  const distDir = opts.distDir ? path.resolve(cwd, opts.distDir) : appDir;
  return { app: appDir, dist: distDir };
};
const reloader = (strapi) => {
  const state = {
    shouldReload: 0,
    isWatching: true
  };
  function reload() {
    if (state.shouldReload > 0) {
      state.shouldReload -= 1;
      reload.isReloading = false;
      return;
    }
    if (strapi.config.get("autoReload")) {
      process.send?.("reload");
    }
  }
  Object.defineProperty(reload, "isWatching", {
    configurable: true,
    enumerable: true,
    set(value) {
      if (state.isWatching === false && value === true) {
        state.shouldReload += 1;
      }
      state.isWatching = value;
    },
    get() {
      return state.isWatching;
    }
  });
  reload.isReloading = false;
  reload.isWatching = true;
  return reload;
};
class Strapi {
  server;
  container;
  log;
  fs;
  eventHub;
  startupLogger;
  cron;
  webhookRunner;
  webhookStore;
  store;
  entityValidator;
  entityService;
  telemetry;
  requestContext;
  customFields;
  fetch;
  dirs;
  admin;
  isLoaded;
  db;
  app;
  EE;
  components;
  reload;
  features;
  constructor(opts = {}) {
    destroyOnSignal(this);
    const rootDirs = resolveWorkingDirectories(opts);
    const appConfig = loadConfiguration(rootDirs, opts);
    this.container = createContainer(this).register("config", createConfigProvider(appConfig)).register("content-types", contentTypesRegistry()).register("services", servicesRegistry(this)).register("policies", policiesRegistry()).register("middlewares", middlewaresRegistry()).register("hooks", hooksRegistry()).register("controllers", controllersRegistry(this)).register("modules", modulesRegistry(this)).register("plugins", pluginsRegistry(this)).register("custom-fields", customFieldsRegistry(this)).register("apis", apisRegistry(this)).register("auth", createAuthentication()).register("content-api", createContentAPI(this)).register("sanitizers", sanitizersRegistry()).register("validators", validatorsRegistry());
    this.components = {};
    this.dirs = getDirs(rootDirs, { strapi: this });
    this.isLoaded = false;
    this.reload = reloader(this);
    this.server = createServer(this);
    this.fs = createStrapiFs(this);
    this.eventHub = createEventHub();
    this.startupLogger = createStartupLogger(this);
    this.log = createLogger(this.config.get("logger", {}));
    this.cron = createCronService();
    this.telemetry = createTelemetryInstance(this);
    this.requestContext = requestCtx;
    this.customFields = createCustomFields(this);
    this.fetch = createStrapiFetch(this);
    this.features = createFeaturesService(this);
    createUpdateNotifier(this).notify();
    Object.defineProperty(this, "EE", {
      get: () => {
        EE.init(this.dirs.app.root, this.log);
        return EE.isEE;
      },
      configurable: false
    });
  }
  get config() {
    return this.container.get("config");
  }
  get services() {
    return this.container.get("services").getAll();
  }
  service(uid) {
    return this.container.get("services").get(uid);
  }
  get controllers() {
    return this.container.get("controllers").getAll();
  }
  controller(uid) {
    return this.container.get("controllers").get(uid);
  }
  get contentTypes() {
    return this.container.get("content-types").getAll();
  }
  contentType(name) {
    return this.container.get("content-types").get(name);
  }
  get policies() {
    return this.container.get("policies").getAll();
  }
  policy(name) {
    return this.container.get("policies").get(name);
  }
  get middlewares() {
    return this.container.get("middlewares").getAll();
  }
  middleware(name) {
    return this.container.get("middlewares").get(name);
  }
  get plugins() {
    return this.container.get("plugins").getAll();
  }
  plugin(name) {
    return this.container.get("plugins").get(name);
  }
  get hooks() {
    return this.container.get("hooks").getAll();
  }
  hook(name) {
    return this.container.get("hooks").get(name);
  }
  // api(name) {
  //   return this.container.get('apis').get(name);
  // }
  get api() {
    return this.container.get("apis").getAll();
  }
  get auth() {
    return this.container.get("auth");
  }
  get contentAPI() {
    return this.container.get("content-api");
  }
  get sanitizers() {
    return this.container.get("sanitizers");
  }
  get validators() {
    return this.container.get("validators");
  }
  async start() {
    try {
      if (!this.isLoaded) {
        await this.load();
      }
      await this.listen();
      return this;
    } catch (error) {
      return this.stopWithError(error);
    }
  }
  async destroy() {
    await this.server.destroy();
    await this.runLifecyclesFunctions(LIFECYCLES.DESTROY);
    this.eventHub.destroy();
    await this.db?.destroy();
    this.telemetry.destroy();
    this.cron.destroy();
    process.removeAllListeners();
    delete global.strapi;
  }
  sendStartupTelemetry() {
    this.telemetry.send("didStartServer", {
      groupProperties: {
        database: this.config.get("database.connection.client"),
        plugins: Object.keys(this.plugins),
        numberOfAllContentTypes: _.size(this.contentTypes),
        // TODO: V5: This event should be renamed numberOfContentTypes in V5 as the name is already taken to describe the number of content types using i18n.
        numberOfComponents: _.size(this.components),
        numberOfDynamicZones: getNumberOfDynamicZones(),
        numberOfCustomControllers: Object.values(this.controllers).filter(
          // TODO: Fix this at the content API loader level to prevent future types issues
          (controller) => controller !== void 0 && isCustomController(controller)
        ).length,
        environment: this.config.environment
        // TODO: to add back
        // providers: this.config.installedProviders,
      }
    }).catch(this.log.error);
  }
  async openAdmin({ isInitialized: isInitialized2 }) {
    const shouldOpenAdmin = this.config.get("environment") === "development" && this.config.get("admin.autoOpen", true) !== false;
    if (shouldOpenAdmin && !isInitialized2) {
      try {
        await openBrowser(this.config);
        this.telemetry.send("didOpenTab");
      } catch (e) {
        this.telemetry.send("didNotOpenTab");
      }
    }
  }
  async postListen() {
    const isInitialized$1 = await isInitialized(this);
    this.startupLogger.logStartupMessage({ isInitialized: isInitialized$1 });
    this.sendStartupTelemetry();
    this.openAdmin({ isInitialized: isInitialized$1 });
  }
  /**
   * Add behaviors to the server
   */
  async listen() {
    return new Promise((resolve, reject) => {
      const onListen = async () => {
        try {
          await this.postListen();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      const listenSocket = this.config.get("server.socket");
      if (listenSocket) {
        this.server.listen(listenSocket, onListen);
      } else {
        const { host, port } = this.config.get("server");
        this.server.listen(port, host, onListen);
      }
    });
  }
  stopWithError(err, customMessage) {
    this.log.debug(`⛔️ Server wasn't able to start properly.`);
    if (customMessage) {
      this.log.error(customMessage);
    }
    this.log.error(err);
    return this.stop();
  }
  stop(exitCode = 1) {
    this.destroy();
    if (this.config.get("autoReload")) {
      process.send?.("stop");
    }
    process.exit(exitCode);
  }
  async loadAdmin() {
    await loaders.loadAdmin(this);
  }
  async loadPlugins() {
    await loaders.loadPlugins(this);
  }
  async loadPolicies() {
    await loaders.loadPolicies(this);
  }
  async loadAPIs() {
    await loaders.loadAPIs(this);
  }
  async loadComponents() {
    this.components = await loaders.loadComponents(this);
  }
  async loadMiddlewares() {
    await loaders.loadMiddlewares(this);
  }
  async loadApp() {
    this.app = await loaders.loadSrcIndex(this);
  }
  async loadSanitizers() {
    await loaders.loadSanitizers(this);
  }
  async loadValidators() {
    await loaders.loadValidators(this);
  }
  registerInternalHooks() {
    this.container.get("hooks").set("strapi::content-types.beforeSync", hooks.createAsyncParallelHook());
    this.container.get("hooks").set("strapi::content-types.afterSync", hooks.createAsyncParallelHook());
    this.hook("strapi::content-types.beforeSync").register(disableDraftAndPublish);
    this.hook("strapi::content-types.afterSync").register(enableDraftAndPublish);
  }
  async register() {
    await Promise.all([
      this.loadApp(),
      this.loadSanitizers(),
      this.loadValidators(),
      this.loadPlugins(),
      this.loadAdmin(),
      this.loadAPIs(),
      this.loadComponents(),
      this.loadMiddlewares(),
      this.loadPolicies()
    ]);
    await bootstrap({ strapi: this });
    this.webhookRunner = createWebhookRunner({
      eventHub: this.eventHub,
      logger: this.log,
      configuration: this.config.get("server.webhooks", {}),
      fetch: this.fetch
    });
    this.registerInternalHooks();
    this.telemetry.register();
    await this.runLifecyclesFunctions(LIFECYCLES.REGISTER);
    convertCustomFieldType(this);
    return this;
  }
  async bootstrap() {
    const contentTypes = [
      coreStoreModel,
      webhookModel,
      ...Object.values(this.contentTypes),
      ...Object.values(this.components)
    ];
    this.db = await Database.init({
      ...this.config.get("database"),
      models: Database.transformContentTypes(contentTypes)
    });
    this.store = createCoreStore({ db: this.db });
    this.webhookStore = createWebhookStore({ db: this.db });
    this.entityValidator = entityValidator;
    this.entityService = createEntityService({
      strapi: this,
      db: this.db,
      eventHub: this.eventHub,
      entityValidator: this.entityValidator
    });
    if (this.config.get("server.cron.enabled", true)) {
      const cronTasks = this.config.get("server.cron.tasks", {});
      this.cron.add(cronTasks);
    }
    this.telemetry.bootstrap();
    let oldContentTypes;
    if (await this.db.getSchemaConnection().hasTable(coreStoreModel.collectionName)) {
      oldContentTypes = await this.store.get({
        type: "strapi",
        name: "content_types",
        key: "schema"
      });
    }
    await this.hook("strapi::content-types.beforeSync").call({
      oldContentTypes,
      contentTypes: this.contentTypes
    });
    await this.db.schema.sync();
    if (this.EE) {
      await EE.checkLicense({ strapi: this });
    }
    await this.hook("strapi::content-types.afterSync").call({
      oldContentTypes,
      contentTypes: this.contentTypes
    });
    await this.store.set({
      type: "strapi",
      name: "content_types",
      key: "schema",
      value: this.contentTypes
    });
    await this.startWebhooks();
    await this.server.initMiddlewares();
    this.server.initRouting();
    await this.contentAPI.permissions.registerActions();
    await this.runLifecyclesFunctions(LIFECYCLES.BOOTSTRAP);
    this.cron.start();
    return this;
  }
  async load() {
    await this.register();
    await this.bootstrap();
    this.isLoaded = true;
    return this;
  }
  async startWebhooks() {
    const webhooks = await this.webhookStore?.findWebhooks();
    if (!webhooks) {
      return;
    }
    for (const webhook of webhooks) {
      this.webhookRunner?.add(webhook);
    }
  }
  async runLifecyclesFunctions(lifecycleName) {
    await this.container.get("modules")[lifecycleName]();
    const adminLifecycleFunction = this.admin && this.admin[lifecycleName];
    if (isFunction(adminLifecycleFunction)) {
      await adminLifecycleFunction({ strapi: this });
    }
    const userLifecycleFunction = this.app && this.app[lifecycleName];
    if (isFunction(userLifecycleFunction)) {
      await userLifecycleFunction({ strapi: this });
    }
  }
  getModel(uid) {
    if (uid in this.contentTypes) {
      return this.contentTypes[uid];
    }
    if (uid in this.components) {
      return this.components[uid];
    }
  }
  /**
   * Binds queries with a specific model
   * @param {string} uid
   */
  query(uid) {
    return this.db.query(uid);
  }
}
const initFn = (options = {}) => {
  const strapi = new Strapi(options);
  global.strapi = strapi;
  return strapi;
};
const init = Object.assign(initFn, { factories, compile });
export {
  init as default
};
//# sourceMappingURL=Strapi.mjs.map
