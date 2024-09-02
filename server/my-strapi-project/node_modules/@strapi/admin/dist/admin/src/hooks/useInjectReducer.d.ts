import { Reducer } from '@reduxjs/toolkit';
/**
 * Inject a new reducer into the global redux-store.
 *
 * @export
 * @param {string} namespace - Store namespace of the injected reducer
 * @param {Function} reducer - Reducer function
 * @return void
 */
export declare function useInjectReducer(namespace: string, reducer: Reducer): void;
