import inquirer from "inquirer";
import { merge } from "lodash";
import { trackUsage } from "./utils/usage.mjs";
import defaultConfigs from "./utils/db-configs.mjs";
import clientDependencies from "./utils/db-client-dependencies.mjs";
import dbQuestions from "./utils/db-questions.mjs";
import createProject from "./create-project.mjs";
const LANGUAGES = {
  javascript: "JavaScript",
  typescript: "TypeScript"
};
const createCustomizedProject = async (scope) => {
  if (!scope.useTypescript) {
    const language = await askAboutLanguages();
    scope.useTypescript = language === LANGUAGES.typescript;
  }
  await trackUsage({ event: "didChooseCustomDatabase", scope });
  const configuration = await askDbInfosAndTest(scope).catch((error) => {
    return trackUsage({ event: "didNotConnectDatabase", scope, error }).then(() => {
      throw error;
    });
  });
  console.log();
  console.log("Creating a project with custom database options.");
  await trackUsage({ event: "didConnectDatabase", scope });
  return createProject(scope, configuration);
};
async function askDbInfosAndTest(scope) {
  const { client, connection } = await askDatabaseInfos(scope);
  return {
    client,
    connection,
    dependencies: {
      ...clientDependencies({ client }),
      ...scope.additionalsDependencies
    }
  };
}
async function askDatabaseInfos(scope) {
  const { client } = await inquirer.prompt([
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
  const responses = await inquirer.prompt(questions);
  const connection = merge({}, defaultConfigs[client] || {}, {
    client,
    connection: responses
  });
  return {
    client,
    connection
  };
}
async function askAboutLanguages() {
  const { language } = await inquirer.prompt([
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
export {
  createCustomizedProject as default
};
//# sourceMappingURL=create-customized-project.mjs.map
