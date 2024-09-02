export type SchemaData = {
    initialData: {
        name: string;
        targetAttribute: any;
    };
    modifiedData: object;
};
export type Attribute = {
    name: string;
};
export declare const getUsedAttributeNames: (attributes: Array<Attribute>, schemaData: SchemaData) => Array<string>;
