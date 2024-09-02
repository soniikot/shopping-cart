"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const path = require("path");
const chalk = require("chalk");
const os = require("os");
const rxjs = require("rxjs");
const ts = require("typescript");
const errors = require("./errors-ov7Nr9g3.js");
const createBuildContext = require("./createBuildContext-teXLqX5U.js");
const react = require("@vitejs/plugin-react-swc");
const node_module = require("node:module");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const os__default = /* @__PURE__ */ _interopDefault(os);
const ts__default = /* @__PURE__ */ _interopDefault(ts);
const react__default = /* @__PURE__ */ _interopDefault(react);
const createTasks = (mode) => async (ctx) => {
  const tasks = [];
  const dtsTask = {
    type: `${mode}:dts`,
    entries: []
  };
  const viteTasks = {};
  const createViteTask = (format, runtime, { output, ...restEntry }) => {
    const buildId = `${format}:${output}`;
    if (viteTasks[buildId]) {
      viteTasks[buildId].entries.push(restEntry);
      if (output !== viteTasks[buildId].output) {
        ctx.logger.warn(
          "Multiple entries with different outputs for the same format are not supported. The first output will be used."
        );
      }
    } else {
      viteTasks[buildId] = {
        type: `${mode}:js`,
        format,
        output,
        runtime,
        entries: [restEntry]
      };
    }
  };
  const exps = Object.entries(ctx.exports).map(([exportPath, exportEntry]) => ({
    ...exportEntry,
    _path: exportPath
  }));
  for (const exp of exps) {
    if (exp.types) {
      const importId = path__default.default.join(ctx.pkg.name, exp._path);
      dtsTask.entries.push({
        importId,
        exportPath: exp._path,
        sourcePath: exp.source,
        targetPath: exp.types
      });
    }
    if (exp.require) {
      createViteTask("cjs", ctx.runtime ?? "*", {
        path: exp._path,
        entry: exp.source,
        output: exp.require
      });
    }
    if (exp.import) {
      createViteTask("es", ctx.runtime ?? "*", {
        path: exp._path,
        entry: exp.source,
        output: exp.import
      });
    }
    if (exp.browser?.require) {
      createViteTask("cjs", "web", {
        path: exp._path,
        entry: exp.browser?.source || exp.source,
        output: exp.browser.require
      });
    }
    if (exp.browser?.import) {
      createViteTask("cjs", "web", {
        path: exp._path,
        entry: exp.browser?.source || exp.source,
        output: exp.browser.import
      });
    }
  }
  const bundles = ctx.config.bundles ?? [];
  for (const bundle of bundles) {
    const idx = bundles.indexOf(bundle);
    if (bundle.require) {
      createViteTask("cjs", (bundle.runtime || ctx.runtime) ?? "*", {
        path: `bundle_cjs_${idx}`,
        entry: bundle.source,
        output: bundle.require
      });
    }
    if (bundle.import) {
      createViteTask("es", (bundle.runtime || ctx.runtime) ?? "*", {
        path: `bundle_esm_${idx}`,
        entry: bundle.source,
        output: bundle.import
      });
    }
    if (bundle.types) {
      const importId = path__default.default.join(ctx.pkg.name, bundle.source);
      dtsTask.entries.push({
        importId,
        exportPath: bundle.source,
        sourcePath: bundle.source,
        targetPath: bundle.types,
        tsconfig: bundle.tsconfig
      });
    }
  }
  if (dtsTask.entries.length) {
    tasks.push(dtsTask);
  }
  if (Object.values(viteTasks).length) {
    tasks.push(...Object.values(viteTasks));
  }
  return tasks;
};
const createBuildTasks = createTasks("build");
const createWatchTasks = createTasks("watch");
const printDiagnostic = (diagnostic, { logger, cwd }) => {
  if (diagnostic.file && diagnostic.start) {
    const { line, character } = ts__default.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts__default.default.flattenDiagnosticMessageText(diagnostic.messageText, ts__default.default.sys.newLine);
    const file = path__default.default.relative(cwd, diagnostic.file.fileName);
    const output = [
      `${chalk__default.default.cyan(file)}:${chalk__default.default.cyan(line + 1)}:${chalk__default.default.cyan(character + 1)} - `,
      `${chalk__default.default.gray(`TS${diagnostic.code}:`)} ${message}`
    ].join("");
    switch (diagnostic.category) {
      case ts__default.default.DiagnosticCategory.Error:
        logger.error(output);
        break;
      case ts__default.default.DiagnosticCategory.Warning:
        logger.warn(output);
        break;
      case ts__default.default.DiagnosticCategory.Message:
        logger.info(output);
        break;
      case ts__default.default.DiagnosticCategory.Suggestion:
        logger.info(output);
        break;
    }
  } else {
    logger.info(ts__default.default.flattenDiagnosticMessageText(diagnostic.messageText, ts__default.default.sys.newLine));
  }
};
const dtsBuildTask = {
  print(ctx, task) {
    const entries = [
      "   entries:",
      ...task.entries.map(
        (entry) => [
          `    – `,
          chalk__default.default.green(`${entry.importId} `),
          `${chalk__default.default.cyan(entry.sourcePath)} ${chalk__default.default.gray("->")} ${chalk__default.default.cyan(entry.targetPath)}`
        ].join("")
      )
    ];
    ctx.logger.log(["Building type files:", ...entries].join(os__default.default.EOL));
  },
  run$(ctx, task) {
    return new rxjs.Observable((subscriber) => {
      Promise.all(
        task.entries.map(async (entry) => {
          const tsconfig = entry.tsconfig ? createBuildContext.loadTsConfig({
            cwd: ctx.cwd,
            path: entry.tsconfig,
            logger: ctx.logger
          }) : ctx.ts;
          if (!tsconfig) {
            ctx.logger.warn(
              `You've added a types entry but no tsconfig.json was found for ${entry.targetPath}. Skipping...`
            );
            return;
          }
          const program = ts__default.default.createProgram(tsconfig.config.fileNames, tsconfig.config.options);
          const emitResult = program.emit();
          const allDiagnostics = ts__default.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
          for (const diagnostic of allDiagnostics) {
            printDiagnostic(diagnostic, { logger: ctx.logger, cwd: ctx.cwd });
          }
          if (emitResult.emitSkipped) {
            const errors2 = allDiagnostics.filter(
              (diag) => diag.category === ts__default.default.DiagnosticCategory.Error
            );
            if (errors2.length) {
              throw new Error("Failed to compile TypeScript definitions");
            }
          }
        })
      ).then(() => {
        subscriber.complete();
      }).catch((err) => {
        subscriber.error(err);
      });
    });
  },
  async success(ctx, task) {
    const msg = [
      `Built types, entries:`,
      task.entries.map(
        (entry) => `    ${chalk__default.default.blue(`${entry.importId}`)}: ${entry.sourcePath} -> ${entry.targetPath}`
      ).join(os__default.default.EOL)
    ];
    ctx.logger.success(msg.join(os__default.default.EOL));
  },
  async fail(ctx, task, err) {
    if (errors.isError(err)) {
      ctx.logger.error(err.message);
    }
    process.exit(1);
  }
};
const dtsWatchTask = {
  print(ctx, task) {
    const msg = [
      `Building Types, entries:`,
      task.entries.map(
        (entry) => `    ${chalk__default.default.blue(`${entry.importId}`)}: ${entry.sourcePath} -> ${entry.targetPath}`
      ).join(os__default.default.EOL)
    ];
    ctx.logger.success(msg.join(os__default.default.EOL));
  },
  run$(ctx, task) {
    let programs = [];
    return new rxjs.Observable((subscriber) => {
      Promise.all(
        task.entries.map(async (entry) => {
          const tsconfig = entry.tsconfig ? createBuildContext.loadTsConfig({
            cwd: ctx.cwd,
            path: entry.tsconfig,
            logger: ctx.logger
          }) : ctx.ts;
          if (!tsconfig) {
            ctx.logger.warn(
              `You've added a types entry but no tsconfig.json was found for ${entry.targetPath}. Skipping...`
            );
            return;
          }
          const compilerHost = ts__default.default.createWatchCompilerHost(
            tsconfig.path,
            tsconfig.config.options,
            ts__default.default.sys,
            ts__default.default.createEmitAndSemanticDiagnosticsBuilderProgram,
            (diagnostic) => {
              subscriber.next(diagnostic);
            },
            (diagnostic) => {
              subscriber.next(diagnostic);
            }
          );
          return ts__default.default.createWatchProgram(compilerHost);
        })
      ).then((progs) => {
        programs = progs;
      }).catch((err) => {
        subscriber.error(err);
      });
      return () => {
        programs.forEach((prog) => {
          prog?.close();
        });
      };
    });
  },
  async success(ctx, task, diagnostic) {
    const { logger, cwd } = ctx;
    if (diagnostic.code === 6194) {
      this.print(ctx, task);
    }
    if (diagnostic.category === ts__default.default.DiagnosticCategory.Message || diagnostic.category === ts__default.default.DiagnosticCategory.Suggestion) {
      return;
    }
    printDiagnostic(diagnostic, { logger, cwd });
  },
  async fail(ctx, task, err) {
    if (errors.isError(err)) {
      ctx.logger.error(err);
    }
  }
};
const resolveViteConfig = async (ctx, task) => {
  const { cwd, distPath, targets, external, extMap, pkg, exports: exportMap } = ctx;
  const { entries, format, output, runtime } = task;
  const outputExt = extMap[pkg.type || "commonjs"][format];
  const outDir = path__default.default.relative(cwd, distPath);
  const { createLogger } = await import("vite");
  const customLogger = createLogger();
  customLogger.warn = (msg) => ctx.logger.warn(msg);
  customLogger.warnOnce = (msg) => ctx.logger.warn(msg);
  customLogger.error = (msg) => ctx.logger.error(msg);
  customLogger.info = () => {
  };
  const exportIds = Object.keys(exportMap).map((exportPath) => path__default.default.join(pkg.name, exportPath));
  const sourcePaths = Object.values(exportMap).map((exp) => path__default.default.resolve(cwd, exp.source));
  const basePlugins = runtime === "node" ? [] : [react__default.default()];
  const plugins = ctx.config.plugins ? typeof ctx.config.plugins === "function" ? ctx.config.plugins({ runtime }) : ctx.config.plugins : [];
  const config = {
    configFile: false,
    root: cwd,
    mode: "production",
    logLevel: "warn",
    clearScreen: false,
    customLogger,
    build: {
      minify: createBuildContext.resolveConfigProperty(ctx.config.minify, false),
      sourcemap: createBuildContext.resolveConfigProperty(ctx.config.sourcemap, true),
      /**
       * The task runner will clear this for us
       */
      emptyOutDir: false,
      target: targets[runtime],
      outDir,
      lib: {
        entry: entries.map((e) => e.entry),
        formats: [format],
        /**
         * this enforces the file name to match what the output we've
         * determined from the package.json exports. However, when preserving modules
         * we want to let Rollup handle the file names.
         */
        fileName: createBuildContext.resolveConfigProperty(ctx.config.preserveModules, false) ? void 0 : () => {
          return `${path__default.default.relative(outDir, output).replace(/\.[^/.]+$/, "")}${outputExt}`;
        }
      },
      rollupOptions: {
        external(id, importer) {
          if (exportIds?.includes(id)) {
            return true;
          }
          if (importer && (id.startsWith(".") || id.startsWith("/"))) {
            const idPath = path__default.default.resolve(path__default.default.dirname(importer), id);
            if (sourcePaths?.includes(idPath)) {
              ctx.logger.warn(
                `detected self-referencing import – treating as external: ${path__default.default.relative(
                  cwd,
                  idPath
                )}`
              );
              return true;
            }
          }
          const idParts = id.split("/");
          const name = idParts[0].startsWith("@") ? `${idParts[0]}/${idParts[1]}` : idParts[0];
          const builtinModulesWithNodePrefix = [
            ...node_module.builtinModules,
            ...node_module.builtinModules.map((modName) => `node:${modName}`)
          ];
          if (name && external.includes(name) || name && builtinModulesWithNodePrefix.includes(name)) {
            return true;
          }
          return false;
        },
        output: {
          preserveModules: createBuildContext.resolveConfigProperty(ctx.config.preserveModules, false),
          /**
           * Mimic TypeScript's behavior, by setting the value to "auto" to control
           * how Rollup handles default, namespace and dynamic imports from external
           * dependencies in formats like CommonJS that do not natively support
           * these concepts. Mainly styled-components@5
           *
           * For more info see https://rollupjs.org/configuration-options/#output-interop
           */
          interop: "auto",
          chunkFileNames() {
            const parts = outputExt.split(".");
            if (parts.length === 3) {
              return `_chunks/[name]-[hash].${parts[2]}`;
            }
            return `_chunks/[name]-[hash]${outputExt}`;
          }
        }
      }
    },
    plugins: [...basePlugins, ...plugins]
  };
  return config;
};
const viteBuildTask = {
  print(ctx, task) {
    const targetLines = [
      "   target:",
      ...ctx.targets[task.runtime].map((t) => chalk__default.default.cyan(`    - ${t}`))
    ];
    const entries = [
      "   entries:",
      ...task.entries.map(
        (entry) => [
          `    – `,
          chalk__default.default.green(`${path__default.default.join(ctx.pkg.name, entry.path)}: `),
          `${chalk__default.default.cyan(entry.entry)} ${chalk__default.default.gray("→")} ${chalk__default.default.cyan(task.output)}`
        ].join("")
      )
    ];
    ctx.logger.log(
      [`Building javascript files:`, `  format: ${task.format}`, ...targetLines, ...entries].join(
        os__default.default.EOL
      )
    );
  },
  run$(ctx, task) {
    return new rxjs.Observable((subscriber) => {
      resolveViteConfig(ctx, task).then((config) => {
        ctx.logger.debug("Vite config:", os__default.default.EOL, config);
        import("vite").then(({ build }) => {
          build(config).then(() => {
            subscriber.complete();
          }).catch((err) => {
            subscriber.error(err);
          });
        });
      });
    });
  },
  async success(ctx, task) {
    const msg = [
      `Built javascript (runtime: ${task.runtime} – target: ${task.format})`,
      task.entries.map(
        (e) => `    ${chalk__default.default.blue(path__default.default.join(ctx.pkg.name, e.path))}: ${e.entry} -> ${task.output}`
      ).join(os__default.default.EOL)
    ];
    ctx.logger.success(msg.join(os__default.default.EOL));
  },
  async fail(ctx, task, err) {
    if (errors.isError(err)) {
      ctx.logger.error(err.message);
    }
    process.exit(1);
  }
};
const viteWatchTask = {
  print(ctx, task) {
    const msg = [
      `Building Javascript (runtime: ${task.runtime} – target: ${task.format})`,
      task.entries.map(
        (e) => `    ${chalk__default.default.blue(path__default.default.join(ctx.pkg.name, e.path))}: ${e.entry} -> ${task.output}`
      ).join(os__default.default.EOL)
    ];
    ctx.logger.success(msg.join(os__default.default.EOL));
  },
  run$(ctx, task) {
    return new rxjs.Observable((subscriber) => {
      let watcher = null;
      resolveViteConfig(ctx, task).then((config) => {
        ctx.logger.debug(`Vite config:${os__default.default.EOL}`, config);
        import("vite").then(({ build }) => {
          build({
            ...config,
            mode: "development",
            build: {
              ...config.build,
              watch: {}
            }
          }).then((rollupWatcher) => {
            watcher = rollupWatcher;
            if ("on" in watcher && typeof watcher.on === "function") {
              watcher.on("event", (ev) => {
                subscriber.next(ev);
              });
            }
          });
        });
      });
      return () => {
        if (watcher !== null && "close" in watcher && typeof watcher.close === "function") {
          watcher.close();
        }
      };
    });
  },
  success(ctx, task, result) {
    switch (result.code) {
      case "BUNDLE_END":
        this.print(ctx, task);
        break;
      case "ERROR":
        ctx.logger.error(result.error);
        break;
    }
  },
  fail(ctx, task, err) {
    if (errors.isError(err)) {
      ctx.logger.error(err);
    }
  }
};
const taskHandlers = {
  "build:js": viteBuildTask,
  "build:dts": dtsBuildTask,
  "watch:js": viteWatchTask,
  "watch:dts": dtsWatchTask
};
exports.createBuildTasks = createBuildTasks;
exports.createWatchTasks = createWatchTasks;
exports.taskHandlers = taskHandlers;
//# sourceMappingURL=index-D66XIRbD.js.map
