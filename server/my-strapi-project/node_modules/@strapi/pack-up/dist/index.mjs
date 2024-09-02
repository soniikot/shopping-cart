import fs$1, { access, mkdir, readdir, lstat, writeFile } from "fs/promises";
import ora from "ora";
import os from "os";
import { register } from "esbuild-register/dist/node";
import * as fs from "fs";
import { existsSync } from "fs";
import * as path from "path";
import path__default, { resolve, relative, dirname } from "path";
import pkgUp from "pkg-up";
import chalk from "chalk";
import * as yup from "yup";
import browserslistToEsbuild from "browserslist-to-esbuild";
import ts from "typescript";
import { Observable, scan, startWith, distinctUntilChanged, switchMap } from "rxjs";
import react from "@vitejs/plugin-react-swc";
import { builtinModules } from "node:module";
import chokidar from "chokidar";
import esbuild from "esbuild";
import prettier from "prettier";
import prompts from "prompts";
import ini from "ini";
import getLatestVersion from "get-latest-version";
import gitUrlParse from "git-url-parse";
import { outdent } from "outdent";
const CONFIG_FILE_NAMES = [
  "packup.config.ts",
  "packup.config.js",
  "packup.config.cjs",
  "packup.config.mjs"
];
const loadConfig = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp({ cwd });
  if (!pkgPath) {
    logger.debug(
      "Could not find a package.json in the current directory, therefore no config was loaded"
    );
    return void 0;
  }
  const root = path.dirname(pkgPath);
  for (const fileName of CONFIG_FILE_NAMES) {
    const configPath = path.resolve(root, fileName);
    const exists = fs.existsSync(configPath);
    if (exists) {
      const esbuildOptions = { extensions: [".js", ".mjs", ".ts"] };
      const { unregister } = register(esbuildOptions);
      const mod = require(configPath);
      unregister();
      const config = mod?.default || mod || void 0;
      if (config) {
        logger.debug("Loaded configuration:", os.EOL, config);
      }
      return config;
    }
  }
  return void 0;
};
const defineConfig = (configOptions) => configOptions;
function resolveConfigProperty(prop, initialValue) {
  if (!prop) {
    return initialValue;
  }
  if (typeof prop === "function") {
    return prop(initialValue);
  }
  return prop;
}
const isError = (err) => err instanceof Error;
const validateExportsOrdering = async ({
  pkg,
  logger
}) => {
  if (pkg.exports) {
    const exports = Object.entries(pkg.exports);
    for (const [expPath, exp] of exports) {
      if (typeof exp === "string") {
        continue;
      }
      const keys = Object.keys(exp);
      if (!assertFirst("types", keys)) {
        throw new Error(`exports["${expPath}"]: the 'types' property should be the first property`);
      }
      if (exp.node) {
        const nodeKeys = Object.keys(exp.node);
        if (!assertOrder("module", "import", nodeKeys)) {
          throw new Error(
            `exports["${expPath}"]: the 'node.module' property should come before the 'node.import' property`
          );
        }
        if (!assertOrder("import", "require", nodeKeys)) {
          logger.warn(
            `exports["${expPath}"]: the 'node.import' property should come before the 'node.require' property`
          );
        }
        if (!assertOrder("module", "require", nodeKeys)) {
          logger.warn(
            `exports["${expPath}"]: the 'node.module' property should come before 'node.require' property`
          );
        }
        if (exp.import && exp.node.import && !assertOrder("node", "import", keys)) {
          throw new Error(
            `exports["${expPath}"]: the 'node' property should come before the 'import' property`
          );
        }
        if (exp.module && exp.node.module && !assertOrder("node", "module", keys)) {
          throw new Error(
            `exports["${expPath}"]: the 'node' property should come before the 'module' property`
          );
        }
        if (exp.node.import && (!exp.node.require || exp.require === exp.node.require) && !exp.node.module) {
          logger.warn(
            `exports["${expPath}"]: the 'node.module' property should be added so bundlers don't unintentionally try to bundle 'node.import'. Its value should be '"module": "${exp.import}"'`
          );
        }
        if (exp.node.import && !exp.node.require && exp.node.module && exp.import && exp.node.module !== exp.import) {
          throw new Error(
            `exports["${expPath}"]: the 'node.module' property should match 'import'`
          );
        }
        if (exp.require && exp.node.require && exp.require === exp.node.require) {
          throw new Error(
            `exports["${expPath}"]: the 'node.require' property isn't necessary as it's identical to 'require'`
          );
        } else if (exp.require && exp.node.require && !assertOrder("node", "require", keys)) {
          throw new Error(
            `exports["${expPath}"]: the 'node' property should come before the 'require' property`
          );
        }
      } else {
        if (!assertOrder("import", "require", keys)) {
          logger.warn(
            `exports["${expPath}"]: the 'import' property should come before the 'require' property`
          );
        }
        if (!assertOrder("module", "import", keys)) {
          logger.warn(
            `exports["${expPath}"]: the 'module' property should come before 'import' property`
          );
        }
      }
      if (!assertLast("default", keys)) {
        throw new Error(
          `exports["${expPath}"]: the 'default' property should be the last property`
        );
      }
    }
  } else if (!["main", "module"].some((key) => Object.prototype.hasOwnProperty.call(pkg, key))) {
    throw new Error(`'package.json' must contain a 'main' and 'module' property`);
  }
  return pkg;
};
function assertFirst(key, arr) {
  const aIdx = arr.indexOf(key);
  if (aIdx === -1) {
    return true;
  }
  return aIdx === 0;
}
function assertLast(key, arr) {
  const aIdx = arr.indexOf(key);
  if (aIdx === -1) {
    return true;
  }
  return aIdx === arr.length - 1;
}
function assertOrder(keyA, keyB, arr) {
  const aIdx = arr.indexOf(keyA);
  const bIdx = arr.indexOf(keyB);
  if (aIdx === -1 || bIdx === -1) {
    return true;
  }
  return aIdx < bIdx;
}
const DEFAULT_PKG_EXT_MAP = {
  // pkg.type: "commonjs"
  commonjs: {
    cjs: ".js",
    es: ".mjs"
  },
  // pkg.type: "module"
  module: {
    cjs: ".cjs",
    es: ".js"
  }
};
const getExportExtensionMap = () => {
  return DEFAULT_PKG_EXT_MAP;
};
const validateExports = (_exports, options) => {
  const { extMap, pkg } = options;
  const ext = extMap[pkg.type || "commonjs"];
  const errors = [];
  for (const exp of _exports) {
    if (exp.require && !exp.require.endsWith(ext.cjs)) {
      errors.push(
        `package.json with 'type: "${pkg.type}"' - 'exports["${exp._path}"].require' must end with "${ext.cjs}"`
      );
    }
    if (exp.import && !exp.import.endsWith(ext.es)) {
      errors.push(
        `package.json with 'type: "${pkg.type}"' - 'exports["${exp._path}"].import' must end with "${ext.es}"`
      );
    }
  }
  return errors;
};
const parseExports = ({ extMap, pkg }) => {
  const rootExport = {
    _path: ".",
    types: pkg.types,
    source: pkg.source || "",
    require: pkg.main,
    import: pkg.module,
    default: pkg.module || pkg.main || ""
  };
  const extraExports = [];
  const errors = [];
  if (pkg.exports) {
    if (!pkg.exports["./package.json"]) {
      errors.push('package.json: `exports["./package.json"] must be declared.');
    }
    Object.entries(pkg.exports).forEach(([path2, entry]) => {
      if (path2.endsWith(".json")) {
        if (path2 === "./package.json" && entry !== "./package.json") {
          errors.push(`package.json: 'exports["./package.json"]' must be './package.json'.`);
        }
      } else if (Boolean(entry) && typeof entry === "object" && !Array.isArray(entry)) {
        if (path2 === ".") {
          if (entry.require && rootExport.require && entry.require !== rootExport.require) {
            errors.push(
              `package.json: mismatch between 'main' and 'exports.require'. These must be equal.`
            );
          }
          if (entry.import && rootExport.import && entry.import !== rootExport.import) {
            errors.push(
              `package.json: mismatch between 'module' and 'exports.import' These must be equal.`
            );
          }
          if (entry.types && rootExport.types && entry.types !== rootExport.types) {
            errors.push(
              `package.json: mismatch between 'types' and 'exports.types'. These must be equal.`
            );
          }
          if (entry.source && rootExport.source && entry.source !== rootExport.source) {
            errors.push(
              `package.json: mismatch between 'source' and 'exports.source'. These must be equal.`
            );
          }
          Object.assign(rootExport, entry);
        } else {
          const extraExport = {
            _exported: true,
            _path: path2,
            ...entry
          };
          extraExports.push(extraExport);
        }
      } else {
        errors.push("package.json: exports must be an object");
      }
    });
  }
  const _exports = [
    /**
     * In the case of strapi plugins, we don't have a root export because we
     * ship a server side and client side package. So this can be completely omitted.
     */
    Object.values(rootExport).some((exp) => exp !== rootExport._path && Boolean(exp)) && rootExport,
    ...extraExports
  ].filter((exp) => Boolean(exp));
  errors.push(...validateExports(_exports, { extMap, pkg }));
  if (errors.length) {
    throw new Error(`${os.EOL}- ${errors.join(`${os.EOL}- `)}`);
  }
  return _exports;
};
const createLogger = (options = {}) => {
  const { silent = false, debug = false } = options;
  const state = { errors: 0, warning: 0 };
  return {
    get warnings() {
      return state.warning;
    },
    get errors() {
      return state.errors;
    },
    debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.debug(chalk.cyan(`[DEBUG] `), ...args);
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(chalk.blue(`[INFO] `), ...args);
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.log(...args);
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(chalk.yellow(`[WARN] `), ...args);
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(chalk.red(`[ERROR] `), ...args);
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(chalk.green(`[SUCCESS] `), ...args);
    }
  };
};
const record = (value) => yup.object(
  typeof value === "object" && value ? Object.entries(value).reduce((acc, [key]) => {
    acc[key] = yup.string().required();
    return acc;
  }, {}) : {}
).optional();
const packageJsonSchema = yup.object({
  name: yup.string().required(),
  version: yup.string().required(),
  description: yup.string().optional(),
  author: yup.lazy((value) => {
    if (typeof value === "object") {
      return yup.object({
        name: yup.string().required(),
        email: yup.string().optional(),
        url: yup.string().optional()
      }).optional();
    }
    return yup.string().optional();
  }),
  keywords: yup.array(yup.string()).optional(),
  type: yup.mixed().oneOf(["commonjs", "module"]).optional(),
  license: yup.string().optional(),
  repository: yup.object({
    type: yup.string().required(),
    url: yup.string().required()
  }).optional(),
  bugs: yup.object({
    url: yup.string().required()
  }).optional(),
  homepage: yup.string().optional(),
  // TODO: be nice just to make this either a string or a record of strings.
  bin: yup.lazy((value) => {
    if (typeof value === "object") {
      return record(value);
    }
    return yup.string().optional();
  }),
  // TODO: be nice just to make this either a string or a record of strings.
  browser: yup.lazy((value) => {
    if (typeof value === "object") {
      return record(value);
    }
    return yup.string().optional();
  }),
  main: yup.string().optional(),
  module: yup.string().optional(),
  source: yup.string().optional(),
  types: yup.string().optional(),
  exports: yup.lazy(
    (value) => yup.object(
      typeof value === "object" ? Object.entries(value).reduce((acc, [key, value2]) => {
        if (typeof value2 === "object") {
          acc[key] = yup.object({
            types: yup.string().optional(),
            source: yup.string().required(),
            browser: yup.object({
              source: yup.string().required(),
              import: yup.string().optional(),
              require: yup.string().optional()
            }).optional(),
            node: yup.object({
              source: yup.string().optional(),
              module: yup.string().optional(),
              import: yup.string().optional(),
              require: yup.string().optional()
            }).optional(),
            module: yup.string().optional(),
            import: yup.string().optional(),
            require: yup.string().optional(),
            default: yup.string().required()
          }).noUnknown(true);
        } else {
          acc[key] = yup.string().matches(/^\.\/.*\.json$/).required();
        }
        return acc;
      }, {}) : void 0
    ).optional()
  ),
  files: yup.array(yup.string()).optional(),
  scripts: yup.lazy(record),
  dependencies: yup.lazy(record),
  devDependencies: yup.lazy(record),
  peerDependencies: yup.lazy(record),
  engines: yup.lazy(record),
  browserslist: yup.array(yup.string().required()).optional()
});
const loadPkg = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp({ cwd });
  if (!pkgPath) {
    throw new Error("Could not find a package.json in the current directory");
  }
  const buffer = await fs$1.readFile(pkgPath);
  const pkg = JSON.parse(buffer.toString());
  logger.debug("Loaded package.json:", os.EOL, pkg);
  return pkg;
};
const validatePkg = async ({ pkg }) => {
  try {
    const validatedPkg = await packageJsonSchema.validate(pkg, {
      strict: true
    });
    return validatedPkg;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      switch (err.type) {
        case "required":
          if (err.path) {
            throw new Error(
              `'${err.path}' in 'package.json' is required as type '${chalk.magenta(
                yup.reach(packageJsonSchema, err.path).type
              )}'`
            );
          }
          break;
        case "matches":
          if (err.params && err.path && "value" in err.params && "regex" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' must be of type '${chalk.magenta(
                err.params.regex
              )}' (recieved the value '${chalk.magenta(err.params.value)}')`
            );
          }
          break;
        case "noUnknown":
          if (err.path && err.params && "unknown" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' contains the unknown key ${chalk.magenta(
                err.params.unknown
              )}, for compatability only the following keys are allowed: ${chalk.magenta(
                "['types', 'source', 'import', 'require', 'default']"
              )}`
            );
          }
          break;
        default:
          if (err.path && err.params && "type" in err.params && "value" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' must be of type '${chalk.magenta(
                err.params.type
              )}' (recieved '${chalk.magenta(typeof err.params.value)}')`
            );
          }
      }
    }
    throw err;
  }
};
const loadTsConfig = ({
  cwd,
  path: path2,
  logger
}) => {
  const providedPath = path2.split(path__default.sep);
  const [configFileName] = providedPath.slice(-1);
  const pathToConfig = path__default.join(cwd, providedPath.slice(0, -1).join(path__default.sep));
  const configPath = ts.findConfigFile(pathToConfig, ts.sys.fileExists, configFileName);
  if (!configPath) {
    return void 0;
  }
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, pathToConfig);
  logger.debug(`Loaded user TS config:`, os.EOL, parsedConfig);
  const { outDir } = parsedConfig.raw.compilerOptions;
  if (!outDir) {
    throw new Error("tsconfig.json is missing 'compilerOptions.outDir'");
  }
  parsedConfig.options = {
    ...parsedConfig.options,
    declaration: true,
    declarationDir: outDir,
    emitDeclarationOnly: true,
    noEmit: false,
    outDir
  };
  logger.debug(`Using TS config:`, os.EOL, parsedConfig);
  return {
    config: parsedConfig,
    path: configPath
  };
};
const DEFAULT_BROWSERS_LIST_CONFIG = [
  "last 3 major versions",
  "Firefox ESR",
  "last 2 Opera  versions",
  "not dead",
  "node 18.0.0"
];
const createBuildContext = async ({
  config,
  cwd,
  extMap,
  logger,
  pkg
}) => {
  const tsConfig = loadTsConfig({
    cwd,
    path: resolveConfigProperty(config.tsconfig, "tsconfig.build.json"),
    logger
  });
  const targets = {
    "*": browserslistToEsbuild(pkg.browserslist ?? DEFAULT_BROWSERS_LIST_CONFIG),
    node: browserslistToEsbuild(["node 18.0.0"]),
    web: ["esnext"]
  };
  const parsedExports = parseExports({ extMap, pkg }).reduce((acc, x) => {
    const { _path: exportPath, ...exportEntry } = x;
    return { ...acc, [exportPath]: exportEntry };
  }, {});
  const exports = resolveConfigProperty(config.exports, parsedExports);
  const parsedExternals = [
    ...pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    ...pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []
  ];
  const external = config && Array.isArray(config.externals) ? [...parsedExternals, ...config.externals] : parsedExternals;
  const outputPaths = Object.values(exports).flatMap((exportEntry) => {
    return [
      exportEntry.import,
      exportEntry.require,
      exportEntry.browser?.import,
      exportEntry.browser?.require,
      exportEntry.node?.source && exportEntry.node.import,
      exportEntry.node?.source && exportEntry.node.require
    ].filter(Boolean);
  }).map((p) => path__default.resolve(cwd, p));
  const commonDistPath = findCommonDirPath(outputPaths);
  if (commonDistPath === cwd) {
    throw new Error(
      "all output files must share a common parent directory which is not the root package directory"
    );
  }
  if (commonDistPath && !pathContains(cwd, commonDistPath)) {
    throw new Error("all output files must be located within the package");
  }
  const configDistPath = config?.dist ? path__default.resolve(cwd, config.dist) : void 0;
  const distPath = configDistPath || commonDistPath;
  if (!distPath) {
    throw new Error("could not detect 'dist' path");
  }
  return {
    config,
    cwd,
    distPath,
    exports,
    external,
    extMap,
    logger,
    pkg,
    runtime: config?.runtime,
    targets,
    ts: tsConfig
  };
};
const pathContains = (containerPath, itemPath) => {
  return !path__default.relative(containerPath, itemPath).startsWith("..");
};
const findCommonDirPath = (filePaths) => {
  let commonPath;
  for (const filePath of filePaths) {
    let dirPath = path__default.dirname(filePath);
    if (!commonPath) {
      commonPath = dirPath;
      continue;
    }
    while (dirPath !== commonPath) {
      dirPath = path__default.dirname(dirPath);
      if (dirPath === commonPath) {
        break;
      }
      if (pathContains(dirPath, commonPath)) {
        commonPath = dirPath;
        break;
      }
      if (dirPath === ".") {
        return void 0;
      }
    }
  }
  return commonPath;
};
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
      const importId = path__default.join(ctx.pkg.name, exp._path);
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
      const importId = path__default.join(ctx.pkg.name, bundle.source);
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
    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine);
    const file = path__default.relative(cwd, diagnostic.file.fileName);
    const output = [
      `${chalk.cyan(file)}:${chalk.cyan(line + 1)}:${chalk.cyan(character + 1)} - `,
      `${chalk.gray(`TS${diagnostic.code}:`)} ${message}`
    ].join("");
    switch (diagnostic.category) {
      case ts.DiagnosticCategory.Error:
        logger.error(output);
        break;
      case ts.DiagnosticCategory.Warning:
        logger.warn(output);
        break;
      case ts.DiagnosticCategory.Message:
        logger.info(output);
        break;
      case ts.DiagnosticCategory.Suggestion:
        logger.info(output);
        break;
    }
  } else {
    logger.info(ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine));
  }
};
const dtsBuildTask = {
  print(ctx, task) {
    const entries = [
      "   entries:",
      ...task.entries.map(
        (entry) => [
          `    – `,
          chalk.green(`${entry.importId} `),
          `${chalk.cyan(entry.sourcePath)} ${chalk.gray("->")} ${chalk.cyan(entry.targetPath)}`
        ].join("")
      )
    ];
    ctx.logger.log(["Building type files:", ...entries].join(os.EOL));
  },
  run$(ctx, task) {
    return new Observable((subscriber) => {
      Promise.all(
        task.entries.map(async (entry) => {
          const tsconfig = entry.tsconfig ? loadTsConfig({
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
          const program = ts.createProgram(tsconfig.config.fileNames, tsconfig.config.options);
          const emitResult = program.emit();
          const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
          for (const diagnostic of allDiagnostics) {
            printDiagnostic(diagnostic, { logger: ctx.logger, cwd: ctx.cwd });
          }
          if (emitResult.emitSkipped) {
            const errors = allDiagnostics.filter(
              (diag) => diag.category === ts.DiagnosticCategory.Error
            );
            if (errors.length) {
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
        (entry) => `    ${chalk.blue(`${entry.importId}`)}: ${entry.sourcePath} -> ${entry.targetPath}`
      ).join(os.EOL)
    ];
    ctx.logger.success(msg.join(os.EOL));
  },
  async fail(ctx, task, err) {
    if (isError(err)) {
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
        (entry) => `    ${chalk.blue(`${entry.importId}`)}: ${entry.sourcePath} -> ${entry.targetPath}`
      ).join(os.EOL)
    ];
    ctx.logger.success(msg.join(os.EOL));
  },
  run$(ctx, task) {
    let programs = [];
    return new Observable((subscriber) => {
      Promise.all(
        task.entries.map(async (entry) => {
          const tsconfig = entry.tsconfig ? loadTsConfig({
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
          const compilerHost = ts.createWatchCompilerHost(
            tsconfig.path,
            tsconfig.config.options,
            ts.sys,
            ts.createEmitAndSemanticDiagnosticsBuilderProgram,
            (diagnostic) => {
              subscriber.next(diagnostic);
            },
            (diagnostic) => {
              subscriber.next(diagnostic);
            }
          );
          return ts.createWatchProgram(compilerHost);
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
    if (diagnostic.category === ts.DiagnosticCategory.Message || diagnostic.category === ts.DiagnosticCategory.Suggestion) {
      return;
    }
    printDiagnostic(diagnostic, { logger, cwd });
  },
  async fail(ctx, task, err) {
    if (isError(err)) {
      ctx.logger.error(err);
    }
  }
};
const resolveViteConfig = async (ctx, task) => {
  const { cwd, distPath, targets, external, extMap, pkg, exports: exportMap } = ctx;
  const { entries, format, output, runtime } = task;
  const outputExt = extMap[pkg.type || "commonjs"][format];
  const outDir = path__default.relative(cwd, distPath);
  const { createLogger: createLogger2 } = await import("vite");
  const customLogger = createLogger2();
  customLogger.warn = (msg) => ctx.logger.warn(msg);
  customLogger.warnOnce = (msg) => ctx.logger.warn(msg);
  customLogger.error = (msg) => ctx.logger.error(msg);
  customLogger.info = () => {
  };
  const exportIds = Object.keys(exportMap).map((exportPath) => path__default.join(pkg.name, exportPath));
  const sourcePaths = Object.values(exportMap).map((exp) => path__default.resolve(cwd, exp.source));
  const basePlugins = runtime === "node" ? [] : [react()];
  const plugins = ctx.config.plugins ? typeof ctx.config.plugins === "function" ? ctx.config.plugins({ runtime }) : ctx.config.plugins : [];
  const config = {
    configFile: false,
    root: cwd,
    mode: "production",
    logLevel: "warn",
    clearScreen: false,
    customLogger,
    build: {
      minify: resolveConfigProperty(ctx.config.minify, false),
      sourcemap: resolveConfigProperty(ctx.config.sourcemap, true),
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
        fileName: resolveConfigProperty(ctx.config.preserveModules, false) ? void 0 : () => {
          return `${path__default.relative(outDir, output).replace(/\.[^/.]+$/, "")}${outputExt}`;
        }
      },
      rollupOptions: {
        external(id, importer) {
          if (exportIds?.includes(id)) {
            return true;
          }
          if (importer && (id.startsWith(".") || id.startsWith("/"))) {
            const idPath = path__default.resolve(path__default.dirname(importer), id);
            if (sourcePaths?.includes(idPath)) {
              ctx.logger.warn(
                `detected self-referencing import – treating as external: ${path__default.relative(
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
            ...builtinModules,
            ...builtinModules.map((modName) => `node:${modName}`)
          ];
          if (name && external.includes(name) || name && builtinModulesWithNodePrefix.includes(name)) {
            return true;
          }
          return false;
        },
        output: {
          preserveModules: resolveConfigProperty(ctx.config.preserveModules, false),
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
      ...ctx.targets[task.runtime].map((t) => chalk.cyan(`    - ${t}`))
    ];
    const entries = [
      "   entries:",
      ...task.entries.map(
        (entry) => [
          `    – `,
          chalk.green(`${path__default.join(ctx.pkg.name, entry.path)}: `),
          `${chalk.cyan(entry.entry)} ${chalk.gray("→")} ${chalk.cyan(task.output)}`
        ].join("")
      )
    ];
    ctx.logger.log(
      [`Building javascript files:`, `  format: ${task.format}`, ...targetLines, ...entries].join(
        os.EOL
      )
    );
  },
  run$(ctx, task) {
    return new Observable((subscriber) => {
      resolveViteConfig(ctx, task).then((config) => {
        ctx.logger.debug("Vite config:", os.EOL, config);
        import("vite").then(({ build: build2 }) => {
          build2(config).then(() => {
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
        (e) => `    ${chalk.blue(path__default.join(ctx.pkg.name, e.path))}: ${e.entry} -> ${task.output}`
      ).join(os.EOL)
    ];
    ctx.logger.success(msg.join(os.EOL));
  },
  async fail(ctx, task, err) {
    if (isError(err)) {
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
        (e) => `    ${chalk.blue(path__default.join(ctx.pkg.name, e.path))}: ${e.entry} -> ${task.output}`
      ).join(os.EOL)
    ];
    ctx.logger.success(msg.join(os.EOL));
  },
  run$(ctx, task) {
    return new Observable((subscriber) => {
      let watcher = null;
      resolveViteConfig(ctx, task).then((config) => {
        ctx.logger.debug(`Vite config:${os.EOL}`, config);
        import("vite").then(({ build: build2 }) => {
          build2({
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
    if (isError(err)) {
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
const build = async (opts = {}) => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  const {
    silent,
    debug,
    cwd = process.cwd(),
    configFile = true,
    config: providedConfig,
    ...configOptions
  } = opts;
  const logger = createLogger({ silent, debug });
  const packageJsonLoader = ora(`Verifying package.json ${os.EOL}`).start();
  const rawPkg = await loadPkg({ cwd, logger }).catch((err) => {
    packageJsonLoader.fail();
    if (isError(err)) {
      logger.error(err.message);
    }
    logger.debug(`Path checked – ${cwd}`);
    process.exit(1);
  });
  const validatedPkg = await validatePkg({
    pkg: rawPkg
  }).catch((err) => {
    packageJsonLoader.fail();
    if (isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  const packageJson = await validateExportsOrdering({ pkg: validatedPkg, logger }).catch((err) => {
    packageJsonLoader.fail();
    if (isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  packageJsonLoader.succeed("Verified package.json");
  const config = configFile ? await loadConfig({ cwd, logger }) : providedConfig;
  const buildContextLoader = ora(`Creating build context ${os.EOL}`).start();
  const extMap = getExportExtensionMap();
  const ctx = await createBuildContext({
    config: { ...config, ...configOptions },
    cwd,
    extMap,
    logger,
    pkg: packageJson
  }).catch((err) => {
    buildContextLoader.fail();
    if (isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  logger.debug(`Build context: ${os.EOL}`, ctx);
  const buildTasks = await createBuildTasks(ctx);
  buildContextLoader.succeed("Created build context");
  try {
    logger.debug(`Cleaning dist folder: ${ctx.distPath}`);
    await fs$1.rm(ctx.distPath, { recursive: true, force: true });
    logger.debug("Cleaned dist folder");
  } catch {
    logger.debug("There was no dist folder to clean");
  }
  for (const task of buildTasks) {
    const handler = taskHandlers[task.type];
    handler.print(ctx, task);
    const result$ = handler.run$(ctx, task);
    result$.subscribe({
      complete() {
        handler.success(ctx, task);
      },
      error(err) {
        handler.fail(ctx, task, err);
      }
    });
  }
};
const watch = async (opts) => {
  const { silent, debug, cwd = process.cwd(), configFile = true, config: providedConfig } = opts;
  const logger = createLogger({ silent, debug });
  logger.debug("watching config files");
  const configFilePaths = ["package.json", ...CONFIG_FILE_NAMES].map(
    (fileName) => path__default.resolve(cwd, fileName).split(path__default.sep).join(path__default.posix.sep)
  );
  const watcher$ = new Observable((subscriber) => {
    const watcher = chokidar.watch(configFilePaths, {
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
    scan((files, { event, path: filePath }) => {
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
        logger.info(path__default.relative(cwd, filePath), "changed");
        return files.slice(0);
      }
      return files;
    }, configFilePaths),
    startWith(configFilePaths),
    distinctUntilChanged()
  );
  const ctx$ = configFiles$.pipe(
    switchMap(async (configFiles) => {
      const files = configFiles.map((f) => path__default.relative(cwd, f));
      const packageJsonPath = files.find((f) => f === "package.json");
      if (!packageJsonPath) {
        throw new Error("missing package.json");
      }
      const rawPkg = await loadPkg({ cwd, logger });
      const validatedPkg = await validatePkg({
        pkg: rawPkg
      }).catch((err) => {
        logger.error(err.message);
        process.exit(1);
      });
      const packageJson = await validateExportsOrdering({ pkg: validatedPkg, logger }).catch(
        (err) => {
          logger.error(err.message);
          process.exit(1);
        }
      );
      const config = configFile ? await loadConfig({ cwd, logger }) : providedConfig;
      const extMap = getExportExtensionMap();
      return createBuildContext({
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
    const watchTasks = await createWatchTasks(ctx);
    for (const task of watchTasks) {
      const handler = taskHandlers[task.type];
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
const isEmptyDirectory = async (dir) => {
  const files = await readdir(dir);
  return files.length === 0;
};
const isDirectory = async (dir) => {
  const stats = await lstat(dir);
  return stats.isDirectory();
};
const pathExists = async (path2) => {
  try {
    await access(path2);
    return true;
  } catch (error) {
    return false;
  }
};
const ensurePackagePathIsViable = async (path2) => {
  const exists = await pathExists(path2);
  if (!exists) {
    await mkdir(path2, { recursive: true });
  }
  const isEmpty = await isEmptyDirectory(path2);
  if (!isEmpty) {
    throw new Error(`${path2} is not empty`);
  }
  const isDir = await isDirectory(path2);
  if (!isDir) {
    throw new Error(`${path2} is not a directory`);
  }
};
const check = async (opts = {}) => {
  const { silent, debug, cwd = process.cwd() } = opts;
  const logger = createLogger({ silent, debug });
  const packageJsonLoader = ora(`Verifying package.json ${os.EOL}`).start();
  const rawPkg = await loadPkg({ cwd, logger }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    logger.debug(`Path checked – ${cwd}`);
    process.exit(1);
  });
  const validatedPkg = await validatePkg({
    pkg: rawPkg
  }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    process.exit(1);
  });
  const packageJson = await validateExportsOrdering({ pkg: validatedPkg, logger }).catch((err) => {
    packageJsonLoader.fail();
    logger.error(err.message);
    process.exit(1);
  });
  packageJsonLoader.succeed("Verified package.json");
  const config = await loadConfig({ cwd, logger });
  const extMap = getExportExtensionMap();
  const ctx = await createBuildContext({
    config: { ...config },
    cwd,
    extMap,
    logger,
    pkg: packageJson
  }).catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });
  logger.debug(`Build context: ${os.EOL}`, ctx);
  const missingExports = [];
  const checkingFilePathsLoader = ora(`Checking files for exports`).start();
  for (const exp of Object.values(ctx.exports)) {
    if (exp.source && !await pathExists(resolve(ctx.cwd, exp.source))) {
      missingExports.push(exp.source);
    }
    if (exp.types && !await pathExists(resolve(ctx.cwd, exp.types))) {
      missingExports.push(exp.types);
    }
    if (exp.require && !await pathExists(resolve(ctx.cwd, exp.require))) {
      missingExports.push(exp.require);
    }
    if (exp.import && !await pathExists(resolve(ctx.cwd, exp.import))) {
      missingExports.push(exp.import);
    }
    if (exp.module && !await pathExists(resolve(ctx.cwd, exp.module))) {
      missingExports.push(exp.module);
    }
    if (exp.default && !await pathExists(resolve(ctx.cwd, exp.default))) {
      missingExports.push(exp.default);
    }
    if (exp.browser) {
      if (exp.browser.source && !await pathExists(resolve(ctx.cwd, exp.browser.source))) {
        missingExports.push(exp.browser.source);
      }
      if (exp.browser.import && !await pathExists(resolve(ctx.cwd, exp.browser.import))) {
        missingExports.push(exp.browser.import);
      }
      if (exp.browser.require && !await pathExists(resolve(ctx.cwd, exp.browser.require))) {
        missingExports.push(exp.browser.require);
      }
    }
    if (exp.node) {
      if (exp.node.source && !await pathExists(resolve(ctx.cwd, exp.node.source))) {
        missingExports.push(exp.node.source);
      }
      if (exp.node.import && !await pathExists(resolve(ctx.cwd, exp.node.import))) {
        missingExports.push(exp.node.import);
      }
      if (exp.node.require && !await pathExists(resolve(ctx.cwd, exp.node.require))) {
        missingExports.push(exp.node.require);
      }
      if (exp.node.module && !await pathExists(resolve(ctx.cwd, exp.node.module))) {
        missingExports.push(exp.node.module);
      }
    }
  }
  if (missingExports.length) {
    checkingFilePathsLoader.fail("");
    logger.error(
      [
        "Missing files for exports:",
        ...missingExports.map((str) => `    ${chalk.blue(str)} -> ${resolve(ctx.cwd, str)}`)
      ].join(os.EOL)
    );
    process.exit(1);
  }
  checkingFilePathsLoader.succeed("");
  const exportPaths = Object.values(ctx.exports).reduce(
    (acc, exp) => {
      if (exp.require) {
        acc.require.push(exp.require);
      }
      if (exp.import) {
        acc.import.push(exp.import);
      }
      return acc;
    },
    {
      require: [],
      import: []
    }
  );
  if (exportPaths.import.length > 0) {
    await resolveExports(exportPaths.import, {
      cwd: ctx.cwd,
      external: ctx.external,
      format: "esm",
      logger
    });
  }
  if (exportPaths.require.length > 0) {
    await resolveExports(exportPaths.require, {
      cwd: ctx.cwd,
      external: ctx.external,
      format: "cjs",
      logger
    });
  }
};
const resolveExports = async (paths, { cwd, format, external, logger }) => {
  const esbuildLoader = ora(`Resolving ${format} exports`).start();
  const code = paths.map((id) => format === "esm" ? `import('${id}');` : `require('${id}');`).join(os.EOL);
  try {
    const esbuildResult = await esbuild.build({
      bundle: true,
      external,
      format,
      logLevel: "silent",
      // otherwise output maps to stdout as we're using stdin
      outfile: "/dev/null",
      platform: "node",
      stdin: {
        contents: code,
        loader: "js",
        resolveDir: cwd
      }
    });
    if (esbuildResult.errors.length > 0) {
      for (const msg of esbuildResult.errors) {
        printESBuildMessage(msg, logger.error);
      }
      esbuildLoader.fail();
      process.exit(1);
    }
    const esbuildWarnings = esbuildResult.warnings.filter(
      (msg) => !(msg.detail || msg.text).includes(`does not affect esbuild's own target setting`)
    );
    for (const msg of esbuildWarnings) {
      printESBuildMessage(msg, logger.warn);
    }
    esbuildLoader.succeed();
  } catch (err) {
    if (isESBuildError(err)) {
      for (const msg of err.errors) {
        printESBuildMessage(msg, logger.error);
      }
    }
    esbuildLoader.fail();
    process.exit(1);
  }
};
const isESBuildError = (err) => {
  return isError(err) && "errors" in err && "warnings" in err;
};
const printESBuildMessage = (msg, log) => {
  if (msg.location) {
    log(
      [
        `${msg.detail || msg.text}`,
        `${msg.location.line} | ${msg.location.lineText}`,
        `in ./${msg.location.file}:${msg.location.line}:${msg.location.column}`
      ].join(os.EOL)
    );
  } else {
    log(msg.detail || msg.text);
  }
};
const resolveConfigPath = async ({ cwd }) => {
  const configPath = path__default.join(os.homedir(), ".gitconfig");
  try {
    await fs$1.access(configPath);
    return path__default.resolve(cwd, configPath);
  } catch (err) {
    return null;
  }
};
const parseIni = (str) => {
  const normalisedString = str.replace(/\[(\S+) "(.*)"\]/g, (m, $1, $2) => {
    return $1 && $2 ? `[${$1} "${$2.split(".").join("\\.")}"]` : m;
  });
  return ini.parse(normalisedString);
};
const parseGlobalGitConfig = async () => {
  const cwd = process.cwd();
  const filepath = await resolveConfigPath({ cwd });
  if (!filepath) {
    return null;
  }
  const file = await fs$1.stat(filepath).then(() => fs$1.readFile(filepath, "utf8"));
  return parseIni(file);
};
const createPackageFromTemplate = async (packagePath, opts) => {
  const { cwd, logger, template: templateOrResolver } = opts;
  const gitConfig = await parseGlobalGitConfig();
  const template = typeof templateOrResolver === "function" ? await templateOrResolver({ cwd, logger, packagePath, gitConfig }) : templateOrResolver;
  logger.info("Creating a new package at: ", relative(cwd, packagePath));
  logger.debug("Loaded template:", os.EOL, template);
  const answers = [];
  if (Array.isArray(template.prompts)) {
    for (const prompt of template.prompts) {
      if ("type" in prompt) {
        const res = await prompts(prompt, {
          onCancel() {
            process.exit(0);
          }
        });
        answers.push({ name: prompt.name, answer: res[prompt.name] });
      } else {
        const res = prompt.optional ? await prompts({
          type: "confirm",
          name: "confirm",
          message: `use ${prompt.name}?`,
          initial: prompt.initial
        }) : null;
        answers.push({
          name: prompt.name,
          answer: res?.confirm ?? !prompt.optional
        });
      }
    }
    logger.debug(
      [
        "User answers: ",
        ...answers.map((ans) => `    ${ans.name}: ${JSON.stringify(ans.answer)}`)
      ].join(os.EOL)
    );
  }
  const files = await template.getFiles(answers);
  logger.debug(
    ["Files to write: ", ...files.map((f) => `    ${f.name}: ${f.contents}`)].join(os.EOL)
  );
  files.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  for (const file of files) {
    const filePath = resolve(packagePath, file.name);
    await mkdir(dirname(filePath), { recursive: true });
    const defaultPrettierConfig = {
      endOfLine: "lf",
      tabWidth: 2,
      printWidth: 100,
      singleQuote: true,
      trailingComma: "es5"
    };
    try {
      const formattedContents = prettier.format(file.contents, {
        ...defaultPrettierConfig,
        filepath: filePath
      });
      await writeFile(filePath, `${formattedContents.trim()}${os.EOL}`);
    } catch (err) {
      if (isError(err)) {
        logger.debug(err.message);
      }
      await writeFile(filePath, `${file.contents.trim()}${os.EOL}`);
    }
    logger.success(`Wrote ${relative(cwd, filePath)}`);
  }
};
const defineTemplate = (template) => template;
const definePackageOption = (option) => option;
const definePackageFeature = (feature) => feature;
const editorConfigFile = {
  name: ".editorconfig",
  contents: outdent`
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    
    [{package.json,*.yml}]
    indent_style = space
    indent_size = 2
    
    [*.md]
    trim_trailing_whitespace = false
    `
};
const gitIgnoreFile = {
  name: ".gitignore",
  contents: outdent`
    # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

    # dependencies
    node_modules
    .pnp
    .pnp.js
    
    # testing
    coverage
    
    # production
    dist
    
    # misc
    .DS_Store
    *.pem
    
    # debug
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    
    # local env files
    .env
    .env.local
    .env.development.local
    .env.test.local
    .env.production.local        
    `
};
const prettierFile = {
  name: ".prettierrc",
  contents: outdent`
      {
        "endOfLine": 'lf',
        "tabWidth": 2,
        "printWidth": 100,
        "singleQuote": true,
        "trailingComma": 'es5',
      }
    `
};
const prettierIgnoreFile = {
  name: ".prettierignore",
  contents: outdent`
      dist
      coverage
    `
};
const PACKAGE_NAME_REGEXP = /^(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)\/)?[a-z0-9-~][a-z0-9-._~]*$/i;
const defaultTemplate = defineTemplate(async ({ logger, gitConfig }) => {
  let repo;
  return {
    prompts: [
      definePackageOption({
        name: "repo",
        type: "text",
        message: "git url",
        validate(v) {
          if (!v) {
            return true;
          }
          try {
            const result = gitUrlParse(v);
            repo = { source: result.source, owner: result.owner, name: result.name };
            return true;
          } catch (err) {
            return "invalid git url";
          }
        }
      }),
      definePackageOption({
        name: "pkgName",
        type: "text",
        message: "package name",
        initial: () => repo?.name ?? "",
        validate(v) {
          if (!v) {
            return "package name is required";
          }
          const match = PACKAGE_NAME_REGEXP.exec(v);
          if (!match) {
            return "invalid package name";
          }
          return true;
        }
      }),
      definePackageOption({
        name: "description",
        type: "text",
        message: "package description"
      }),
      definePackageOption({
        name: "authorName",
        type: "text",
        message: "package author name",
        initial: gitConfig?.user?.name
      }),
      definePackageOption({
        name: "authorEmail",
        type: "text",
        message: "package author email",
        initial: gitConfig?.user?.email
      }),
      definePackageOption({
        name: "license",
        type: "text",
        message: "package license",
        initial: "MIT",
        validate(v) {
          if (!v) {
            return "license is required";
          }
          return true;
        }
      }),
      definePackageFeature({
        name: "typescript",
        initial: true,
        optional: true
      }),
      definePackageFeature({
        name: "eslint",
        initial: true,
        optional: true
      })
    ],
    async getFiles(answers) {
      const devDepsToInstall = [];
      const author = [];
      let isTypescript = false;
      const files = [];
      const pkgJson = {
        version: "0.0.0",
        keywords: [],
        type: "commonjs",
        exports: {
          // @ts-expect-error yup typings are a bit weak.
          ".": {
            require: "./dist/index.js",
            import: "./dist/index.mjs",
            source: "",
            default: "./dist/index.js"
          },
          "./package.json": "./package.json"
        },
        main: "./dist/index.js",
        module: "./dist/index.mjs",
        files: ["dist"],
        scripts: {
          check: "pack-up check",
          build: "pack-up build",
          watch: "pack-up watch"
        },
        dependencies: {},
        devDependencies: {
          /**
           * We set * as a default version, but further down
           * we try to resolve each package to their latest
           * version, failing that we leave the fallback of *.
           */
          "@strapi/pack-up": "*",
          prettier: "*"
        }
      };
      if (Array.isArray(answers)) {
        for (const ans of answers) {
          const { name, answer } = ans;
          switch (name) {
            case "pkgName": {
              pkgJson.name = String(answer);
              break;
            }
            case "description": {
              pkgJson.description = String(answer) ?? void 0;
              break;
            }
            case "authorName": {
              author.push(String(answer));
              break;
            }
            case "authorEmail": {
              if (answer) {
                author.push(`<${answer}>`);
              }
              break;
            }
            case "license": {
              pkgJson.license = String(answer);
              break;
            }
            case "typescript": {
              isTypescript = Boolean(answer);
              pkgJson.source = isTypescript ? "./src/index.ts" : "./src/index.js";
              if (isRecord(pkgJson.exports["."])) {
                pkgJson.exports["."].source = isTypescript ? "./src/index.ts" : "./src/index.js";
              }
              if (isTypescript) {
                pkgJson.types = "./dist/index.d.ts";
                if (isRecord(pkgJson.exports["."])) {
                  pkgJson.exports["."] = {
                    // @ts-expect-error it won't be overwritten.
                    types: "./dist/index.d.ts",
                    ...pkgJson.exports["."]
                  };
                }
                pkgJson.scripts = {
                  ...pkgJson.scripts,
                  "test:ts": "tsc --build"
                };
                devDepsToInstall.push("typescript");
                const { tsconfigBuildFile, tsconfigFile } = await import("./_chunks/typescript-8yp7F_w3.mjs");
                files.push(tsconfigFile, tsconfigBuildFile);
              }
              files.push({
                name: isTypescript ? "src/index.ts" : "src/index.js",
                contents: outdent`
                  /**
                   * @public
                   */
                  const main = () => {
                    // silence is golden
                  }

                  export { main }
                `
              });
              break;
            }
            case "eslint": {
              if (answer) {
                const eslintConfig = {
                  root: true,
                  env: {
                    browser: true,
                    es6: true,
                    node: true
                  },
                  extends: ["eslint:recommended", "plugin:prettier/recommended"],
                  parserOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module"
                  },
                  plugins: ["prettier"]
                };
                if (isTypescript) {
                  eslintConfig.overrides = [
                    {
                      files: ["**/*.ts", "**/*.tsx"],
                      parser: "@typescript-eslint/parser",
                      parserOptions: {
                        project: ["./tsconfig.eslint.json"]
                      },
                      extends: [
                        "eslint:recommended",
                        "plugin:prettier/recommended",
                        "plugin:@typescript-eslint/eslint-recommended",
                        "plugin:@typescript-eslint/recommended"
                      ],
                      plugins: ["@typescript-eslint", "prettier"]
                    }
                  ];
                  const { tsconfigEslintFile } = await import("./_chunks/typescript-8yp7F_w3.mjs");
                  files.push(tsconfigEslintFile);
                }
                pkgJson.scripts = {
                  ...pkgJson.scripts,
                  lint: isTypescript ? "eslint . --ext .cjs,.js,.ts,.tsx" : "eslint . --ext .cjs,.js"
                };
                devDepsToInstall.push("eslint", "eslint-config-prettier", "eslint-plugin-prettier");
                if (isTypescript) {
                  devDepsToInstall.push(
                    "@typescript-eslint/eslint-plugin",
                    "@typescript-eslint/parser"
                  );
                }
                const { eslintIgnoreFile } = await import("./_chunks/eslint-2bUIRH85.mjs");
                files.push(
                  {
                    name: ".eslintrc",
                    contents: outdent`
                    ${JSON.stringify(eslintConfig, null, 2)}
                  `
                  },
                  eslintIgnoreFile
                );
              }
              break;
            }
          }
        }
      }
      if (repo) {
        pkgJson.repository = {
          type: "git",
          url: `git+ssh://git@${repo.source}/${repo.owner}/${repo.name}.git`
        };
        pkgJson.bugs = {
          url: `https://${repo.source}/${repo.owner}/${repo.name}/issues`
        };
        pkgJson.homepage = `https://${repo.source}/${repo.owner}/${repo.name}#readme`;
      }
      pkgJson.author = author.filter(Boolean).join(" ") ?? void 0;
      try {
        pkgJson.devDependencies = await resolveLatestVerisonOfDeps([
          ...devDepsToInstall,
          ...Object.keys(pkgJson.devDependencies)
        ]);
      } catch (err) {
        if (isError(err)) {
          logger.error(err.message);
        } else {
          logger.error(err);
        }
      }
      files.push({
        name: "package.json",
        contents: outdent`
          ${JSON.stringify(pkgJson, null, 2)}
        `
      });
      files.push(prettierFile, prettierIgnoreFile, editorConfigFile, gitIgnoreFile);
      return files;
    }
  };
});
const isRecord = (value) => Boolean(value) && !Array.isArray(value) && typeof value === "object";
const resolveLatestVerisonOfDeps = async (deps) => {
  const latestDeps = {};
  for (const name of deps) {
    try {
      const latestVersion = await getLatestVersion(name, "*");
      latestDeps[name] = latestVersion ? `^${latestVersion}` : "*";
    } catch (err) {
      latestDeps[name] = "*";
    }
  }
  return latestDeps;
};
const loadTemplate = (path2, { logger }) => {
  const configPath = resolve(path2);
  const exists = existsSync(configPath);
  if (exists) {
    const esbuildOptions = { extensions: [".js", ".mjs", ".ts"] };
    const { unregister } = register(esbuildOptions);
    const mod = require(configPath);
    unregister();
    if (!mod) {
      logger.warn(`Could not find template at: ${path2}. Are you sure it exists?`);
      return void 0;
    }
    logger.debug("Loaded user provided template from: ", path2);
    return mod?.default || mod;
  }
  logger.warn(`Could not find template at: ${path2}. Are you sure it exists?`);
  return void 0;
};
const init = async (opts) => {
  const { silent, debug, cwd = process.cwd(), path: path2 } = opts;
  let { template = defaultTemplate } = opts;
  const logger = createLogger({ silent, debug });
  if (!path2) {
    logger.error("Path is a required option");
    process.exit(1);
  }
  const packageRoot = resolve(cwd, path2);
  logger.debug("Package is: ", packageRoot);
  if (typeof template === "string") {
    const templatePath = resolve(cwd, template);
    const userTemplate = loadTemplate(templatePath, { logger });
    if (userTemplate) {
      template = userTemplate;
    } else {
      template = defaultTemplate;
    }
  }
  await ensurePackagePathIsViable(packageRoot).catch((err) => {
    if (isError(err)) {
      logger.error(err.message);
    }
    process.exit(1);
  });
  logger.debug("Package path is viable");
  await createPackageFromTemplate(packageRoot, {
    logger,
    cwd,
    template
  });
};
export {
  build,
  check,
  defineConfig,
  definePackageFeature,
  definePackageOption,
  defineTemplate,
  init,
  watch
};
//# sourceMappingURL=index.mjs.map
