"use strict";
const fp = require("lodash/fp");
const utils = require("../utils.js");
const middlewaresRegistry = () => {
  const middlewares = {};
  return {
    /**
     * Returns this list of registered middlewares uids
     */
    keys() {
      return Object.keys(middlewares);
    },
    /**
     * Returns the instance of a middleware. Instantiate the middleware if not already done
     */
    get(uid) {
      return middlewares[uid];
    },
    /**
     * Returns a map with all the middlewares in a namespace
     */
    getAll(namespace) {
      return fp.pickBy((_, uid) => utils.hasNamespace(uid, namespace))(middlewares);
    },
    /**
     * Registers a middleware
     */
    set(uid, middleware) {
      middlewares[uid] = middleware;
      return this;
    },
    /**
     * Registers a map of middlewares for a specific namespace
     */
    add(namespace, rawMiddlewares = {}) {
      for (const middlewareName of Object.keys(rawMiddlewares)) {
        const middleware = rawMiddlewares[middlewareName];
        const uid = utils.addNamespace(middlewareName, namespace);
        if (fp.has(uid, middlewares)) {
          throw new Error(`Middleware ${uid} has already been registered.`);
        }
        middlewares[uid] = middleware;
      }
    },
    /**
     * Wraps a middleware to extend it
     */
    extend(uid, extendFn) {
      const currentMiddleware = this.get(uid);
      if (!currentMiddleware) {
        throw new Error(`Middleware ${uid} doesn't exist`);
      }
      const newMiddleware = extendFn(currentMiddleware);
      middlewares[uid] = newMiddleware;
      return this;
    }
  };
};
module.exports = middlewaresRegistry;
//# sourceMappingURL=middlewares.js.map
