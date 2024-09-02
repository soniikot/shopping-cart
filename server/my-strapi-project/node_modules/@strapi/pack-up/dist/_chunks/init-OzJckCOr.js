"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("path");
const errors = require("./errors-ov7Nr9g3.js");
const files = require("./files-pIit-45R.js");
const fs = require("fs/promises");
const os = require("os");
const prettier = require("prettier");
const prompts = require("prompts");
const ini = require("ini");
const getLatestVersion = require("get-latest-version");
const gitUrlParse = require("git-url-parse");
const outdent = require("outdent");
const node = require("esbuild-register/dist/node");
const fs$1 = require("fs");
require("chalk");
require("boxen");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const os__default = /* @__PURE__ */ _interopDefault(os);
const prettier__default = /* @__PURE__ */ _interopDefault(prettier);
const prompts__default = /* @__PURE__ */ _interopDefault(prompts);
const ini__default = /* @__PURE__ */ _interopDefault(ini);
const getLatestVersion__default = /* @__PURE__ */ _interopDefault(getLatestVersion);
const gitUrlParse__default = /* @__PURE__ */ _interopDefault(gitUrlParse);
const resolveConfigPath = async ({ cwd }) => {
  const configPath = path__default.default.join(os__default.default.homedir(), ".gitconfig");
  try {
    await fs__default.default.access(configPath);
    return path__default.default.resolve(cwd, configPath);
  } catch (err) {
    return null;
  }
};
const parseIni = (str) => {
  const normalisedString = str.replace(/\[(\S+) "(.*)"\]/g, (m, $1, $2) => {
    return $1 && $2 ? `[${$1} "${$2.split(".").join("\\.")}"]` : m;
  });
  return ini__default.default.parse(normalisedString);
};
const parseGlobalGitConfig = async () => {
  const cwd = process.cwd();
  const filepath = await resolveConfigPath({ cwd });
  if (!filepath) {
    return null;
  }
  const file = await fs__default.default.stat(filepath).then(() => fs__default.default.readFile(filepath, "utf8"));
  return parseIni(file);
};
const createPackageFromTemplate = async (packagePath, opts) => {
  const { cwd, logger, template: templateOrResolver } = opts;
  const gitConfig = await parseGlobalGitConfig();
  const template = typeof templateOrResolver === "function" ? await templateOrResolver({ cwd, logger, packagePath, gitConfig }) : templateOrResolver;
  logger.info("Creating a new package at: ", path.relative(cwd, packagePath));
  logger.debug("Loaded template:", os__default.default.EOL, template);
  const answers = [];
  if (Array.isArray(template.prompts)) {
    for (const prompt of template.prompts) {
      if ("type" in prompt) {
        const res = await prompts__default.default(prompt, {
          onCancel() {
            process.exit(0);
          }
        });
        answers.push({ name: prompt.name, answer: res[prompt.name] });
      } else {
        const res = prompt.optional ? await prompts__default.default({
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
      ].join(os__default.default.EOL)
    );
  }
  const files2 = await template.getFiles(answers);
  logger.debug(
    ["Files to write: ", ...files2.map((f) => `    ${f.name}: ${f.contents}`)].join(os__default.default.EOL)
  );
  files2.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  for (const file of files2) {
    const filePath = path.resolve(packagePath, file.name);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const defaultPrettierConfig = {
      endOfLine: "lf",
      tabWidth: 2,
      printWidth: 100,
      singleQuote: true,
      trailingComma: "es5"
    };
    try {
      const formattedContents = prettier__default.default.format(file.contents, {
        ...defaultPrettierConfig,
        filepath: filePath
      });
      await fs.writeFile(filePath, `${formattedContents.trim()}${os__default.default.EOL}`);
    } catch (err) {
      if (errors.isError(err)) {
        logger.debug(err.message);
      }
      await fs.writeFile(filePath, `${file.contents.trim()}${os__default.default.EOL}`);
    }
    logger.success(`Wrote ${path.relative(cwd, filePath)}`);
  }
};
const defineTemplate = (template) => template;
const definePackageOption = (option) => option;
const definePackageFeature = (feature) => feature;
const editorConfigFile = {
  name: ".editorconfig",
  contents: outdent.outdent`
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
  contents: outdent.outdent`
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
  contents: outdent.outdent`
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
  contents: outdent.outdent`
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
            const result = gitUrlParse__default.default(v);
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
      const files2 = [];
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
                const { tsconfigBuildFile, tsconfigFile } = await Promise.resolve().then(() => require("./typescript-UNrF5BlF.js"));
                files2.push(tsconfigFile, tsconfigBuildFile);
              }
              files2.push({
                name: isTypescript ? "src/index.ts" : "src/index.js",
                contents: outdent.outdent`
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
                  const { tsconfigEslintFile } = await Promise.resolve().then(() => require("./typescript-UNrF5BlF.js"));
                  files2.push(tsconfigEslintFile);
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
                const { eslintIgnoreFile } = await Promise.resolve().then(() => require("./eslint-piXoTM-k.js"));
                files2.push(
                  {
                    name: ".eslintrc",
                    contents: outdent.outdent`
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
        if (errors.isError(err)) {
          logger.error(err.message);
        } else {
          logger.error(err);
        }
      }
      files2.push({
        name: "package.json",
        contents: outdent.outdent`
          ${JSON.stringify(pkgJson, null, 2)}
        `
      });
      files2.push(prettierFile, prettierIgnoreFile, editorConfigFile, gitIgnoreFile);
      return files2;
    }
  };
});
const isRecord = (value) => Boolean(value) && !Array.isArray(value) && typeof value === "object";
const resolveLatestVerisonOfDeps = async (deps) => {
  const latestDeps = {};
  for (const name of deps) {
    try {
      const latestVersion = await getLatestVersion__default.default(name, "*");
      latestDeps[name] = latestVersion ? `^${latestVersion}` : "*";
    } catch (err) {
      latestDeps[name] = "*";
    }
  }
  return latestDeps;
};
const loadTemplate = (path$1, { logger }) => {
  const configPath = path.resolve(path$1);
  const exists = fs$1.existsSync(configPath);
  if (exists) {
    const esbuildOptions = { extensions: [".js", ".mjs", ".ts"] };
    const { unregister } = node.register(esbuildOptions);
    const mod = require(configPath);
    unregister();
    if (!mod) {
      logger.warn(`Could not find template at: ${path$1}. Are you sure it exists?`);
      return void 0;
    }
    logger.debug("Loaded user provided template from: ", path$1);
    return mod?.default || mod;
  }
  logger.warn(`Could not find template at: ${path$1}. Are you sure it exists?`);
  return void 0;
};
const init$1 = async (opts) => {
  const { silent, debug, cwd = process.cwd(), path: path$1 } = opts;
  let { template = defaultTemplate } = opts;
  const logger = errors.createLogger({ silent, debug });
  if (!path$1) {
    logger.error("Path is a required option");
    process.exit(1);
  }
  const packageRoot = path.resolve(cwd, path$1);
  logger.debug("Package is: ", packageRoot);
  if (typeof template === "string") {
    const templatePath = path.resolve(cwd, template);
    const userTemplate = loadTemplate(templatePath, { logger });
    if (userTemplate) {
      template = userTemplate;
    } else {
      template = defaultTemplate;
    }
  }
  await files.ensurePackagePathIsViable(packageRoot).catch((err) => {
    if (errors.isError(err)) {
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
const init = async (options) => {
  try {
    await init$1(options);
  } catch (err) {
    errors.handleError(err);
  }
};
exports.init = init;
//# sourceMappingURL=init-OzJckCOr.js.map
