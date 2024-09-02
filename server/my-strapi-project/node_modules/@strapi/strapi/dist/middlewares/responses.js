"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const responses = (config = {}) => {
  return async (ctx, next) => {
    await next();
    const { status } = ctx;
    const handler = config?.handlers?.[status];
    if (fp.isFunction(handler)) {
      await handler(ctx, next);
    }
  };
};
exports.responses = responses;
//# sourceMappingURL=responses.js.map
