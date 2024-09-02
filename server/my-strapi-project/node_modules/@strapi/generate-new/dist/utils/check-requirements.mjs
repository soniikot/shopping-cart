import chalk from "chalk";
import semver from "semver";
import engines from "../resources/json/common/engines.mjs";
function checkRequirements() {
  const currentNodeVersion = process.versions.node;
  if (!semver.satisfies(currentNodeVersion, engines.node)) {
    console.error(chalk.red(`You are running ${chalk.bold(`Node.js ${currentNodeVersion}`)}`));
    console.error(`Strapi requires ${chalk.bold(chalk.green(`Node.js ${engines.node}`))}`);
    console.error("Please make sure to use the right version of Node.");
    process.exit(1);
  } else if (semver.major(currentNodeVersion) % 2 !== 0) {
    console.warn(chalk.yellow(`You are running ${chalk.bold(`Node.js ${currentNodeVersion}`)}`));
    console.warn(
      `Strapi only supports ${chalk.bold(
        chalk.green("LTS versions of Node.js")
      )}, other versions may not be compatible.`
    );
  }
}
export {
  checkRequirements as default
};
//# sourceMappingURL=check-requirements.mjs.map
