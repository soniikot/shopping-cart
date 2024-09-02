import type { Database } from '@strapi/database';
declare const coreStoreModel: {
    uid: string;
    collectionName: string;
    attributes: {
        key: {
            type: string;
        };
        value: {
            type: string;
        };
        type: {
            type: string;
        };
        environment: {
            type: string;
        };
        tag: {
            type: string;
        };
    };
};
type SetParams = {
    key: string;
    value: unknown;
    type?: string;
    environment?: string;
    name?: string;
    tag?: string;
};
type GetParams = {
    key: string;
    type?: string;
    environment?: string;
    name?: string;
    tag?: string;
};
type Params = SetParams & GetParams;
interface CoreStore {
    (defaultParams: Partial<Params>): {
        get(params: Partial<GetParams>): Promise<unknown>;
        set(params: Partial<SetParams>): Promise<void>;
        delete(params: Partial<GetParams>): Promise<void>;
    };
    get(params: GetParams): Promise<unknown>;
    set(params: SetParams): Promise<void>;
    delete(params: GetParams): Promise<void>;
}
declare const createCoreStore: ({ db }: {
    db: Database;
}) => CoreStore;
export { coreStoreModel, createCoreStore };
//# sourceMappingURL=core-store.d.ts.map