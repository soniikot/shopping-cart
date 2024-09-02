import { Strapi, UID, Schema } from '@strapi/types';
import type { Configuration } from '../../../shared/contracts/content-types';
import type { ConfigurationUpdate } from './configuration';
declare const _default: ({ strapi }: {
    strapi: Strapi;
}) => {
    findAllComponents(): unknown[];
    findComponent(uid: UID.Component): any;
    findConfiguration(component: Schema.Component): Promise<{
        uid: string;
        settings: import("../../../shared/contracts/content-types").Settings;
        metadatas: import("../../../shared/contracts/content-types").Metadatas;
        layouts: import("../../../shared/contracts/content-types").Layouts;
        category: string;
    }>;
    updateConfiguration(component: Schema.Component, newConfiguration: ConfigurationUpdate): Promise<{
        uid: string;
        settings: import("../../../shared/contracts/content-types").Settings;
        metadatas: import("../../../shared/contracts/content-types").Metadatas;
        layouts: import("../../../shared/contracts/content-types").Layouts;
        category: string;
    }>;
    findComponentsConfigurations(model: Schema.Component): Promise<Record<string, Configuration & {
        category: string;
        isComponent: boolean;
    }>>;
    syncConfigurations(): Promise<void>;
};
export default _default;
//# sourceMappingURL=components.d.ts.map