/// <reference types="lodash" />
import type { Common } from '@strapi/types';
type PolicyExtendFn = (policy: Common.Policy) => Common.Policy;
type PolicyMap = Record<string, Common.Policy>;
declare const policiesRegistry: () => {
    /**
     * Returns this list of registered policies uids
     */
    keys(): string[];
    /**
     * Returns the instance of a policy. Instantiate the policy if not already done
     */
    get(uid: Common.UID.Policy): Common.Policy<unknown>;
    /**
     * Returns a map with all the policies in a namespace
     */
    getAll(namespace: string): import("lodash").Dictionary<unknown>;
    /**
     * Registers a policy
     */
    set(uid: string, policy: Common.Policy): any;
    /**
     * Registers a map of policies for a specific namespace
     */
    add(namespace: string, newPolicies: PolicyMap): void;
    /**
     * Wraps a policy to extend it
     * @param {string} uid
     * @param {(policy: Policy) => Policy} extendFn
     */
    extend(uid: Common.UID.Policy, extendFn: PolicyExtendFn): any;
};
export default policiesRegistry;
//# sourceMappingURL=policies.d.ts.map