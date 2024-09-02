import type { CMAdminConfiguration, I18nBaseQuery } from '../types';
interface MutateEditViewLayoutHookArgs {
    layout: {
        components: Record<string, CMAdminConfiguration>;
        contentType: CMAdminConfiguration;
    };
    query?: I18nBaseQuery;
}
declare const mutateEditViewLayoutHook: ({ layout, query }: MutateEditViewLayoutHookArgs) => {
    layout: {
        components: Record<string, CMAdminConfiguration>;
        contentType: CMAdminConfiguration;
    };
    query: I18nBaseQuery | undefined;
} | {
    query: I18nBaseQuery | undefined;
    layout: {
        contentType: {
            layouts: {
                edit: ({
                    labelAction: import("react/jsx-runtime").JSX.Element;
                    queryInfos: {
                        defaultParams: {
                            locale: string;
                        };
                        paramsToKeep: string[];
                        shouldDisplayRelationLink: boolean;
                    };
                    fieldSchema: Pick<import("@strapi/types/dist/types/core/attributes").Relation<import("@strapi/types/dist/types/core/common/uid").Schema, import("@strapi/types/dist/types/core/attributes").RelationKind.Any, import("@strapi/types/dist/types/core/common/uid").ContentType>, "type" | "pluginOptions" | "relation"> & {
                        mappedBy: string;
                        relationType: string;
                        target: string;
                        targetModel: string;
                    };
                    targetModelPluginOptions: object;
                    name: string;
                    size: number;
                    metadatas: {
                        description: string;
                        editable: boolean;
                        label: string;
                        placeholder: string;
                        visible: boolean;
                    };
                } | {
                    labelAction: import("react/jsx-runtime").JSX.Element;
                    fieldSchema: Pick<import("@strapi/types/dist/types/core/attributes").Relation<import("@strapi/types/dist/types/core/common/uid").Schema, import("@strapi/types/dist/types/core/attributes").RelationKind.Any, import("@strapi/types/dist/types/core/common/uid").ContentType>, "type" | "pluginOptions" | "relation"> & {
                        mappedBy: string;
                        relationType: string;
                        target: string;
                        targetModel: string;
                    };
                    queryInfos: {
                        shouldDisplayRelationLink: boolean;
                        defaultParams: {
                            [key: string]: string | undefined;
                            locale?: string | undefined;
                        };
                    };
                    targetModelPluginOptions: object;
                    name: string;
                    size: number;
                    metadatas: {
                        description: string;
                        editable: boolean;
                        label: string;
                        placeholder: string;
                        visible: boolean;
                    };
                } | {
                    labelAction: import("react/jsx-runtime").JSX.Element;
                    name: string;
                    size: number;
                    fieldSchema: Pick<import("@strapi/types/dist/types/core/attributes").BigInteger | (import("@strapi/types/dist/types/core/attributes").OfType<"boolean"> & import("@strapi/types/dist/types/core/attributes").ConfigurableOption & import("@strapi/types/dist/types/core/attributes").DefaultOption<boolean> & import("@strapi/types/dist/types/core/attributes").PrivateOption & import("@strapi/types/dist/types/core/attributes").RequiredOption & import("@strapi/types/dist/types/core/attributes").WritableOption & import("@strapi/types/dist/types/core/attributes").VisibleOption) | import("@strapi/types/dist/types/core/attributes").Blocks | import("@strapi/types/dist/types/core/attributes").Decimal | import("@strapi/types/dist/types/core/attributes").DynamicZone<`${string}.${string}`[]> | import("@strapi/types/dist/types/core/attributes").Enumeration<string[]> | import("@strapi/types/dist/types/core/attributes").Email | import("@strapi/types/dist/types/core/attributes").Float | import("@strapi/types/dist/types/core/attributes").Integer | import("@strapi/types/dist/types/core/attributes").JSON | import("@strapi/types/dist/types/core/attributes").Password | import("@strapi/types/dist/types/core/attributes").RichText | (import("@strapi/types/dist/types/core/attributes").OfType<"string"> & import("@strapi/types/dist/types/core/attributes").StringProperties & import("@strapi/types/dist/types/core/attributes").ConfigurableOption & import("@strapi/types/dist/types/core/attributes").DefaultOption<string> & import("@strapi/types/dist/types/core/attributes").MinMaxLengthOption & import("@strapi/types/dist/types/core/attributes").PrivateOption & import("@strapi/types/dist/types/core/attributes").UniqueOption & import("@strapi/types/dist/types/core/attributes").RequiredOption & import("@strapi/types/dist/types/core/attributes").WritableOption & import("@strapi/types/dist/types/core/attributes").VisibleOption) | import("@strapi/types/dist/types/core/attributes").Text | import("@strapi/types/dist/types/core/attributes").Date | import("@strapi/types/dist/types/core/attributes").DateTime | import("@strapi/types/dist/types/core/attributes").Time | import("@strapi/types/dist/types/core/attributes").Timestamp | import("@strapi/types/dist/types/core/attributes").Component<`${string}.${string}`, boolean> | import("@strapi/types/dist/types/core/attributes").Media<import("@strapi/types/dist/types/core/attributes").MediaKind | undefined, boolean> | import("@strapi/types/dist/types/core/attributes").UID<import("@strapi/types/dist/types/core/common/uid").Schema, string, import("@strapi/types/dist/types/core/attributes").UIDOptions>, "type" | "pluginOptions">;
                    metadatas: {
                        description: string;
                        editable: boolean;
                        label: string;
                        placeholder: string;
                        visible: boolean;
                    };
                })[][];
                list: null;
            };
            apiID: string;
            isDisplayed: boolean;
            uid: string;
            settings: import("../types").Settings;
            metadatas: import("../types").Metadatas;
            kind: import("@strapi/types/dist/types/core/schemas").ContentTypeKind;
            attributes: import("@strapi/types/dist/types/core/schemas").Attributes;
            modelType: "contentType";
            info: import("@strapi/types/dist/types/core/schemas").ContentTypeInfo;
            pluginOptions?: import("@strapi/types/dist/types/core/schemas").PluginOptions | undefined;
            options?: import("@strapi/types/dist/types/core/schemas").Options | undefined;
        };
        components: Record<string, CMAdminConfiguration>;
    };
};
export { mutateEditViewLayoutHook };
