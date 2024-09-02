/**
 * Direct selector to the formModal state domain
 */
declare const formModalDomain: () => (state: any) => any;
/**
 * Other specific selectors
 */
/**
 * Default selector used by formModal
 */
export declare const makeSelectFormModal: () => ((state: any) => any) & import("reselect").OutputSelectorFields<(args_0: any) => any, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export { formModalDomain };
