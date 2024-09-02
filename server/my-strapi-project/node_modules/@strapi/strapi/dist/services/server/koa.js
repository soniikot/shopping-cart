"use strict";
const fp = require("lodash/fp");
const Koa = require("koa");
const createError = require("http-errors");
const delegate = require("delegates");
const statuses = require("statuses");
const errors = require("../errors.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const Koa__default = /* @__PURE__ */ _interopDefault(Koa);
const createError__default = /* @__PURE__ */ _interopDefault(createError);
const delegate__default = /* @__PURE__ */ _interopDefault(delegate);
const statuses__default = /* @__PURE__ */ _interopDefault(statuses);
const addCustomMethods = (app) => {
  const delegator = delegate__default.default(app.context, "response");
  statuses__default.default.codes.filter((code) => code >= 400 && code < 600).forEach((code) => {
    const name = statuses__default.default(code);
    const camelCasedName = fp.camelCase(name);
    app.response[camelCasedName] = function responseCode(message, details = {}) {
      const httpError = createError__default.default(code, message, { details });
      const { status, body } = errors.formatHttpError(httpError);
      this.status = status;
      this.body = body;
    };
    delegator.method(camelCasedName);
  });
  app.response.send = function send(data, status = 200) {
    this.status = status;
    this.body = data;
  };
  app.response.created = function created(data) {
    this.status = 201;
    this.body = data;
  };
  app.response.deleted = function deleted(data) {
    if (fp.isNil(data)) {
      this.status = 204;
    } else {
      this.status = 200;
      this.body = data;
    }
  };
  delegator.method("send").method("created").method("deleted");
  return app;
};
const createKoaApp = ({ proxy, keys }) => {
  const app = new Koa__default.default({ proxy });
  app.keys = keys;
  addCustomMethods(app);
  return app;
};
module.exports = createKoaApp;
//# sourceMappingURL=koa.js.map
