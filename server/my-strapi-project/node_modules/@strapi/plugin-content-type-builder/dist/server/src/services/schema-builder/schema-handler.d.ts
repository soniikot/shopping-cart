import type { UID, Schema } from '@strapi/types';
export type Infos = {
    category?: string;
    modelName?: string;
    plugin?: string;
    uid?: UID.ContentType;
    dir: string;
    filename: string;
    schema?: Schema.ContentType;
};
export default function createSchemaHandler(infos: Infos): {
    readonly modelName: string | undefined;
    readonly plugin: string | undefined;
    readonly category: string | undefined;
    readonly kind: Schema.ContentTypeKind;
    readonly uid: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}` | undefined;
    readonly writable: boolean;
    setUID(val: UID.ContentType): any;
    setDir(val: string): any;
    readonly schema: Schema.ContentType;
    setSchema(val: Schema.ContentType): any;
    get(path: string[]): any;
    set(path: string[] | string, val: unknown): any;
    unset(path: string[]): any;
    delete(): any;
    getAttribute(key: string): any;
    setAttribute(key: string, attribute: any): any;
    deleteAttribute(key: string): any;
    setAttributes(newAttributes: Schema.Attributes): any;
    removeContentType(uid: UID.ContentType): any;
    removeComponent(uid: UID.Component): any;
    updateComponent(uid: UID.Component, newUID: UID.Component): any;
    flush(): Promise<void>;
    rollback(): Promise<void>;
};
//# sourceMappingURL=schema-handler.d.ts.map