/// <reference types="node" />
import { Writable } from 'stream';
import type { LoadedStrapi, Common } from '@strapi/types';
import type { Transaction } from '../../../../../../types';
interface IEntitiesRestoreStreamOptions {
    strapi: LoadedStrapi;
    updateMappingTable<TSchemaUID extends Common.UID.Schema>(type: TSchemaUID, oldID: number, newID: number): void;
    transaction?: Transaction;
}
export declare const createEntitiesWriteStream: (options: IEntitiesRestoreStreamOptions) => Writable;
export {};
//# sourceMappingURL=entities.d.ts.map