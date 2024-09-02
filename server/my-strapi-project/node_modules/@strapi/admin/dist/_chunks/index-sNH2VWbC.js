"use strict";
const EE = require("@strapi/strapi/dist/utils/ee");
const tsUtils = require("@strapi/typescript-utils");
const os = require("node:os");
const fs = require("node:fs/promises");
const path = require("node:path");
const inquirer = require("inquirer");
const semver = require("semver");
const resolveFrom = require("resolve-from");
const execa = require("execa");
const readPkgUp = require("read-pkg-up");
const perf_hooks = require("perf_hooks");
const outdent = require("outdent");
const prettier = require("prettier");
const react = require("react");
const server = require("react-dom/server");
const jsxRuntime = require("react/jsx-runtime");
const browserslist = require("browserslist");
const strapiFactory = require("@strapi/strapi");
const utils = require("@strapi/utils");
const dotenv = require("dotenv");
const node = require("esbuild-register/dist/node");
const fs$1 = require("node:fs");
const camelCase = require("lodash/camelCase");
const boxen = require("boxen");
const chalk = require("chalk");
const chokidar = require("chokidar");
const cluster = require("node:cluster");
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
const EE__default = /* @__PURE__ */ _interopDefault(EE);
const tsUtils__namespace = /* @__PURE__ */ _interopNamespace(tsUtils);
const os__default = /* @__PURE__ */ _interopDefault(os);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const semver__default = /* @__PURE__ */ _interopDefault(semver);
const resolveFrom__default = /* @__PURE__ */ _interopDefault(resolveFrom);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const readPkgUp__default = /* @__PURE__ */ _interopDefault(readPkgUp);
const outdent__default = /* @__PURE__ */ _interopDefault(outdent);
const browserslist__default = /* @__PURE__ */ _interopDefault(browserslist);
const strapiFactory__default = /* @__PURE__ */ _interopDefault(strapiFactory);
const dotenv__default = /* @__PURE__ */ _interopDefault(dotenv);
const fs__default$1 = /* @__PURE__ */ _interopDefault(fs$1);
const camelCase__default = /* @__PURE__ */ _interopDefault(camelCase);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const chokidar__default = /* @__PURE__ */ _interopDefault(chokidar);
const cluster__default = /* @__PURE__ */ _interopDefault(cluster);
const build$1 = ({ command, ctx }) => {
  command.command("build").option("--bundler [bundler]", "Bundler to use (webpack or vite)", "webpack").option("--ignore-prompts", "Ignore all prompts", false).option("-d, --debug", "Enable debugging mode with verbose logs", false).option("--ignore-prompts", "Ignore all prompts", false).option("--minify", "Minify the output", true).option("--no-optimization", "[deprecated]: use minify instead").option("--silent", "Don't log anything", false).option("--sourcemap", "Produce sourcemaps", false).option("--stats", "Print build statistics to the console", false).description("Build the strapi admin app").action(async (options) => {
    const { build: build2 } = await Promise.resolve().then(() => require("./build-QRFarm0x.js"));
    return build2({ ...options, ...ctx });
  });
};
const develop$1 = ({ command, ctx }) => {
  command.command("develop").alias("dev").option("--bundler [bundler]", "Bundler to use (webpack or vite)", "webpack").option("--ignore-prompts", "Ignore all prompts", false).option("--watch-admin", "Watch the admin panel for hot changes", false).option("-d, --debug", "Enable debugging mode with verbose logs", false).option("--silent", "Don't log anything", false).option("--ignore-prompts", "Ignore all prompts", false).option("--polling", "Watch for file changes in network directories", false).option("--watch-admin", "Watch the admin panel for hot changes", false).option(
    "--no-build",
    "[deprecated]: there is middleware for the server, it is no longer a separate process"
  ).option(
    "--watch-admin",
    "[deprecated]: there is now middleware for watching, it is no longer a separate process"
  ).option("--browser <name>", "[deprecated]: use open instead").option("--open", "Open the admin in your browser", true).description("Start your Strapi application in development mode").action(async (options) => {
    const { develop: develop2 } = await Promise.resolve().then(() => require("./develop-YNTGWKMC.js"));
    return develop2({ ...options, ...ctx });
  });
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  build: build$1,
  develop: develop$1
}, Symbol.toStringTag, { value: "Module" }));
const getPackageManager = () => {
  const agent = process.env.npm_config_user_agent || "";
  if (agent.includes("yarn")) {
    return "yarn";
  }
  if (agent.includes("pnpm")) {
    return "pnpm";
  }
  if (/^npm\/\d/.test(agent)) {
    return "npm";
  }
  return void 0;
};
const PEER_DEPS = {
  react: "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^5.2.0",
  "styled-components": "^5.2.1"
};
const checkRequiredDependencies = async ({
  cwd,
  logger,
  ignorePrompts
}) => {
  const pkg = await readPkgUp__default.default({ cwd });
  if (!pkg) {
    throw new Error(`Could not find package.json at path: ${cwd}`);
  }
  logger.debug("Loaded package.json:", os__default.default.EOL, pkg.packageJson);
  const { install, review } = Object.entries(PEER_DEPS).reduce(
    (acc, [name, version]) => {
      if (!pkg.packageJson.dependencies) {
        throw new Error(`Could not find dependencies in package.json at path: ${cwd}`);
      }
      const declaredVersion = pkg.packageJson.dependencies[name];
      if (!declaredVersion) {
        acc.install.push({
          name,
          wantedVersion: version
        });
      } else {
        acc.review.push({
          name,
          wantedVersion: version,
          declaredVersion
        });
      }
      return acc;
    },
    {
      install: [],
      review: []
    }
  );
  if (install.length > 0) {
    logger.info(
      "The Strapi admin needs to install the following dependencies:",
      os__default.default.EOL,
      install.map(({ name, wantedVersion }) => `  - ${name}@${wantedVersion}`).join(os__default.default.EOL)
    );
    if (process.env.NODE_ENV !== "development" || ignorePrompts) {
      return { didInstall: false };
    }
    const { install: installAns } = await inquirer__default.default.prompt({
      type: "confirm",
      name: "install",
      default: true,
      message: "Would you like to install these dependencies now? These are not required but are recommended, from V5 these will be required."
    });
    if (installAns) {
      await installDependencies(install, {
        cwd,
        logger
      });
      const [file, ...args] = process.argv;
      await execa__default.default(file, args, { cwd, stdio: "inherit" });
      return { didInstall: true };
    } else {
      return { didInstall: false };
    }
  }
  if (review.length) {
    const errors = [];
    for (const dep of review) {
      let minDeclaredVersion = null;
      try {
        minDeclaredVersion = semver__default.default.minVersion(dep.declaredVersion);
      } catch (err) {
      }
      if (!minDeclaredVersion) {
        errors.push(
          `The declared dependency, ${dep.name} has an invalid version in package.json: ${dep.declaredVersion}`
        );
      } else if (!semver__default.default.satisfies(minDeclaredVersion, dep.wantedVersion)) {
        logger.warn(
          [
            `Declared version of ${dep.name} (${minDeclaredVersion}) is not compatible with the version required by Strapi (${dep.wantedVersion}).`,
            "You may experience issues, we recommend you change this."
          ].join(os__default.default.EOL)
        );
      }
      const installedVersion = await getModuleVersion(dep.name, cwd);
      if (!installedVersion) {
        errors.push(
          `The declared dependency, ${dep.name} is not installed. You should install before re-running this command`
        );
      } else if (!semver__default.default.satisfies(installedVersion, dep.wantedVersion)) {
        logger.warn(
          [
            `Declared version of ${dep.name} (${installedVersion}) is not compatible with the version required by Strapi (${dep.wantedVersion}).`,
            "You may experience issues, we recommend you change this."
          ].join(os__default.default.EOL)
        );
      }
    }
    if (errors.length > 0 && process.env.NODE_ENV === "development") {
      throw new Error(`${os__default.default.EOL}- ${errors.join(`${os__default.default.EOL}- `)}`);
    }
  }
  return { didInstall: false };
};
const getModule = async (name, cwd) => {
  const modulePackagePath = resolveFrom__default.default.silent(cwd, path__default.default.join(name, "package.json"));
  if (!modulePackagePath) {
    return null;
  }
  const file = await fs__default.default.readFile(modulePackagePath, "utf8").then((res) => JSON.parse(res));
  return file;
};
const getModuleVersion = async (name, cwd) => {
  const pkg = await getModule(name, cwd);
  return pkg?.version || null;
};
const installDependencies = async (install, { cwd, logger }) => {
  const packageManager = getPackageManager();
  if (!packageManager) {
    logger.error(
      "Could not find a supported package manager, please install the dependencies manually."
    );
    process.exit(1);
  }
  const execOptions = {
    encoding: "utf8",
    cwd,
    stdio: "inherit"
  };
  const packages = install.map(({ name, wantedVersion }) => `${name}@${wantedVersion}`);
  let result;
  if (packageManager === "npm") {
    const npmArgs = ["install", "--legacy-peer-deps", "--save", ...packages];
    logger.info(`Running 'npm ${npmArgs.join(" ")}'`);
    result = await execa__default.default("npm", npmArgs, execOptions);
  } else if (packageManager === "yarn") {
    const yarnArgs = ["add", ...packages];
    logger.info(`Running 'yarn ${yarnArgs.join(" ")}'`);
    result = await execa__default.default("yarn", yarnArgs, execOptions);
  } else if (packageManager === "pnpm") {
    const pnpmArgs = ["add", "--save-prod", ...packages];
    logger.info(`Running 'pnpm ${pnpmArgs.join(" ")}'`);
    result = await execa__default.default("pnpm", pnpmArgs, execOptions);
  }
  if (result?.exitCode || result?.failed) {
    throw new Error("Package installation failed");
  }
};
function getTimer() {
  const timings = {};
  const startTimes = {};
  function start(name) {
    if (typeof startTimes[name] !== "undefined") {
      throw new Error(`Timer "${name}" already started, cannot overwrite`);
    }
    startTimes[name] = perf_hooks.performance.now();
  }
  function end(name) {
    if (typeof startTimes[name] === "undefined") {
      throw new Error(`Timer "${name}" never started, cannot end`);
    }
    timings[name] = perf_hooks.performance.now() - startTimes[name];
    return timings[name];
  }
  return { start, end, getTimings: () => timings };
}
const prettyTime = (timeInMs) => {
  return Math.ceil(timeInMs) + "ms";
};
const styles = `
.strapi--root {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
}

.strapi--no-js {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: helvetica, arial, sans-serif;
}
`;
const NoJavascript = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("noscript", { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "strapi--root", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "strapi--no-js", children: [
    /* @__PURE__ */ jsxRuntime.jsx("style", { type: "text/css", children: styles }),
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "JavaScript disabled" }),
    /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
      "Please ",
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "https://www.enable-javascript.com/", children: "enable JavaScript" }),
      " in your browser and reload the page to proceed."
    ] })
  ] }) }) });
};
const globalStyles = `
  html,
  body,
  #strapi {
    height: 100%;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
`;
const DefaultDocument = ({ entryPath }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "robots", content: "noindex" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "referrer", content: "same-origin" }),
      /* @__PURE__ */ jsxRuntime.jsx("title", { children: "Strapi Admin" }),
      /* @__PURE__ */ jsxRuntime.jsx("style", { children: globalStyles })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { id: "strapi" }),
      /* @__PURE__ */ jsxRuntime.jsx(NoJavascript, {}),
      entryPath ? /* @__PURE__ */ jsxRuntime.jsx("script", { type: "module", src: entryPath }) : null
    ] })
  ] });
};
const getEntryModule = (ctx) => {
  const pluginsObject = ctx.plugins.map(({ name, importName }) => `'${name}': ${importName}`).join(",\n");
  const pluginsImport = ctx.plugins.map(({ importName, modulePath }) => `import ${importName} from '${modulePath}';`).join("\n");
  return outdent__default.default`
        /**
         * This file was automatically generated by Strapi.
         * Any modifications made will be discarded.
         */
        ${pluginsImport}
        import { renderAdmin } from "@strapi/strapi/admin"

        ${ctx.customisations?.modulePath ? `import customisations from '${ctx.customisations.modulePath}'` : ""}

        renderAdmin(
          document.getElementById("strapi"),
          {
            ${ctx.customisations?.modulePath ? "customisations," : ""}
            ${ctx.features ? `features: ${JSON.stringify(ctx.features)},` : ""}
            plugins: {
        ${pluginsObject}
            }
        })
      `;
};
const getDocumentHTML = ({ logger, props = {} }) => {
  const result = server.renderToStaticMarkup(react.createElement(DefaultDocument, props));
  logger.debug("Rendered the HTML");
  return outdent__default.default`<!DOCTYPE html>${result}`;
};
const AUTO_GENERATED_WARNING = `
This file was automatically generated by Strapi.
Any modifications made will be discarded.
`.trim();
const decorateHTMLWithAutoGeneratedWarning = (htmlTemplate) => htmlTemplate.replace(/<head/, `
<!--
${AUTO_GENERATED_WARNING}
-->
<head`);
const writeStaticClientFiles = async (ctx) => {
  await fs__default.default.mkdir(ctx.runtimeDir, { recursive: true });
  ctx.logger.debug("Created the runtime directory");
  const indexHtml = decorateHTMLWithAutoGeneratedWarning(
    await getDocumentHTML({
      logger: ctx.logger,
      props: ctx.bundler === "vite" ? {
        entryPath: `/${ctx.entry}`
      } : void 0
    })
  );
  await fs__default.default.writeFile(
    path__default.default.join(ctx.runtimeDir, "index.html"),
    prettier.format(indexHtml, {
      parser: "html"
    })
  );
  ctx.logger.debug("Wrote the index.html file");
  await fs__default.default.writeFile(
    path__default.default.join(ctx.runtimeDir, "app.js"),
    prettier.format(getEntryModule(ctx), {
      parser: "babel"
    })
  );
  ctx.logger.debug("Wrote the app.js file");
};
const pathExists = async (path2) => {
  try {
    await fs.access(path2);
    return true;
  } catch (error) {
    return false;
  }
};
const loadFile = async (path2) => {
  if (await pathExists(path2)) {
    const esbuildOptions = {
      extensions: [".js", ".mjs", ".ts"]
    };
    const { unregister } = node.register(esbuildOptions);
    const mod = require(path2);
    unregister();
    const file = mod?.default || mod || void 0;
    return file;
  }
  return void 0;
};
const convertSystemPathToModulePath = (sysPath) => {
  if (process.platform === "win32") {
    return sysPath.split(path__default.default.sep).join(path__default.default.posix.sep);
  } else {
    return sysPath;
  }
};
const convertModulePathToSystemPath = (modulePath) => {
  if (process.platform === "win32") {
    return modulePath.split(path__default.default.posix.sep).join(path__default.default.sep);
  } else {
    return modulePath;
  }
};
const loadEnv = async (cwd) => {
  const pathToEnv = path__default.default.resolve(cwd, ".env");
  if (await pathExists(pathToEnv)) {
    dotenv__default.default.config({ path: pathToEnv });
  }
};
const getStrapiAdminEnvVars = (defaultEnv) => {
  return Object.keys(process.env).filter((key) => key.toUpperCase().startsWith("STRAPI_ADMIN_")).reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, defaultEnv);
};
const isError = (err) => err instanceof Error;
const handleUnexpectedError = (err) => {
  console.error(
    chalk__default.default.red(
      `[ERROR] `,
      "There seems to be an unexpected error, try again with --debug for more information",
      os__default.default.EOL
    )
  );
  if (isError(err) && err.stack) {
    console.log(
      chalk__default.default.red(
        boxen__default.default(err.stack, {
          padding: 1,
          align: "left"
        })
      )
    );
  }
  process.exit(1);
};
const validatePackageHasStrapi = (pkg) => "strapi" in pkg && typeof pkg.strapi === "object" && !Array.isArray(pkg.strapi) && pkg.strapi !== null;
const validatePackageIsPlugin = (pkg) => validatePackageHasStrapi(pkg) && pkg.strapi.kind === "plugin";
const getEnabledPlugins = async ({
  cwd,
  logger,
  runtimeDir,
  strapi
}) => {
  const plugins = {};
  const deps = strapi.config.get("info.dependencies", {});
  logger.debug("Dependencies from user's project", os__default.default.EOL, deps);
  for (const dep of Object.keys(deps)) {
    const pkg = await getModule(dep, cwd);
    if (pkg && validatePackageIsPlugin(pkg)) {
      const name = pkg.strapi.name || pkg.name;
      if (!name) {
        throw Error(
          "You're trying to import a plugin that doesn't have a name – check the package.json of that plugin!"
        );
      }
      plugins[name] = {
        name,
        importName: camelCase__default.default(name),
        type: "module",
        modulePath: dep
      };
    }
  }
  const userPluginsFile = await loadUserPluginsFile(strapi.dirs.app.config);
  logger.debug("User's plugins file", os__default.default.EOL, userPluginsFile);
  for (const [userPluginName, userPluginConfig] of Object.entries(userPluginsFile)) {
    if (userPluginConfig.enabled && userPluginConfig.resolve) {
      const sysPath = convertModulePathToSystemPath(userPluginConfig.resolve);
      plugins[userPluginName] = {
        name: userPluginName,
        importName: camelCase__default.default(userPluginName),
        type: "local",
        /**
         * User plugin paths are resolved from the entry point
         * of the app, because that's how you import them.
         */
        modulePath: convertSystemPathToModulePath(path__default.default.relative(runtimeDir, sysPath)),
        path: sysPath
      };
    }
  }
  return plugins;
};
const PLUGIN_CONFIGS = ["plugins.js", "plugins.mjs", "plugins.ts"];
const loadUserPluginsFile = async (root) => {
  for (const file of PLUGIN_CONFIGS) {
    const filePath = path__default.default.join(root, file);
    const configFile = await loadFile(filePath);
    if (configFile) {
      return typeof configFile === "function" ? configFile({ env: utils.env }) : configFile;
    }
  }
  return {};
};
const getMapOfPluginsWithAdmin = (plugins) => Object.values(plugins).filter((plugin) => {
  if (!plugin) {
    return false;
  }
  try {
    const isLocalPluginWithLegacyAdminFile = plugin.path && fs__default$1.default.existsSync(path__default.default.join(plugin.path, "strapi-admin.js"));
    if (!isLocalPluginWithLegacyAdminFile) {
      const isModuleWithFE = require.resolve(`${plugin.modulePath}/strapi-admin`);
      return isModuleWithFE;
    }
    return isLocalPluginWithLegacyAdminFile;
  } catch (err) {
    if (isError(err) && "code" in err && (err.code === "MODULE_NOT_FOUND" || err.code === "ERR_PACKAGE_PATH_NOT_EXPORTED")) {
      return false;
    }
    throw err;
  }
}).map((plugin) => ({
  ...plugin,
  modulePath: `${plugin.modulePath}/strapi-admin`
}));
const ADMIN_APP_FILES = ["app.js", "app.mjs", "app.ts", "app.jsx", "app.tsx"];
const loadUserAppFile = async ({
  runtimeDir,
  appDir
}) => {
  for (const file of ADMIN_APP_FILES) {
    const filePath = path__default.default.join(appDir, "src", "admin", file);
    if (await pathExists(filePath)) {
      return {
        path: filePath,
        modulePath: convertSystemPathToModulePath(path__default.default.relative(runtimeDir, filePath))
      };
    }
  }
  return void 0;
};
const DEFAULT_BROWSERSLIST = [
  "last 3 major versions",
  "Firefox ESR",
  "last 2 Opera versions",
  "not dead"
];
const createBuildContext = async ({
  cwd,
  logger,
  tsconfig,
  strapi,
  options = {}
}) => {
  const strapiInstance = strapi ?? strapiFactory__default.default({
    // Directories
    appDir: cwd,
    distDir: tsconfig?.config.options.outDir ?? "",
    // Options
    autoReload: true,
    serveAdminPanel: false
  });
  const { serverUrl, adminPath } = utils.getConfigUrls(strapiInstance.config, true);
  const appDir = strapiInstance.dirs.app.root;
  await loadEnv(cwd);
  const env = getStrapiAdminEnvVars({
    ADMIN_PATH: adminPath,
    STRAPI_ADMIN_BACKEND_URL: serverUrl,
    STRAPI_TELEMETRY_DISABLED: String(strapiInstance.telemetry.isDisabled)
  });
  const envKeys = Object.keys(env);
  if (envKeys.length > 0) {
    logger.info(
      [
        "Including the following ENV variables as part of the JS bundle:",
        ...envKeys.map((key) => `    - ${key}`)
      ].join(os__default.default.EOL)
    );
  }
  const distPath = path__default.default.join(strapiInstance.dirs.dist.root, "build");
  const distDir = path__default.default.relative(cwd, distPath);
  try {
    logger.debug(`Cleaning dist folder: ${distPath}`);
    await fs__default.default.rm(distPath, { recursive: true, force: true });
    logger.debug("Cleaned dist folder");
  } catch {
    logger.debug("There was no dist folder to clean");
  }
  const runtimeDir = path__default.default.join(cwd, ".strapi", "client");
  const entry = path__default.default.relative(cwd, path__default.default.join(runtimeDir, "app.js"));
  const plugins = await getEnabledPlugins({ cwd, logger, runtimeDir, strapi: strapiInstance });
  logger.debug("Enabled plugins", os__default.default.EOL, plugins);
  const pluginsWithFront = getMapOfPluginsWithAdmin(plugins);
  logger.debug("Enabled plugins with FE", os__default.default.EOL, pluginsWithFront);
  const target = browserslist__default.default.loadConfig({ path: cwd }) ?? DEFAULT_BROWSERSLIST;
  const customisations = await loadUserAppFile({ appDir, runtimeDir });
  const features = strapiInstance.config.get("features", void 0);
  const { bundler = "webpack", ...restOptions } = options;
  const buildContext = {
    appDir,
    basePath: `${adminPath}/`,
    bundler,
    customisations,
    cwd,
    distDir,
    distPath,
    entry,
    env,
    logger,
    options: restOptions,
    plugins: pluginsWithFront,
    runtimeDir,
    strapi: strapiInstance,
    target,
    tsconfig,
    features
  };
  return buildContext;
};
const build = async ({ logger, cwd, tsconfig, ignorePrompts, ...options }) => {
  const timer = getTimer();
  const { didInstall } = await checkRequiredDependencies({ cwd, logger, ignorePrompts }).catch(
    (err) => {
      logger.error(err.message);
      process.exit(1);
    }
  );
  if (didInstall) {
    return;
  }
  if (tsconfig?.config) {
    timer.start("compilingTS");
    const compilingTsSpinner = logger.spinner(`Compiling TS`).start();
    tsUtils__namespace.compile(cwd, { configOptions: { ignoreDiagnostics: false } });
    const compilingDuration = timer.end("compilingTS");
    compilingTsSpinner.text = `Compiling TS (${prettyTime(compilingDuration)})`;
    compilingTsSpinner.succeed();
  }
  timer.start("createBuildContext");
  const contextSpinner = logger.spinner(`Building build context`).start();
  console.log("");
  const ctx = await createBuildContext({
    cwd,
    logger,
    tsconfig,
    options
  });
  const contextDuration = timer.end("createBuildContext");
  contextSpinner.text = `Building build context (${prettyTime(contextDuration)})`;
  contextSpinner.succeed();
  timer.start("buildAdmin");
  const buildingSpinner = logger.spinner(`Building admin panel`).start();
  console.log("");
  try {
    EE__default.default.init(cwd);
    await writeStaticClientFiles(ctx);
    if (ctx.bundler === "webpack") {
      const { build: buildWebpack } = await Promise.resolve().then(() => require("./build-bnYNP-fZ.js"));
      await buildWebpack(ctx);
    } else if (ctx.bundler === "vite") {
      const { build: buildVite } = await Promise.resolve().then(() => require("./build-UkKhySt2.js"));
      await buildVite(ctx);
    }
    const buildDuration = timer.end("buildAdmin");
    buildingSpinner.text = `Building admin panel (${prettyTime(buildDuration)})`;
    buildingSpinner.succeed();
  } catch (err) {
    buildingSpinner.fail();
    throw err;
  }
};
const cleanupDistDirectory = async ({
  tsconfig,
  logger,
  timer
}) => {
  const distDir = tsconfig?.config?.options?.outDir;
  if (!distDir || // we don't have a dist dir
  await fs__default.default.access(distDir).then(() => false).catch(() => true)) {
    return;
  }
  const timerName = "cleaningDist" + Date.now();
  timer.start(timerName);
  const cleaningSpinner = logger.spinner(`Cleaning dist dir ${distDir}`).start();
  try {
    const dirContent = await fs__default.default.readdir(distDir);
    const validFilenames = dirContent.filter((filename) => filename !== "build");
    for (const filename of validFilenames) {
      await fs__default.default.rm(path__default.default.resolve(distDir, filename), { recursive: true });
    }
  } catch (err) {
    const generatingDuration2 = timer.end(timerName);
    cleaningSpinner.text = `Error cleaning dist dir: ${err} (${prettyTime(generatingDuration2)})`;
    cleaningSpinner?.fail();
    return;
  }
  const generatingDuration = timer.end(timerName);
  cleaningSpinner.text = `Cleaning dist dir (${prettyTime(generatingDuration)})`;
  cleaningSpinner?.succeed();
};
const develop = async ({
  cwd,
  polling,
  logger,
  tsconfig,
  ignorePrompts,
  watchAdmin,
  ...options
}) => {
  const timer = getTimer();
  if (cluster__default.default.isPrimary) {
    const { didInstall } = await checkRequiredDependencies({ cwd, logger, ignorePrompts }).catch(
      (err) => {
        logger.error(err.message);
        process.exit(1);
      }
    );
    if (didInstall) {
      return;
    }
    if (tsconfig?.config) {
      await cleanupDistDirectory({ tsconfig, logger, timer });
      await tsUtils__namespace.compile(cwd, { configOptions: { ignoreDiagnostics: true } });
    }
    if (!watchAdmin) {
      timer.start("createBuildContext");
      const contextSpinner = logger.spinner(`Building build context`).start();
      console.log("");
      const ctx = await createBuildContext({
        cwd,
        logger,
        tsconfig,
        options
      });
      const contextDuration = timer.end("createBuildContext");
      contextSpinner.text = `Building build context (${prettyTime(contextDuration)})`;
      contextSpinner.succeed();
      timer.start("creatingAdmin");
      const adminSpinner = logger.spinner(`Creating admin`).start();
      EE__default.default.init(cwd);
      await writeStaticClientFiles(ctx);
      if (ctx.bundler === "webpack") {
        const { build: buildWebpack } = await Promise.resolve().then(() => require("./build-bnYNP-fZ.js"));
        await buildWebpack(ctx);
      } else if (ctx.bundler === "vite") {
        const { build: buildVite } = await Promise.resolve().then(() => require("./build-UkKhySt2.js"));
        await buildVite(ctx);
      }
      const adminDuration = timer.end("creatingAdmin");
      adminSpinner.text = `Creating admin (${prettyTime(adminDuration)})`;
      adminSpinner.succeed();
    }
    cluster__default.default.on("message", async (worker, message) => {
      switch (message) {
        case "reload": {
          if (tsconfig?.config) {
            await cleanupDistDirectory({ tsconfig, logger, timer });
            await tsUtils__namespace.compile(cwd, { configOptions: { ignoreDiagnostics: true } });
          }
          logger.debug("cluster has the reload message, sending the worker kill message");
          worker.send("kill");
          break;
        }
        case "killed": {
          logger.debug("cluster has the killed message, forking the cluster");
          cluster__default.default.fork();
          break;
        }
        case "stop": {
          process.exit(1);
          break;
        }
      }
    });
    cluster__default.default.fork();
  }
  if (cluster__default.default.isWorker) {
    timer.start("loadStrapi");
    const loadStrapiSpinner = logger.spinner(`Loading Strapi`).start();
    const strapi = strapiFactory__default.default({
      appDir: cwd,
      distDir: tsconfig?.config.options.outDir ?? "",
      autoReload: true,
      serveAdminPanel: !watchAdmin
    });
    let bundleWatcher;
    if (watchAdmin) {
      timer.start("createBuildContext");
      const contextSpinner = logger.spinner(`Building build context`).start();
      console.log("");
      const ctx = await createBuildContext({
        cwd,
        logger,
        strapi,
        tsconfig,
        options
      });
      const contextDuration = timer.end("createBuildContext");
      contextSpinner.text = `Building build context (${prettyTime(contextDuration)})`;
      contextSpinner.succeed();
      timer.start("creatingAdmin");
      const adminSpinner = logger.spinner(`Creating admin`).start();
      EE__default.default.init(cwd);
      await writeStaticClientFiles(ctx);
      if (ctx.bundler === "webpack") {
        const { watch: watchWebpack } = await Promise.resolve().then(() => require("./watch-IKaZxKoL.js"));
        bundleWatcher = await watchWebpack(ctx);
      } else if (ctx.bundler === "vite") {
        const { watch: watchVite } = await Promise.resolve().then(() => require("./watch-ZVMgmXK1.js"));
        bundleWatcher = await watchVite(ctx);
      }
      const adminDuration = timer.end("creatingAdmin");
      adminSpinner.text = `Creating admin (${prettyTime(adminDuration)})`;
      adminSpinner.succeed();
    }
    const strapiInstance = await strapi.load();
    const loadStrapiDuration = timer.end("loadStrapi");
    loadStrapiSpinner.text = `Loading Strapi (${prettyTime(loadStrapiDuration)})`;
    loadStrapiSpinner.succeed();
    if (tsconfig?.config || strapi.config.get("typescript.autogenerate") !== false) {
      timer.start("generatingTS");
      const generatingTsSpinner = logger.spinner(`Generating types`).start();
      await tsUtils__namespace.generators.generate({
        strapi: strapiInstance,
        pwd: cwd,
        rootDir: void 0,
        logger: { silent: true, debug: false },
        artifacts: { contentTypes: true, components: true }
      });
      const generatingDuration = timer.end("generatingTS");
      generatingTsSpinner.text = `Generating types (${prettyTime(generatingDuration)})`;
      generatingTsSpinner.succeed();
    }
    if (tsconfig?.config) {
      timer.start("compilingTS");
      const compilingTsSpinner = logger.spinner(`Compiling TS`).start();
      await cleanupDistDirectory({ tsconfig, logger, timer });
      await tsUtils__namespace.compile(cwd, { configOptions: { ignoreDiagnostics: false } });
      const compilingDuration = timer.end("compilingTS");
      compilingTsSpinner.text = `Compiling TS (${prettyTime(compilingDuration)})`;
      compilingTsSpinner.succeed();
    }
    const restart = async () => {
      if (strapiInstance.reload.isWatching && !strapiInstance.reload.isReloading) {
        strapiInstance.reload.isReloading = true;
        strapiInstance.reload();
      }
    };
    const watcher = chokidar__default.default.watch(cwd, {
      ignoreInitial: true,
      usePolling: polling,
      ignored: [
        /(^|[/\\])\../,
        // dot files
        /tmp/,
        "**/src/admin/**",
        "**/src/plugins/**/admin/**",
        "**/dist/src/plugins/test/admin/**",
        "**/documentation",
        "**/documentation/**",
        "**/node_modules",
        "**/node_modules/**",
        "**/plugins.json",
        "**/build",
        "**/build/**",
        "**/index.html",
        "**/public",
        "**/public/**",
        strapiInstance.dirs.static.public,
        utils.joinBy("/", strapiInstance.dirs.static.public, "**"),
        "**/*.db*",
        "**/exports/**",
        "**/dist/**",
        "**/*.d.ts",
        "**/.yalc/**",
        "**/yalc.lock",
        ...strapiInstance.config.get("admin.watchIgnoreFiles", [])
      ]
    }).on("add", (path2) => {
      strapiInstance.log.info(`File created: ${path2}`);
      restart();
    }).on("change", (path2) => {
      strapiInstance.log.info(`File changed: ${path2}`);
      restart();
    }).on("unlink", (path2) => {
      strapiInstance.log.info(`File deleted: ${path2}`);
      restart();
    });
    process.on("message", async (message) => {
      switch (message) {
        case "kill": {
          logger.debug(
            "child process has the kill message, destroying the strapi instance and sending the killed process message"
          );
          await watcher.close();
          await strapiInstance.destroy();
          if (bundleWatcher) {
            bundleWatcher.close();
          }
          process.send?.("killed");
          break;
        }
      }
    });
    strapiInstance.start();
  }
};
exports.build = build;
exports.develop = develop;
exports.getDocumentHTML = getDocumentHTML;
exports.handleUnexpectedError = handleUnexpectedError;
exports.index = index;
exports.isError = isError;
exports.loadFile = loadFile;
//# sourceMappingURL=index-sNH2VWbC.js.map
