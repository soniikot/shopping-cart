"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const compression = require("./compression.js");
const cors = require("./cors.js");
const errors = require("./errors.js");
const favicon = require("./favicon.js");
const ip = require("./ip.js");
const logger = require("./logger.js");
const poweredBy = require("./powered-by.js");
const body = require("./body.js");
const query = require("./query.js");
const responseTime = require("./response-time.js");
const responses = require("./responses.js");
const security = require("./security.js");
const session = require("./session.js");
const index = require("./public/index.js");
const middlewares = {
  compression: compression.compression,
  cors: cors.cors,
  errors: errors.errors,
  favicon: favicon.favicon,
  ip: ip.ip,
  logger: logger.logger,
  poweredBy: poweredBy.poweredBy,
  body: body.body,
  query: query.query,
  responseTime: responseTime.responseTime,
  responses: responses.responses,
  security: security.security,
  session: session.session,
  public: index.publicStatic
};
exports.middlewares = middlewares;
//# sourceMappingURL=index.js.map
