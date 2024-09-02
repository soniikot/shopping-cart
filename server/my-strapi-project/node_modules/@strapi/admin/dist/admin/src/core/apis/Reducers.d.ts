import { Reducer, ReducersMapObject } from '@reduxjs/toolkit';
interface ReducerConstructorArgs {
    appReducers?: ReducersMapObject;
}
export declare class Reducers {
    reducers: ReducersMapObject;
    constructor({ appReducers }?: ReducerConstructorArgs);
    add(reducerName: string, reducer: Reducer): void;
}
export {};
