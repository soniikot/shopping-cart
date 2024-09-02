"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const FORM_INITIAL_VALUES = {
  ...window.strapi.features.isEnabled(window.strapi.features.SSO) ? {
    useSSORegistration: true
  } : {}
};
const ROLE_LAYOUT = [
  ...window.strapi.features.isEnabled(window.strapi.features.SSO) ? [
    [
      {
        intlLabel: {
          id: "Settings.permissions.users.form.sso",
          defaultMessage: "Connect with SSO"
        },
        name: "useSSORegistration",
        type: "bool",
        size: {
          col: 6,
          xs: 12
        }
      }
    ]
  ] : []
];
exports.FORM_INITIAL_VALUES = FORM_INITIAL_VALUES;
exports.ROLE_LAYOUT = ROLE_LAYOUT;
//# sourceMappingURL=ModalForm-cFcYN_zA.js.map
