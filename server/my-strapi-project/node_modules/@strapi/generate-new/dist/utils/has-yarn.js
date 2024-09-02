"use strict";
const execa = require("execa");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const execa__default = /* @__PURE__ */ _interopDefault(execa);
function hasYarn() {
  try {
    const { exitCode } = execa__default.default.commandSync("yarn --version", { shell: true });
    return exitCode === 0;
  } catch (err) {
    return false;
  }
}
module.exports = hasYarn;
//# sourceMappingURL=has-yarn.js.map
