"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const http = require("http");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const http__default = /* @__PURE__ */ _interopDefault(http);
const createHTTPServer = (strapi, koaApp) => {
  const connections = /* @__PURE__ */ new Set();
  let handler;
  const listener = function handleRequest(req, res) {
    if (!handler) {
      handler = koaApp.callback();
    }
    return handler(req, res);
  };
  const options = strapi.config.get("server.http.serverOptions", {});
  const server = http__default.default.createServer(options, listener);
  server.on("connection", (connection) => {
    connections.add(connection);
    connection.on("close", () => {
      connections.delete(connection);
    });
  });
  server.on("error", (err) => {
    if ("code" in err && "port" in err && err.code === "EADDRINUSE") {
      return strapi.stopWithError(`The port ${err.port} is already used by another application.`);
    }
    strapi.log.error(err);
  });
  const destroy = async () => {
    for (const connection of connections) {
      connection.destroy();
      connections.delete(connection);
    }
    if (!server.listening) {
      return;
    }
    return new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };
  return Object.assign(server, { destroy });
};
exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=http-server.js.map
