import { pickBy, has } from "lodash/fp";
import { hasNamespace, addNamespace } from "../utils.mjs";
const policiesRegistry = () => {
  const policies = {};
  return {
    /**
     * Returns this list of registered policies uids
     */
    keys() {
      return Object.keys(policies);
    },
    /**
     * Returns the instance of a policy. Instantiate the policy if not already done
     */
    get(uid) {
      return policies[uid];
    },
    /**
     * Returns a map with all the policies in a namespace
     */
    getAll(namespace) {
      return pickBy((_, uid) => hasNamespace(uid, namespace))(policies);
    },
    /**
     * Registers a policy
     */
    set(uid, policy) {
      policies[uid] = policy;
      return this;
    },
    /**
     * Registers a map of policies for a specific namespace
     */
    add(namespace, newPolicies) {
      for (const policyName of Object.keys(newPolicies)) {
        const policy = newPolicies[policyName];
        const uid = addNamespace(policyName, namespace);
        if (has(uid, policies)) {
          throw new Error(`Policy ${uid} has already been registered.`);
        }
        policies[uid] = policy;
      }
    },
    /**
     * Wraps a policy to extend it
     * @param {string} uid
     * @param {(policy: Policy) => Policy} extendFn
     */
    extend(uid, extendFn) {
      const currentPolicy = this.get(uid);
      if (!currentPolicy) {
        throw new Error(`Policy ${uid} doesn't exist`);
      }
      const newPolicy = extendFn(currentPolicy);
      policies[uid] = newPolicy;
      return this;
    }
  };
};
export {
  policiesRegistry as default
};
//# sourceMappingURL=policies.mjs.map
