/// <reference types="lodash" />
import { Utils } from '@strapi/types';
export interface ActionAlias {
    /**
     * The action ID to alias
     */
    actionId: string;
    /**
     * An optional array of subject to restrict the alias usage
     */
    subjects?: string[];
}
export type Action = {
    /**
     * The unique identifier of the action
     */
    actionId: string;
    /**
     * The section linked to the action - These can be 'contentTypes' | 'plugins' | 'settings' | 'internal'
     */
    section: string;
    /**
     * The human readable name of an action
     */
    displayName: string;
    /**
     * The main category of an action
     */
    category: string;
    /**
     * The secondary category of an action (only for settings and plugins section)
     */
    subCategory?: string;
    /**
     * The plugin that provides the action
     */
    pluginName?: string;
    /**
     * A list of subjects on which the action can be applied
     */
    subjects?: string[];
    /**
     * The options of an action
     */
    options: {
        /**
         * The list of properties that can be associated with an action
         */
        applyToProperties: string[] | null;
    };
    /**
     * An optional array of @see {@link ActionAlias}.
     *
     * It represents the possible aliases for the current action.
     *
     * Aliases are unidirectional.
     *
     * Note: This is an internal property and probably shouldn't be used outside Strapi core features.
     *       Its behavior might change at any time without notice.
     *
     * @internal
     */
    aliases?: ActionAlias[];
};
/**
 * Set of attributes used to create a new {@link Action} object
 * @typedef {Action, { uid: string }} CreateActionPayload
 */
export type CreateActionPayload = Utils.Object.PartialBy<Omit<Action, 'actionId'>, 'options'> & {
    uid: string;
};
declare const _default: {
    actionFields: readonly ["section", "displayName", "category", "subCategory", "pluginName", "subjects", "options", "actionId", "aliases"];
    appliesToProperty: import("lodash").CurriedFunction2<string, Action, boolean>;
    appliesToSubject: import("lodash").CurriedFunction2<string, Action, boolean>;
    assignActionId: (attrs: CreateActionPayload) => CreateActionPayload;
    assignOrOmitSubCategory: (action: Action) => Action;
    create: (payload: CreateActionPayload) => Action;
    computeActionId: (attributes: CreateActionPayload) => string;
    getDefaultActionAttributes: () => Partial<Action>;
    sanitizeActionAttributes: (action: Action | CreateActionPayload) => Action;
};
export default _default;
//# sourceMappingURL=index.d.ts.map