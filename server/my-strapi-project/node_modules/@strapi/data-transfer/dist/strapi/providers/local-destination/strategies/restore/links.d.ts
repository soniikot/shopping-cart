/// <reference types="node" />
import { Writable } from 'stream';
import type { LoadedStrapi } from '@strapi/types';
import { Transaction } from '../../../../../../types';
export declare const createLinksWriteStream: (mapID: (uid: string, id: number) => number | undefined, strapi: LoadedStrapi, transaction?: Transaction, onWarning?: ((message: string) => void) | undefined) => Writable;
//# sourceMappingURL=links.d.ts.map