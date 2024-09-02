const getClientName = ({ client }) => {
  switch (client) {
    case "sqlite-legacy":
      return "sqlite";
    default:
      return client;
  }
};
export {
  getClientName as default
};
//# sourceMappingURL=db-client-name.mjs.map
