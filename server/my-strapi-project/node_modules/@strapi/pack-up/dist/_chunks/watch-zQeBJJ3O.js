"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const chokidar = require("chokidar");
const path = require("path");
const rxjs = require("rxjs");
const createBuildContext = require("./createBuildContext-teXLqX5U.js");
const errors = require("./errors-ov7Nr9g3.js");
const index = require("./index-D66XIRbD.js");
require("chalk");
require("fs/promises");
require("os");
require("pkg-up");
require("yup");
require("browserslist-to-esbuild");
require("esbuild-register/dist/node");
require("fs");
require("typescript");
require("boxen");
require("@vitejs/plugin-react-swc");
require("node:module");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const chokidar__default = /* @__PURE__ */ _interopDefault(chokidar);
const path__default = /* @__PURE__ */ _interopDefault(path);
const watch$1 = async (opts) => {
  const { silent, debug, cwd = process.cwd(), configFile = true, config: providedConfig } = opts;
  const logger = errors.createLogger({ silent, debug });
  logger.debug("watching config files");
  const configFilePaths = ["package.json", ...createBuildContext.CONFIG_FILE_NAMES].map(
    (fileName) => path__default.default.resolve(cwd, fileName).split(path__default.default.sep).join(path__default.default.posix.sep)
  );
  const watcher$ = new rxjs.Observable((subscriber) => {
    const watcher = chokidar__default.default.watch(configFilePaths, {
      ignoreInitial: true
    });
    const handleEvent = (event, filePath) => {
      subscriber.next({
        event,
        path: filePath
      });
    };
    watcher.on("all", handleEvent);
    return () => {
      watcher.off("all", handleEvent);
      watcher.close();
    };
  });
  const configFiles$ = watcher$.pipe(
    rxjs.scan((files, { event, path: filePath }) => {
      if (event === "add") {
        logger.debug("config file added", filePath);
        return [...files, filePath];
      }
      if (event === "unlink") {
        logger.debug("config file removed", filePath);
        return files.filter((fPath) => fPath !== filePath);
      }
      if (event === "change") {
        logger.log(
          "--------------------------------------------------------------------------------"
        );
        logger.info(path__default.default.relative(cwd, filePath), "changed");
        return files.slice(0);
      }
      return files;
    }, configFilePaths),
    rxjs.startWith(configFilePaths),
    rxjs.distinctUntilChanged()
  );
  const ctx$ = configFiles$.pipe(
    rxjs.switchMap(async (configFiles) => {
      const files = configFiles.map((f) => path__default.default.relative(cwd, f));
      const packageJsonPath = files.find((f) => f === "package.json");
      if (!packageJsonPath) {
        throw new Error("missing package.json");
      }
      const rawPkg = await createBuildContext.loadPkg({ cwd, logger });
      const validatedPkg = await createBuildContext.validatePkg({
        pkg: rawPkg
      }).catch((err) => {
        logger.error(err.message);
        process.exit(1);
      });
      const packageJson = await createBuildContext.validateExportsOrdering({ pkg: validatedPkg, logger }).catch(
        (err) => {
          logger.error(err.message);
          process.exit(1);
        }
      );
      const config = configFile ? await createBuildContext.loadConfig({ cwd, logger }) : providedConfig;
      const extMap = createBuildContext.getExportExtensionMap();
      return createBuildContext.createBuildContext({
        config: { ...config },
        cwd,
        extMap,
        logger,
        pkg: packageJson
      }).catch((err) => {
        logger.error(err.message);
        process.exit(1);
      });
    })
  );
  ctx$.subscribe(async (ctx) => {
    const watchTasks = await index.createWatchTasks(ctx);
    for (const task of watchTasks) {
      const handler = index.taskHandlers[task.type];
      const result$ = handler.run$(ctx, task);
      result$.subscribe({
        error(err) {
          handler.fail(ctx, task, err);
          process.exit(1);
        },
        next(result) {
          handler.success(ctx, task, result);
        }
      });
    }
  });
};
const watch = async (options) => {
  try {
    await watch$1(options);
  } catch (err) {
    errors.handleError(err);
  }
};
exports.watch = watch;
//# sourceMappingURL=watch-zQeBJJ3O.js.map
