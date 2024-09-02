"use strict";
const getClientName = ({ client }) => {
  switch (client) {
    case "sqlite-legacy":
      return "sqlite";
    default:
      return client;
  }
};
module.exports = getClientName;
//# sourceMappingURL=db-client-name.js.map
