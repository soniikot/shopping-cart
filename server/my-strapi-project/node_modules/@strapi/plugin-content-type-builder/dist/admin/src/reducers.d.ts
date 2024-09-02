export declare const reducers: {
    [x: string]: ((state: import("./types").DataManagerStateType | undefined, action: import("./components/DataManagerProvider/reducer").Action) => import("./types").DataManagerStateType) | ((state: any, action: import("redux").AnyAction) => (base?: ((draftState: any) => any) | undefined, ...args: unknown[]) => ((draftState: any) => any) | Promise<(draftState: any) => any>);
};
