"use strict";
const chalk = require("chalk");
const fs$1 = require("fs/promises");
const os = require("os");
const pkgUp = require("pkg-up");
const yup = require("yup");
const browserslistToEsbuild = require("browserslist-to-esbuild");
const path = require("path");
const node = require("esbuild-register/dist/node");
const fs = require("fs");
const ts = require("typescript");
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
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const fs__default = /* @__PURE__ */ _interopDefault(fs$1);
const os__default = /* @__PURE__ */ _interopDefault(os);
const pkgUp__default = /* @__PURE__ */ _interopDefault(pkgUp);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const browserslistToEsbuild__default = /* @__PURE__ */ _interopDefault(browserslistToEsbuild);
const path__namespace = /* @__PURE__ */ _interopNamespace(path);
const fs__namespace = /* @__PURE__ */ _interopNamespace(fs);
const ts__default = /* @__PURE__ */ _interopDefault(ts);
const CONFIG_FILE_NAMES = [
  "packup.config.ts",
  "packup.config.js",
  "packup.config.cjs",
  "packup.config.mjs"
];
const loadConfig = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp__default.default({ cwd });
  if (!pkgPath) {
    logger.debug(
      "Could not find a package.json in the current directory, therefore no config was loaded"
    );
    return void 0;
  }
  const root = path__namespace.dirname(pkgPath);
  for (const fileName of CONFIG_FILE_NAMES) {
    const configPath = path__namespace.resolve(root, fileName);
    const exists = fs__namespace.existsSync(configPath);
    if (exists) {
      const esbuildOptions = { extensions: [".js", ".mjs", ".ts"] };
      const { unregister } = node.register(esbuildOptions);
      const mod = require(configPath);
      unregister();
      const config = mod?.default || mod || void 0;
      if (config) {
        logger.debug("Loaded configuration:", os__default.default.EOL, config);
      }
      return config;
    }
  }
  return void 0;
};
function resolveConfigProperty(prop, initialValue) {
  if (!prop) {
    return initialValue;
  }
  if (typeof prop === "function") {
    return prop(initialValue);
  }
  return prop;
}
const validateExportsOrdering = async ({
  pkg,
  logger
}) => {
  if (pkg.exports) {
    const exports2 = Object.entries(pkg.exports);
    for (const [expPath, exp] of exports2) {
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
    throw new Error(`${os__default.default.EOL}- ${errors.join(`${os__default.default.EOL}- `)}`);
  }
  return _exports;
};
const record = (value) => yup__namespace.object(
  typeof value === "object" && value ? Object.entries(value).reduce((acc, [key]) => {
    acc[key] = yup__namespace.string().required();
    return acc;
  }, {}) : {}
).optional();
const packageJsonSchema = yup__namespace.object({
  name: yup__namespace.string().required(),
  version: yup__namespace.string().required(),
  description: yup__namespace.string().optional(),
  author: yup__namespace.lazy((value) => {
    if (typeof value === "object") {
      return yup__namespace.object({
        name: yup__namespace.string().required(),
        email: yup__namespace.string().optional(),
        url: yup__namespace.string().optional()
      }).optional();
    }
    return yup__namespace.string().optional();
  }),
  keywords: yup__namespace.array(yup__namespace.string()).optional(),
  type: yup__namespace.mixed().oneOf(["commonjs", "module"]).optional(),
  license: yup__namespace.string().optional(),
  repository: yup__namespace.object({
    type: yup__namespace.string().required(),
    url: yup__namespace.string().required()
  }).optional(),
  bugs: yup__namespace.object({
    url: yup__namespace.string().required()
  }).optional(),
  homepage: yup__namespace.string().optional(),
  // TODO: be nice just to make this either a string or a record of strings.
  bin: yup__namespace.lazy((value) => {
    if (typeof value === "object") {
      return record(value);
    }
    return yup__namespace.string().optional();
  }),
  // TODO: be nice just to make this either a string or a record of strings.
  browser: yup__namespace.lazy((value) => {
    if (typeof value === "object") {
      return record(value);
    }
    return yup__namespace.string().optional();
  }),
  main: yup__namespace.string().optional(),
  module: yup__namespace.string().optional(),
  source: yup__namespace.string().optional(),
  types: yup__namespace.string().optional(),
  exports: yup__namespace.lazy(
    (value) => yup__namespace.object(
      typeof value === "object" ? Object.entries(value).reduce((acc, [key, value2]) => {
        if (typeof value2 === "object") {
          acc[key] = yup__namespace.object({
            types: yup__namespace.string().optional(),
            source: yup__namespace.string().required(),
            browser: yup__namespace.object({
              source: yup__namespace.string().required(),
              import: yup__namespace.string().optional(),
              require: yup__namespace.string().optional()
            }).optional(),
            node: yup__namespace.object({
              source: yup__namespace.string().optional(),
              module: yup__namespace.string().optional(),
              import: yup__namespace.string().optional(),
              require: yup__namespace.string().optional()
            }).optional(),
            module: yup__namespace.string().optional(),
            import: yup__namespace.string().optional(),
            require: yup__namespace.string().optional(),
            default: yup__namespace.string().required()
          }).noUnknown(true);
        } else {
          acc[key] = yup__namespace.string().matches(/^\.\/.*\.json$/).required();
        }
        return acc;
      }, {}) : void 0
    ).optional()
  ),
  files: yup__namespace.array(yup__namespace.string()).optional(),
  scripts: yup__namespace.lazy(record),
  dependencies: yup__namespace.lazy(record),
  devDependencies: yup__namespace.lazy(record),
  peerDependencies: yup__namespace.lazy(record),
  engines: yup__namespace.lazy(record),
  browserslist: yup__namespace.array(yup__namespace.string().required()).optional()
});
const loadPkg = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp__default.default({ cwd });
  if (!pkgPath) {
    throw new Error("Could not find a package.json in the current directory");
  }
  const buffer = await fs__default.default.readFile(pkgPath);
  const pkg = JSON.parse(buffer.toString());
  logger.debug("Loaded package.json:", os__default.default.EOL, pkg);
  return pkg;
};
const validatePkg = async ({ pkg }) => {
  try {
    const validatedPkg = await packageJsonSchema.validate(pkg, {
      strict: true
    });
    return validatedPkg;
  } catch (err) {
    if (err instanceof yup__namespace.ValidationError) {
      switch (err.type) {
        case "required":
          if (err.path) {
            throw new Error(
              `'${err.path}' in 'package.json' is required as type '${chalk__default.default.magenta(
                yup__namespace.reach(packageJsonSchema, err.path).type
              )}'`
            );
          }
          break;
        case "matches":
          if (err.params && err.path && "value" in err.params && "regex" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' must be of type '${chalk__default.default.magenta(
                err.params.regex
              )}' (recieved the value '${chalk__default.default.magenta(err.params.value)}')`
            );
          }
          break;
        case "noUnknown":
          if (err.path && err.params && "unknown" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' contains the unknown key ${chalk__default.default.magenta(
                err.params.unknown
              )}, for compatability only the following keys are allowed: ${chalk__default.default.magenta(
                "['types', 'source', 'import', 'require', 'default']"
              )}`
            );
          }
          break;
        default:
          if (err.path && err.params && "type" in err.params && "value" in err.params) {
            throw new Error(
              `'${err.path}' in 'package.json' must be of type '${chalk__default.default.magenta(
                err.params.type
              )}' (recieved '${chalk__default.default.magenta(typeof err.params.value)}')`
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
  const providedPath = path2.split(path__namespace.default.sep);
  const [configFileName] = providedPath.slice(-1);
  const pathToConfig = path__namespace.default.join(cwd, providedPath.slice(0, -1).join(path__namespace.default.sep));
  const configPath = ts__default.default.findConfigFile(pathToConfig, ts__default.default.sys.fileExists, configFileName);
  if (!configPath) {
    return void 0;
  }
  const configFile = ts__default.default.readConfigFile(configPath, ts__default.default.sys.readFile);
  const parsedConfig = ts__default.default.parseJsonConfigFileContent(configFile.config, ts__default.default.sys, pathToConfig);
  logger.debug(`Loaded user TS config:`, os__default.default.EOL, parsedConfig);
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
  logger.debug(`Using TS config:`, os__default.default.EOL, parsedConfig);
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
    "*": browserslistToEsbuild__default.default(pkg.browserslist ?? DEFAULT_BROWSERS_LIST_CONFIG),
    node: browserslistToEsbuild__default.default(["node 18.0.0"]),
    web: ["esnext"]
  };
  const parsedExports = parseExports({ extMap, pkg }).reduce((acc, x) => {
    const { _path: exportPath, ...exportEntry } = x;
    return { ...acc, [exportPath]: exportEntry };
  }, {});
  const exports2 = resolveConfigProperty(config.exports, parsedExports);
  const parsedExternals = [
    ...pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    ...pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []
  ];
  const external = config && Array.isArray(config.externals) ? [...parsedExternals, ...config.externals] : parsedExternals;
  const outputPaths = Object.values(exports2).flatMap((exportEntry) => {
    return [
      exportEntry.import,
      exportEntry.require,
      exportEntry.browser?.import,
      exportEntry.browser?.require,
      exportEntry.node?.source && exportEntry.node.import,
      exportEntry.node?.source && exportEntry.node.require
    ].filter(Boolean);
  }).map((p) => path__namespace.default.resolve(cwd, p));
  const commonDistPath = findCommonDirPath(outputPaths);
  if (commonDistPath === cwd) {
    throw new Error(
      "all output files must share a common parent directory which is not the root package directory"
    );
  }
  if (commonDistPath && !pathContains(cwd, commonDistPath)) {
    throw new Error("all output files must be located within the package");
  }
  const configDistPath = config?.dist ? path__namespace.default.resolve(cwd, config.dist) : void 0;
  const distPath = configDistPath || commonDistPath;
  if (!distPath) {
    throw new Error("could not detect 'dist' path");
  }
  return {
    config,
    cwd,
    distPath,
    exports: exports2,
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
  return !path__namespace.default.relative(containerPath, itemPath).startsWith("..");
};
const findCommonDirPath = (filePaths) => {
  let commonPath;
  for (const filePath of filePaths) {
    let dirPath = path__namespace.default.dirname(filePath);
    if (!commonPath) {
      commonPath = dirPath;
      continue;
    }
    while (dirPath !== commonPath) {
      dirPath = path__namespace.default.dirname(dirPath);
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
exports.CONFIG_FILE_NAMES = CONFIG_FILE_NAMES;
exports.createBuildContext = createBuildContext;
exports.getExportExtensionMap = getExportExtensionMap;
exports.loadConfig = loadConfig;
exports.loadPkg = loadPkg;
exports.loadTsConfig = loadTsConfig;
exports.resolveConfigProperty = resolveConfigProperty;
exports.validateExportsOrdering = validateExportsOrdering;
exports.validatePkg = validatePkg;
//# sourceMappingURL=createBuildContext-teXLqX5U.js.map
