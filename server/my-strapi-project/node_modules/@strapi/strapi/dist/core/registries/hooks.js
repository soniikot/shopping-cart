"use strict";
const fp = require("lodash/fp");
const utils = require("../utils.js");
const hooksRegistry = () => {
  const hooks = {};
  return {
    /**
     * Returns this list of registered hooks uids
     */
    keys() {
      return Object.keys(hooks);
    },
    /**
     * Returns the instance of a hook.
     */
    get(uid) {
      return hooks[uid];
    },
    /**
     * Returns a map with all the hooks in a namespace
     */
    getAll(namespace) {
      return fp.pickBy((_, uid) => utils.hasNamespace(uid, namespace))(hooks);
    },
    /**
     * Registers a hook
     */
    set(uid, hook) {
      hooks[uid] = hook;
      return this;
    },
    /**
     * Registers a map of hooks for a specific namespace
     */
    add(namespace, hooks2) {
      for (const hookName of Object.keys(hooks2)) {
        const hook = hooks2[hookName];
        const uid = utils.addNamespace(hookName, namespace);
        this.set(uid, hook);
      }
      return this;
    },
    /**
     * Wraps a hook to extend it
     */
    extend(uid, extendFn) {
      const currentHook = this.get(uid);
      if (!currentHook) {
        throw new Error(`Hook ${uid} doesn't exist`);
      }
      const newHook = extendFn(currentHook);
      hooks[uid] = newHook;
      return this;
    }
  };
};
module.exports = hooksRegistry;
//# sourceMappingURL=hooks.js.map
