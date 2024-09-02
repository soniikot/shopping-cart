import path from "path";
import execa from "execa";
import chalk from "chalk";
async function getPackageInfo(packageName) {
  const { stdout } = await execa("npm", ["view", packageName, "name", "version", "--silent"]);
  const match = stdout.match(/(?<=')(.*?)(?=')/gm);
  if (!match) {
    throw new Error("Could not match");
  }
  const [name, version] = match;
  return { name, version };
}
async function getTemplatePackageInfo(template) {
  try {
    const longhand = `@strapi/template-${template}`;
    const packageInfo = await getPackageInfo(longhand);
    return packageInfo;
  } catch (error) {
  }
  try {
    return await getPackageInfo(template);
  } catch (error) {
    throw new Error(`Could not find package ${chalk.yellow(template)} on npm`);
  }
}
async function downloadNpmTemplate({ name, version }, parentDir) {
  await execa("npm", ["install", `${name}@${version}`, "--no-save", "--silent"], {
    cwd: parentDir
  });
  const exactTemplatePath = path.dirname(
    require.resolve(`${name}/package.json`, { paths: [parentDir] })
  );
  return exactTemplatePath;
}
export {
  downloadNpmTemplate,
  getTemplatePackageInfo
};
//# sourceMappingURL=fetch-npm-template.mjs.map
