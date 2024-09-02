/// <reference types="node" />
import { Writable } from 'stream';
import type { LoadedStrapi } from '@strapi/types';
import { IConfiguration, Transaction } from '../../../../../../types';
export declare const restoreConfigs: (strapi: LoadedStrapi, config: IConfiguration) => Promise<any>;
export declare const createConfigurationWriteStream: (strapi: LoadedStrapi, transaction?: Transaction) => Promise<Writable>;
//# sourceMappingURL=configuration.d.ts.map