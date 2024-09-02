"use strict";
const _ = require("lodash");
const inquirer = require("inquirer");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const promptQuestions = [
  { type: "input", name: "email", message: "User email?" },
  { type: "password", name: "password", message: "New password?" },
  {
    type: "confirm",
    name: "confirm",
    message: "Do you really want to reset this user's password?"
  }
];
const action = async (cmdOptions = {}) => {
  const { email, password } = cmdOptions;
  if (___default.default.isEmpty(email) && ___default.default.isEmpty(password) && process.stdin.isTTY) {
    const inquiry = await inquirer__default.default.prompt(promptQuestions);
    if (!inquiry.confirm) {
      process.exit(0);
    }
    return changePassword(inquiry);
  }
  if (___default.default.isEmpty(email) || ___default.default.isEmpty(password)) {
    console.error("Missing required options `email` or `password`");
    process.exit(1);
  }
  return changePassword({ email, password });
};
async function changePassword({ email, password }) {
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  await app.admin.services.user.resetPasswordByEmail(email, password);
  console.log(`Successfully reset user's password`);
  process.exit(0);
}
module.exports = action;
//# sourceMappingURL=action.js.map
