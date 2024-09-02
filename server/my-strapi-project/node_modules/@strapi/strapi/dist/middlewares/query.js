"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const qs = require("qs");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const qs__default = /* @__PURE__ */ _interopDefault(qs);
const defaults = {
  strictNullHandling: true,
  arrayLimit: 100,
  depth: 20
};
const addQsParser = (app, settings) => {
  Object.defineProperty(app.request, "query", {
    configurable: false,
    enumerable: true,
    /*
     * Get parsed query-string.
     */
    get() {
      const qstr = this.querystring;
      this._querycache = this._querycache || {};
      const cache = this._querycache;
      if (!cache[qstr]) {
        cache[qstr] = qs__default.default.parse(qstr, settings);
      }
      return cache[qstr];
    },
    /*
     * Set query-string as an object.
     */
    set(obj) {
      this.querystring = qs__default.default.stringify(obj);
    }
  });
  return app;
};
const query = (config, { strapi }) => {
  addQsParser(strapi.server.app, { ...defaults, ...config });
};
exports.query = query;
//# sourceMappingURL=query.js.map
