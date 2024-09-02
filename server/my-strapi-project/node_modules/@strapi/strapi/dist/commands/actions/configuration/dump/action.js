"use strict";
const fs = require("fs");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const CHUNK_SIZE = 100;
const action = async ({ file: filePath, pretty }) => {
  const output = filePath ? fs__default.default.createWriteStream(filePath) : process.stdout;
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  const count = await app.query("strapi::core-store").count();
  const exportData = [];
  const pageCount = Math.ceil(count / CHUNK_SIZE);
  for (let page = 0; page < pageCount; page += 1) {
    const results = await app.query("strapi::core-store").findMany({ limit: CHUNK_SIZE, offset: page * CHUNK_SIZE, orderBy: "key" });
    results.filter((result) => result.key.startsWith("plugin_")).forEach((result) => {
      exportData.push({
        key: result.key,
        value: result.value,
        type: result.type,
        environment: result.environment,
        tag: result.tag
      });
    });
  }
  const str = JSON.stringify(exportData, null, pretty ? 2 : void 0);
  output.write(str);
  output.write("\n");
  output.end();
  if (filePath) {
    console.log(`Successfully exported ${exportData.length} configuration entries`);
  }
  process.exit(0);
};
module.exports = action;
//# sourceMappingURL=action.js.map
