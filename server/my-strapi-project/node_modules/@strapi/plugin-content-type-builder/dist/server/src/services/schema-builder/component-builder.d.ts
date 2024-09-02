import type { UID } from '@strapi/types';
export default function createComponentBuilder(): {
    createComponentUID({ category, displayName }: any): string;
    createNewComponentUIDMap(components: object[]): any;
    /**
     * create a component in the tmpComponent map
     */
    createComponent(this: any, infos: any): {
        readonly modelName: string | undefined;
        readonly plugin: string | undefined;
        readonly category: string | undefined;
        readonly kind: import("@strapi/types/dist/types/core/schemas").ContentTypeKind;
        readonly uid: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}` | undefined;
        readonly writable: boolean;
        setUID(val: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`): any;
        setDir(val: string): any;
        readonly schema: import("@strapi/types/dist/types/core/schemas").ContentType;
        setSchema(val: import("@strapi/types/dist/types/core/schemas").ContentType): any;
        get(path: string[]): any;
        set(path: string | string[], val: unknown): any;
        unset(path: string[]): any;
        delete(): any;
        getAttribute(key: string): any;
        setAttribute(key: string, attribute: any): any;
        deleteAttribute(key: string): any;
        setAttributes(newAttributes: import("@strapi/types/dist/types/core/schemas").Attributes): any;
        removeContentType(uid: `admin::${string}` | `strapi::${string}` | `api::${string}.${string}` | `plugin::${string}.${string}`): any;
        removeComponent(uid: `${string}.${string}`): any;
        updateComponent(uid: `${string}.${string}`, newUID: `${string}.${string}`): any;
        flush(): Promise<void>;
        rollback(): Promise<void>;
    };
    /**
     * create a component in the tmpComponent map
     */
    editComponent(this: any, infos: any): any;
    deleteComponent(this: any, uid: UID.Component): any;
};
//# sourceMappingURL=component-builder.d.ts.map