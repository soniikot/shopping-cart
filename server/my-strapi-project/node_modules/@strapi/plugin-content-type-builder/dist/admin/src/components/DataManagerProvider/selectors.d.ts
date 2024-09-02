import type { DataManagerStateType } from '../../types';
/**
 * Direct selector to the dataManagerProvider state domain
 */
declare const dataManagerProviderDomain: () => (state: DataManagerStateType) => any;
/**
 * Other specific selectors
 */
/**
 * Default selector used by dataManagerProvider
 */
declare const makeSelectDataManagerProvider: () => ((state: DataManagerStateType) => any) & import("reselect").OutputSelectorFields<(args_0: any) => any, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export { makeSelectDataManagerProvider, dataManagerProviderDomain };
