import pluralize from "pluralize";
import { join } from "path";
import fs from "fs-extra";
import tsUtils from "@strapi/typescript-utils";
import slugify from "@sindresorhus/slugify";
import * as utils from "@strapi/utils";
import chalk from "chalk";
const validateInput = (input) => {
  const regex = /^[A-Za-z-]+$/g;
  if (!input) {
    return "You must provide an input";
  }
  return regex.test(input) || "Please use only letters, '-' and no spaces";
};
const generateApi = (plop) => {
  plop.setGenerator("api", {
    description: "Generate a basic API",
    prompts: [
      {
        type: "input",
        name: "id",
        message: "API name",
        validate: (input) => validateInput(input)
      },
      {
        type: "confirm",
        name: "isPluginApi",
        message: "Is this API for a plugin?"
      },
      {
        when: (answers) => answers.isPluginApi,
        type: "list",
        name: "plugin",
        message: "Plugin name",
        async choices() {
          const pluginsPath = join(plop.getDestBasePath(), "plugins");
          const exists = await fs.pathExists(pluginsPath);
          if (!exists) {
            throw Error(`Couldn't find a "plugins" directory`);
          }
          const pluginsDir = await fs.readdir(pluginsPath, { withFileTypes: true });
          const pluginsDirContent = pluginsDir.filter((fd) => fd.isDirectory());
          if (pluginsDirContent.length === 0) {
            throw Error('The "plugins" directory is empty');
          }
          return pluginsDirContent;
        }
      }
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const filePath = answers.isPluginApi && answers.plugin ? "plugins/{{ plugin }}" : "api/{{ id }}";
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      const baseActions = [
        {
          type: "add",
          path: `${filePath}/controllers/{{ id }}.${language}`,
          templateFile: `templates/${language}/controller.${language}.hbs`
        },
        {
          type: "add",
          path: `${filePath}/services/{{ id }}.${language}`,
          templateFile: `templates/${language}/service.${language}.hbs`
        }
      ];
      if (answers.isPluginApi) {
        return baseActions;
      }
      return [
        {
          type: "add",
          path: `${filePath}/routes/{{ id }}.${language}`,
          templateFile: `templates/${language}/single-route.${language}.hbs`
        },
        ...baseActions
      ];
    }
  });
};
const getDestinationPrompts = (action, basePath, { rootFolder = false } = {}) => {
  return [
    {
      type: "list",
      name: "destination",
      message: `Where do you want to add this ${action}?`,
      choices: [
        ...rootFolder ? [
          {
            name: `Add ${action} to root of project`,
            value: "root"
          }
        ] : [
          {
            name: `Add ${action} to new API`,
            value: "new"
          }
        ],
        { name: `Add ${action} to an existing API`, value: "api" },
        { name: `Add ${action} to an existing plugin`, value: "plugin" }
      ]
    },
    {
      when: (answers) => answers.destination === "api",
      type: "list",
      message: "Which API is this for?",
      name: "api",
      async choices() {
        const apiPath = join(basePath, "api");
        const exists = await fs.pathExists(apiPath);
        if (!exists) {
          throw Error(`Couldn't find an "api" directory`);
        }
        const apiDir = await fs.readdir(apiPath, { withFileTypes: true });
        const apiDirContent = apiDir.filter((fd) => fd.isDirectory());
        if (apiDirContent.length === 0) {
          throw Error('The "api" directory is empty');
        }
        return apiDirContent;
      }
    },
    {
      when: (answers) => answers.destination === "plugin",
      type: "list",
      message: "Which plugin is this for?",
      name: "plugin",
      async choices() {
        const pluginsPath = join(basePath, "plugins");
        const exists = await fs.pathExists(pluginsPath);
        if (!exists) {
          throw Error(`Couldn't find a "plugins" directory`);
        }
        const pluginsDir = await fs.readdir(pluginsPath);
        const pluginsDirContent = pluginsDir.filter(
          (api) => fs.lstatSync(join(pluginsPath, api)).isDirectory()
        );
        if (pluginsDirContent.length === 0) {
          throw Error('The "plugins" directory is empty');
        }
        return pluginsDirContent;
      }
    }
  ];
};
const getFilePath = (destination) => {
  if (destination === "api") {
    return `api/{{ api }}`;
  }
  if (destination === "plugin") {
    return `plugins/{{ plugin }}/server`;
  }
  if (destination === "root") {
    return "./";
  }
  return `api/{{ id }}`;
};
const generateController = (plop) => {
  plop.setGenerator("controller", {
    description: "Generate a controller for an API",
    prompts: [
      {
        type: "input",
        name: "id",
        message: "Controller name",
        validate: (input) => validateInput(input)
      },
      ...getDestinationPrompts("controller", plop.getDestBasePath())
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const filePath = getFilePath(answers.destination);
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      return [
        {
          type: "add",
          path: `${filePath}/controllers/{{ id }}.${language}`,
          templateFile: `templates/${language}/controller.${language}.hbs`
        }
      ];
    }
  });
};
const questions$3 = [
  {
    type: "input",
    name: "displayName",
    message: "Content type display name",
    validate: (input) => !!input
  },
  {
    type: "input",
    name: "singularName",
    message: "Content type singular name",
    default: (answers) => slugify(answers.displayName),
    validate(input) {
      if (!utils.isKebabCase(input)) {
        return "Value must be in kebab-case";
      }
      return true;
    }
  },
  {
    type: "input",
    name: "pluralName",
    message: "Content type plural name",
    default: (answers) => pluralize(answers.singularName),
    validate(input, answers) {
      if (answers.singularName === input) {
        return "Singular and plural names cannot be the same";
      }
      if (!utils.isKebabCase(input)) {
        return "Value must be in kebab-case";
      }
      return true;
    }
  }
];
const questions$2 = [
  {
    type: "list",
    name: "kind",
    message: "Please choose the model type",
    default: "collectionType",
    choices: [
      { name: "Collection Type", value: "collectionType" },
      { name: "Single Type", value: "singleType" }
    ],
    validate: (input) => validateInput(input)
  }
];
const questions$1 = [
  {
    type: "confirm",
    name: "useDraftAndPublish",
    default: false,
    message: "Use draft and publish?"
  }
];
const validateAttributeInput = (input) => {
  const regex = /^[A-Za-z-|_]+$/g;
  if (!input) {
    return "You must provide an input";
  }
  return regex.test(input) || "Please use only letters, '-', '_',  and no spaces";
};
const DEFAULT_TYPES = [
  // advanced types
  "media",
  // scalar types
  "string",
  "text",
  "richtext",
  "json",
  "enumeration",
  "password",
  "email",
  "integer",
  "biginteger",
  "float",
  "decimal",
  "date",
  "time",
  "datetime",
  "timestamp",
  "boolean"
];
const getAttributesPrompts = async (inquirer) => {
  const { addAttributes } = await inquirer.prompt([
    {
      type: "confirm",
      name: "addAttributes",
      message: "Do you want to add attributes?"
    }
  ]);
  const attributes = [];
  const createNewAttributes = async (inquirer2) => {
    const answers = await inquirer2.prompt([
      {
        type: "input",
        name: "attributeName",
        message: "Name of attribute",
        validate: (input) => validateAttributeInput(input)
      },
      {
        type: "list",
        name: "attributeType",
        message: "What type of attribute",
        pageSize: DEFAULT_TYPES.length,
        choices: DEFAULT_TYPES.map((type) => {
          return { name: type, value: type };
        })
      },
      {
        when: (answers2) => answers2.attributeType === "enumeration",
        type: "input",
        name: "enum",
        message: "Add values separated by a comma"
      },
      {
        when: (answers2) => answers2.attributeType === "media",
        type: "list",
        name: "multiple",
        message: "Choose media type",
        choices: [
          { name: "Multiple", value: true },
          { name: "Single", value: false }
        ]
      },
      {
        type: "confirm",
        name: "addAttributes",
        message: "Do you want to add another attribute?"
      }
    ]);
    attributes.push(answers);
    if (!answers.addAttributes) {
      return;
    }
    await createNewAttributes(inquirer2);
  };
  if (addAttributes) {
    await createNewAttributes(inquirer);
  } else {
    console.warn(
      `You won't be able to manage entries from the admin, you can still add attributes later from the content type builder.`
    );
  }
  return attributes;
};
const questions = [
  {
    type: "confirm",
    name: "bootstrapApi",
    default: true,
    message: "Bootstrap API related files?"
  }
];
const generateContentType = (plop) => {
  plop.setGenerator("content-type", {
    description: "Generate a content type for an API",
    async prompts(inquirer) {
      const config = await inquirer.prompt([
        ...questions$3,
        ...questions$2,
        ...questions$1
      ]);
      const attributes = await getAttributesPrompts(inquirer);
      const api = await inquirer.prompt([
        ...getDestinationPrompts("model", plop.getDestBasePath()),
        {
          when: (answers) => answers.destination === "new",
          type: "input",
          name: "id",
          default: config.singularName,
          message: "Name of the new API?",
          async validate(input) {
            if (!utils.isKebabCase(input)) {
              return "Value must be in kebab-case";
            }
            const apiPath = join(plop.getDestBasePath(), "api");
            const exists = await fs.pathExists(apiPath);
            if (!exists) {
              return true;
            }
            const apiDir = await fs.readdir(apiPath, { withFileTypes: true });
            const apiDirContent = apiDir.filter((fd) => fd.isDirectory());
            if (apiDirContent.findIndex((dir) => dir.name === input) !== -1) {
              throw new Error("This name is already taken.");
            }
            return true;
          }
        },
        ...questions
      ]);
      return {
        ...config,
        ...api,
        attributes
      };
    },
    actions(answers) {
      if (!answers) {
        return [];
      }
      const attributes = answers.attributes.reduce((object, answer) => {
        const val = { type: answer.attributeType };
        if (answer.attributeType === "enumeration") {
          val.enum = answer.enum.split(",").map((item) => item.trim());
        }
        if (answer.attributeType === "media") {
          val.allowedTypes = ["images", "files", "videos", "audios"];
          val.multiple = answer.multiple;
        }
        return Object.assign(object, { [answer.attributeName]: val }, {});
      }, {});
      const filePath = getFilePath(answers.destination);
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      const baseActions = [
        {
          type: "add",
          path: `${filePath}/content-types/{{ singularName }}/schema.json`,
          templateFile: `templates/${language}/content-type.schema.json.hbs`,
          data: {
            collectionName: slugify(answers.pluralName, { separator: "_" })
          }
        }
      ];
      if (Object.entries(attributes).length > 0) {
        baseActions.push({
          type: "modify",
          path: `${filePath}/content-types/{{ singularName }}/schema.json`,
          transform(template) {
            const parsedTemplate = JSON.parse(template);
            parsedTemplate.attributes = attributes;
            return JSON.stringify(parsedTemplate, null, 2);
          }
        });
      }
      if (answers.bootstrapApi) {
        const { singularName } = answers;
        let uid;
        if (answers.destination === "new") {
          uid = `api::${answers.id}.${singularName}`;
        } else if (answers.api) {
          uid = `api::${answers.api}.${singularName}`;
        } else if (answers.plugin) {
          uid = `plugin::${answers.plugin}.${singularName}`;
        }
        baseActions.push(
          {
            type: "add",
            path: `${filePath}/controllers/{{ singularName }}.${language}`,
            templateFile: `templates/${language}/core-controller.${language}.hbs`,
            data: { uid }
          },
          {
            type: "add",
            path: `${filePath}/services/{{ singularName }}.${language}`,
            templateFile: `templates/${language}/core-service.${language}.hbs`,
            data: { uid }
          },
          {
            type: "add",
            path: `${filePath}/routes/{{ singularName }}.${language}`,
            templateFile: `templates/${language}/core-router.${language}.hbs`,
            data: { uid }
          }
        );
      }
      return baseActions;
    }
  });
};
const LANGUAGES = {
  javascript: "JavaScript",
  typescript: "TypeScript"
};
const logInstructions = (pluginName, { language }) => {
  const maxLength = `    resolve: './src/plugins/${pluginName}'`.length;
  const separator = Array(maxLength).fill("─").join("");
  const exportInstruction = language === "js" ? "module.exports =" : "export default";
  return `
You can now enable your plugin by adding the following in ${chalk.yellow(
    `./config/plugins.${language}`
  )}
${separator}
${exportInstruction} {
  ${chalk.gray("// ...")}
  ${chalk.green(`'${pluginName}'`)}: {
    enabled: ${chalk.yellow(true)},
    resolve: ${chalk.yellow(`'./src/plugins/${pluginName}'`)}
  },
  ${chalk.gray("// ...")}
}
${separator}
`;
};
const generatePlugin = (plop) => {
  plop.setGenerator("plugin", {
    description: "Generate a basic plugin",
    prompts: [
      {
        type: "input",
        name: "pluginName",
        message: "Plugin name",
        validate: (input) => validateInput(input)
      },
      {
        type: "list",
        name: "language",
        message: "Choose your preferred language",
        choices: Object.values(LANGUAGES),
        default: LANGUAGES.javascript
      }
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const isTypescript = answers.language === LANGUAGES.typescript;
      const language = isTypescript ? "ts" : "js";
      const projectLanguage = tsUtils.isUsingTypeScriptSync(process.cwd()) ? "ts" : "js";
      if (!utils.isKebabCase(answers.pluginName)) {
        answers.pluginName = utils.toKebabCase(answers.pluginName);
        console.log(
          chalk.yellow(
            `Strapi only supports kebab-cased names for plugins.
Your plugin has been automatically renamed to "${answers.pluginName}".`
          )
        );
      }
      return [
        {
          type: "addMany",
          destination: "plugins/{{ pluginName }}",
          base: `files/${language}/plugin`,
          templateFiles: `files/${language}/plugin/**`
        },
        {
          type: "add",
          path: "plugins/{{ pluginName }}/README.md",
          templateFile: `templates/${language}/README.md.hbs`
        },
        {
          type: "add",
          path: "plugins/{{ pluginName }}/package.json",
          templateFile: `templates/${language}/plugin-package.json.hbs`
        },
        () => plop.renderString(
          logInstructions(answers.pluginName, { language: projectLanguage }),
          null
        )
      ];
    }
  });
};
const generatePolicy = (plop) => {
  plop.setGenerator("policy", {
    description: "Generate a policy for an API",
    prompts: [
      {
        type: "input",
        name: "id",
        message: "Policy name",
        validate: (input) => validateInput(input)
      },
      ...getDestinationPrompts("policy", plop.getDestBasePath(), { rootFolder: true })
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const filePath = getFilePath(answers.destination);
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      return [
        {
          type: "add",
          path: `${filePath}/policies/{{ id }}.${language}`,
          templateFile: `templates/${language}/policy.${language}.hbs`
        }
      ];
    }
  });
};
const generateMiddleware = (plop) => {
  plop.setGenerator("middleware", {
    description: "Generate a middleware for an API",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Middleware name",
        validate: (input) => validateInput(input)
      },
      ...getDestinationPrompts("middleware", plop.getDestBasePath(), { rootFolder: true })
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const filePath = getFilePath(answers.destination);
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      return [
        {
          type: "add",
          path: `${filePath}/middlewares/{{ name }}.${language}`,
          templateFile: `templates/${language}/middleware.${language}.hbs`
        }
      ];
    }
  });
};
const validateFileNameInput = (input) => {
  const regex = /^[A-Za-z-_0-9]+$/g;
  if (!input) {
    return "You must provide an input";
  }
  return regex.test(input) || "Please use only letters and number, '-' or '_' and no spaces";
};
const getFormattedDate = (date = /* @__PURE__ */ new Date()) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toJSON().replace(/[-:]/g, ".").replace(/\....Z/, "");
};
const generateMigration = (plop) => {
  plop.setGenerator("migration", {
    description: "Generate a migration",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Migration name",
        validate: (input) => validateFileNameInput(input)
      }
    ],
    actions() {
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      const timestamp = getFormattedDate();
      return [
        {
          type: "add",
          path: `${currentDir}/database/migrations/${timestamp}.{{ name }}.${language}`,
          templateFile: `templates/${language}/migration.${language}.hbs`
        }
      ];
    }
  });
};
const generateService = (plop) => {
  plop.setGenerator("service", {
    description: "Generate a service for an API",
    prompts: [
      {
        type: "input",
        name: "id",
        message: "Service name"
      },
      ...getDestinationPrompts("service", plop.getDestBasePath())
    ],
    actions(answers) {
      if (!answers) {
        return [];
      }
      const filePath = getFilePath(answers?.destination);
      const currentDir = process.cwd();
      const language = tsUtils.isUsingTypeScriptSync(currentDir) ? "ts" : "js";
      return [
        {
          type: "add",
          path: `${filePath}/services/{{ id }}.${language}`,
          templateFile: `templates/${language}/service.${language}.hbs`
        }
      ];
    }
  });
};
const plopfile = (plop) => {
  plop.setWelcomeMessage("Strapi Generators");
  plop.addHelper("pluralize", (text) => pluralize(text));
  generateApi(plop);
  generateController(plop);
  generateContentType(plop);
  generatePlugin(plop);
  generatePolicy(plop);
  generateMiddleware(plop);
  generateMigration(plop);
  generateService(plop);
};
export {
  plopfile as default
};
//# sourceMappingURL=plopfile.mjs.map
