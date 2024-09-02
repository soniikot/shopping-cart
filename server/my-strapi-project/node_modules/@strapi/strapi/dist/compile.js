"use strict";
const tsUtils = require("@strapi/typescript-utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const tsUtils__default = /* @__PURE__ */ _interopDefault(tsUtils);
async function compile(options) {
  const { appDir = process.cwd(), ignoreDiagnostics = false } = options ?? {};
  const isTSProject = await tsUtils__default.default.isUsingTypeScript(appDir);
  const outDir = await tsUtils__default.default.resolveOutDir(appDir);
  if (isTSProject) {
    await tsUtils__default.default.compile(appDir, {
      configOptions: { options: { incremental: true }, ignoreDiagnostics }
    });
  }
  const distDir = isTSProject ? outDir : appDir;
  return { appDir, distDir };
}
module.exports = compile;
//# sourceMappingURL=compile.js.map
