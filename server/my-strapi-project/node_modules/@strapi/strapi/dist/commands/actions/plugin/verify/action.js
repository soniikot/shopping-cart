"use strict";
const boxen = require("boxen");
const chalk = require("chalk");
const packUp = require("@strapi/pack-up");
const helpers = require("../../../utils/helpers.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const action = async (opts, _cmd, { cwd, logger }) => {
  try {
    await helpers.notifyExperimentalCommand("plugin:verify", { force: true });
    await packUp.check({
      cwd,
      ...opts
    });
  } catch (err) {
    logger.error(
      "There seems to be an unexpected error, try again with --debug for more information \n"
    );
    if (err instanceof Error && err.stack) {
      console.log(
        chalk__default.default.red(
          boxen__default.default(err.stack, {
            padding: 1,
            align: "left"
          })
        )
      );
    }
    process.exit(1);
  }
};
module.exports = action;
//# sourceMappingURL=action.js.map
