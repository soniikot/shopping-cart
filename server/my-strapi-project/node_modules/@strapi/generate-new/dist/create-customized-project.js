"use strict";
const inquirer = require("inquirer");
const _ = require("lodash");
const usage = require("./utils/usage.js");
const dbConfigs = require("./utils/db-configs.js");
const dbClientDependencies = require("./utils/db-client-dependencies.js");
const dbQuestions = require("./utils/db-questions.js");
const createProject = require("./create-project.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const LANGUAGES = {
  javascript: "JavaScript",
  typescript: "TypeScript"
};
const createCustomizedProject = async (scope) => {
  if (!scope.useTypescript) {
    const language = await askAboutLanguages();
    scope.useTypescript = language === LANGUAGES.typescript;
  }
  await usage.trackUsage({ event: "didChooseCustomDatabase", scope });
  const configuration = await askDbInfosAndTest(scope).catch((error) => {
    return usage.trackUsage({ event: "didNotConnectDatabase", scope, error }).then(() => {
      throw error;
    });
  });
  console.log();
  console.log("Creating a project with custom database options.");
  await usage.trackUsage({ event: "didConnectDatabase", scope });
  return createProject(scope, configuration);
};
async function askDbInfosAndTest(scope) {
  const { client, connection } = await askDatabaseInfos(scope);
  return {
    client,
    connection,
    dependencies: {
      ...dbClientDependencies({ client }),
      ...scope.additionalsDependencies
    }
  };
}
async function askDatabaseInfos(scope) {
  const { client } = await inquirer__default.default.prompt([
    {
      type: "list",
      name: "client",
      message: "Choose your default database client",
      choices: ["sqlite", "postgres", "mysql"],
      default: "sqlite"
    }
  ]);
  const questions = dbQuestions[client].map((q) => q({ scope, client }));
  if (!questions) {
    return { client };
  }
  const responses = await inquirer__default.default.prompt(questions);
  const connection = _.merge({}, dbConfigs[client] || {}, {
    client,
    connection: responses
  });
  return {
    client,
    connection
  };
}
async function askAboutLanguages() {
  const { language } = await inquirer__default.default.prompt([
    {
      type: "list",
      name: "language",
      message: "Choose your preferred language",
      choices: Object.values(LANGUAGES),
      default: LANGUAGES.javascript
    }
  ]);
  return language;
}
module.exports = createCustomizedProject;
//# sourceMappingURL=create-customized-project.js.map
