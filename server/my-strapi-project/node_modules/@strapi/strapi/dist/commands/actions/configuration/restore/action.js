"use strict";
const fs = require("fs");
const _ = require("lodash");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const ___default = /* @__PURE__ */ _interopDefault(_);
const action = async ({ file: filePath, strategy = "replace" }) => {
  const input = filePath ? fs__default.default.readFileSync(filePath) : await readStdin();
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  let dataToImport;
  try {
    dataToImport = JSON.parse(___default.default.toString(input));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid input data: ${error.message}. Expected a valid JSON array.`);
    }
    throw error;
  }
  if (!Array.isArray(dataToImport)) {
    throw new Error(`Invalid input data. Expected a valid JSON array.`);
  }
  if (!app.db) {
    throw new Error("Cannot import configuration without a database connection.");
  }
  const importer = createImporter(app.db, strategy);
  for (const config of dataToImport) {
    await importer.import(config);
  }
  console.log(
    `Successfully imported configuration with ${strategy} strategy. Statistics: ${importer.printStatistics()}.`
  );
  process.exit(0);
};
const readStdin = () => {
  const { stdin } = process;
  let result = "";
  if (stdin.isTTY)
    return Promise.resolve(result);
  return new Promise((resolve, reject) => {
    stdin.setEncoding("utf8");
    stdin.on("readable", () => {
      let chunk;
      while (chunk = stdin.read()) {
        result += chunk;
      }
    });
    stdin.on("end", () => {
      resolve(result);
    });
    stdin.on("error", reject);
  });
};
const createImporter = (db, strategy) => {
  switch (strategy) {
    case "replace":
      return createReplaceImporter(db);
    case "merge":
      return createMergeImporter(db);
    case "keep":
      return createKeepImporter(db);
    default:
      throw new Error(`No importer available for strategy "${strategy}"`);
  }
};
const createReplaceImporter = (db) => {
  const stats = {
    created: 0,
    replaced: 0
  };
  return {
    printStatistics() {
      return `${stats.created} created, ${stats.replaced} replaced`;
    },
    async import(conf) {
      const matching = await db.query("strapi::core-store").count({ where: { key: conf.key } });
      if (matching > 0) {
        stats.replaced += 1;
        await db.query("strapi::core-store").update({
          where: { key: conf.key },
          data: conf
        });
      } else {
        stats.created += 1;
        await db.query("strapi::core-store").create({ data: conf });
      }
    }
  };
};
const createMergeImporter = (db) => {
  const stats = {
    created: 0,
    merged: 0
  };
  return {
    printStatistics() {
      return `${stats.created} created, ${stats.merged} merged`;
    },
    async import(conf) {
      const existingConf = await db.query("strapi::core-store").findOne({ where: { key: conf.key } });
      if (existingConf) {
        stats.merged += 1;
        await db.query("strapi::core-store").update({
          where: { key: conf.key },
          data: ___default.default.merge(existingConf, conf)
        });
      } else {
        stats.created += 1;
        await db.query("strapi::core-store").create({ data: conf });
      }
    }
  };
};
const createKeepImporter = (db) => {
  const stats = {
    created: 0,
    untouched: 0
  };
  return {
    printStatistics() {
      return `${stats.created} created, ${stats.untouched} untouched`;
    },
    async import(conf) {
      const matching = await db.query("strapi::core-store").count({ where: { key: conf.key } });
      if (matching > 0) {
        stats.untouched += 1;
        return;
      }
      stats.created += 1;
      await db.query("strapi::core-store").create({ data: conf });
    }
  };
};
module.exports = action;
//# sourceMappingURL=action.js.map
