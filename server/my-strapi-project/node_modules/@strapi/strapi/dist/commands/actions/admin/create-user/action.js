"use strict";
const strapiUtils = require("@strapi/utils");
const _ = require("lodash");
const inquirer = require("inquirer");
const Strapi = require("../../../../Strapi.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const ___default = /* @__PURE__ */ _interopDefault(_);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const emailValidator = strapiUtils.yup.string().email("Invalid email address").lowercase();
const passwordValidator = strapiUtils.yup.string().min(8, "Password must be at least 8 characters long").matches(/[a-z]/, "Password must contain at least one lowercase character").matches(/[A-Z]/, "Password must contain at least one uppercase character").matches(/\d/, "Password must contain at least one number");
const adminCreateSchema = strapiUtils.yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  firstname: strapiUtils.yup.string().trim().required("First name is required"),
  lastname: strapiUtils.yup.string()
});
const promptQuestions = [
  {
    type: "input",
    name: "email",
    message: "Admin email?",
    async validate(value) {
      const validEmail = await emailValidator.validate(value);
      return validEmail === value || validEmail;
    }
  },
  {
    type: "password",
    name: "password",
    message: "Admin password?",
    async validate(value) {
      const validPassword = await passwordValidator.validate(value);
      return validPassword === value || validPassword;
    }
  },
  { type: "input", name: "firstname", message: "First name?" },
  { type: "input", name: "lastname", message: "Last name?" },
  {
    type: "confirm",
    name: "confirm",
    message: "Do you really want to create a new admin?"
  }
];
const action = async (cmdOptions = {}) => {
  let { email, password, firstname, lastname } = cmdOptions;
  if (___default.default.isEmpty(email) && ___default.default.isEmpty(password) && ___default.default.isEmpty(firstname) && ___default.default.isEmpty(lastname) && process.stdin.isTTY) {
    const inquiry = await inquirer__default.default.prompt(promptQuestions);
    if (!inquiry.confirm) {
      process.exit(0);
    }
    ({ email, password, firstname, lastname } = inquiry);
  }
  try {
    await adminCreateSchema.validate({ email, password, firstname, lastname });
  } catch (err) {
    if (err instanceof strapiUtils.yup.ValidationError) {
      console.error(err.errors[0]);
    }
    process.exit(1);
  }
  return createAdmin({ email, password, firstname, lastname });
};
async function createAdmin({ email, password, firstname, lastname }) {
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  const user = await app.admin.services.user.exists({ email });
  if (user) {
    console.error(`User with email "${email}" already exists`);
    process.exit(1);
  }
  const superAdminRole = await app.admin.services.role.getSuperAdmin();
  await app.admin.services.user.create({
    email,
    firstname,
    lastname,
    isActive: true,
    roles: [superAdminRole.id],
    ...password && { password, registrationToken: null }
  });
  console.log(`Successfully created new admin`);
  process.exit(0);
}
module.exports = action;
//# sourceMappingURL=action.js.map
