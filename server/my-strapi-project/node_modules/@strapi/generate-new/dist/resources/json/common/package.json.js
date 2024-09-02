"use strict";
const engines = require("./engines.js");
const packageJSON = (opts) => {
  const {
    strapiDependencies,
    additionalsDependencies,
    strapiVersion,
    projectName,
    uuid,
    packageJsonStrapi
  } = opts;
  return {
    name: projectName,
    private: true,
    version: "0.1.0",
    description: "A Strapi application",
    scripts: {
      develop: "strapi develop",
      start: "strapi start",
      build: "strapi build",
      strapi: "strapi",
      deploy: "strapi deploy"
    },
    devDependencies: {},
    dependencies: {
      ...strapiDependencies.reduce((acc, key) => {
        acc[key] = strapiVersion;
        return acc;
      }, {}),
      ...additionalsDependencies
    },
    author: {
      name: "A Strapi developer"
    },
    strapi: {
      uuid,
      ...packageJsonStrapi
    },
    engines,
    license: "MIT"
  };
};
module.exports = packageJSON;
//# sourceMappingURL=package.json.js.map
