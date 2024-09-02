/// <reference types="node" />
import { Readable } from 'stream';
import type { LoadedStrapi } from '@strapi/types';
import type { IMetadata, ISourceProvider, ProviderType } from '../../../../types';
export interface ILocalStrapiSourceProviderOptions {
    getStrapi(): LoadedStrapi | Promise<LoadedStrapi>;
    autoDestroy?: boolean;
}
export declare const createLocalStrapiSourceProvider: (options: ILocalStrapiSourceProviderOptions) => LocalStrapiSourceProvider;
declare class LocalStrapiSourceProvider implements ISourceProvider {
    name: string;
    type: ProviderType;
    options: ILocalStrapiSourceProviderOptions;
    strapi?: LoadedStrapi;
    constructor(options: ILocalStrapiSourceProviderOptions);
    bootstrap(): Promise<void>;
    close(): Promise<void>;
    getMetadata(): IMetadata;
    createEntitiesReadStream(): Promise<Readable>;
    createLinksReadStream(): Readable;
    createConfigurationReadStream(): Readable;
    getSchemas(): import("@strapi/types/dist/types/utils/string").Dict<import("@strapi/types/dist/types/core/schemas").Schema>;
    createSchemasReadStream(): Readable;
    createAssetsReadStream(): Readable;
}
export type ILocalStrapiSourceProvider = InstanceType<typeof LocalStrapiSourceProvider>;
export {};
//# sourceMappingURL=index.d.ts.map