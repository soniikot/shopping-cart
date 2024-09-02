"use strict";
const execa = require("execa");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const execa__default = /* @__PURE__ */ _interopDefault(execa);
async function isInGitRepository(rootDir) {
  try {
    await execa__default.default("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore", cwd: rootDir });
    return true;
  } catch (_) {
    return false;
  }
}
async function isInMercurialRepository(rootDir) {
  try {
    await execa__default.default("hg", ["-cwd", ".", "root"], { stdio: "ignore", cwd: rootDir });
    return true;
  } catch (_) {
    return false;
  }
}
async function tryGitInit(rootDir) {
  try {
    await execa__default.default("git", ["--version"], { stdio: "ignore" });
    if (await isInGitRepository(rootDir) || await isInMercurialRepository(rootDir)) {
      return false;
    }
    await execa__default.default("git", ["init"], { stdio: "ignore", cwd: rootDir });
    return true;
  } catch (_) {
    return false;
  }
}
module.exports = tryGitInit;
//# sourceMappingURL=git.js.map
