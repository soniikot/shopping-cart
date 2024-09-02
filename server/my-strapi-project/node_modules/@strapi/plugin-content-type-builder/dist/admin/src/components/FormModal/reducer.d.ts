import type { AnyAction } from '@reduxjs/toolkit';
declare const initialState: any;
declare const reducer: (state: any, action: AnyAction) => (base?: ((draftState: any) => any) | undefined, ...args: unknown[]) => ((draftState: any) => any) | Promise<(draftState: any) => any>;
export { initialState, reducer };
