"use strict";
const generateNew = require("@strapi/generate-new");
const action = (...args) => {
  return generateNew.generateNewApp(...args);
};
module.exports = action;
//# sourceMappingURL=action.js.map
