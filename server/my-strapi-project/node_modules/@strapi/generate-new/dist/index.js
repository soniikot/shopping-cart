"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_path = require("node:path");
const node_fs = require("node:fs");
const os = require("node:os");
const readline = require("node:readline");
const crypto = require("crypto");
const sentry = require("@sentry/node");
const hasYarn = require("./utils/has-yarn.js");
const checkRequirements = require("./utils/check-requirements.js");
const usage = require("./utils/usage.js");
const parseDbArguments = require("./utils/parse-db-arguments.js");
const generateNew = require("./generate-new.js");
const machineId = require("./utils/machine-id.js");
const checkInstallPath = require("./utils/check-install-path.js");
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
const os__default = /* @__PURE__ */ _interopDefault(os);
const readline__default = /* @__PURE__ */ _interopDefault(readline);
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const sentry__namespace = /* @__PURE__ */ _interopNamespace(sentry);
const packageJson = JSON.parse(node_fs.readFileSync(node_path.resolve(__dirname, "../package.json"), "utf8"));
const generateNewApp = (projectDirectory, options) => {
  sentry__namespace.init({
    dsn: "https://841d2b2c9b4d4b43a4cde92794cb705a@sentry.io/1762059"
  });
  checkRequirements();
  const rootPath = node_path.resolve(projectDirectory);
  const tmpPath = node_path.join(os__default.default.tmpdir(), `strapi${crypto__default.default.randomBytes(6).toString("hex")}`);
  const useNpm = options.useNpm !== void 0;
  const scope = {
    rootPath,
    name: node_path.basename(rootPath),
    // disable quickstart run app after creation
    runQuickstartApp: options.run !== false,
    // use pacakge version as strapiVersion (all packages have the same version);
    strapiVersion: packageJson.version,
    debug: options.debug !== void 0,
    quick: options.quickstart,
    template: options.template,
    packageJsonStrapi: {
      template: options.template,
      starter: options.starter
    },
    uuid: (process.env.STRAPI_UUID_PREFIX || "") + crypto__default.default.randomUUID(),
    docker: process.env.DOCKER === "true",
    deviceId: machineId(),
    tmpPath,
    // use yarn if available and --use-npm isn't true
    useYarn: !useNpm && hasYarn(),
    installDependencies: true,
    strapiDependencies: [
      "@strapi/strapi",
      "@strapi/plugin-users-permissions",
      "@strapi/plugin-i18n",
      "@strapi/plugin-cloud"
    ],
    additionalsDependencies: {
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      "react-router-dom": "5.3.4",
      "styled-components": "5.3.3"
    },
    useTypescript: Boolean(options.typescript)
  };
  sentry__namespace.configureScope(function configureScope(sentryScope) {
    const tags = {
      os: os__default.default.type(),
      osPlatform: os__default.default.platform(),
      osArch: os__default.default.arch(),
      osRelease: os__default.default.release(),
      version: scope.strapiVersion,
      nodeVersion: process.versions.node,
      docker: scope.docker
    };
    Object.keys(tags).forEach((tag) => {
      sentryScope.setTag(tag, tags[tag]);
    });
  });
  parseDbArguments({ scope, args: options });
  initCancelCatcher();
  return generateNew(scope).catch((error) => {
    console.error(error);
    return usage.captureException(error).then(() => {
      return usage.trackError({ scope, error }).then(() => {
        process.exit(1);
      });
    });
  });
};
function initCancelCatcher() {
  if (process.platform === "win32") {
    const rl = readline__default.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.on("SIGINT", function sigint() {
      process.emit("SIGINT");
    });
  }
  process.on("SIGINT", () => {
    process.exit(1);
  });
}
exports.checkInstallPath = checkInstallPath;
exports.generateNewApp = generateNewApp;
//# sourceMappingURL=index.js.map
