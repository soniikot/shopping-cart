declare const contentTypes: () => {
    isLocalizedContentType: (model: any) => boolean;
    getValidLocale: (locale: any) => Promise<any>;
    getNewLocalizationsFrom: (relatedEntity: any) => Promise<any[]>;
    getLocalizedAttributes: (model: any) => string[];
    getNonLocalizedAttributes: (model: any) => string[];
    copyNonLocalizedAttributes: (model: any, entry: any) => any;
    getAndValidateRelatedEntity: (relatedEntityId: any, model: any, locale: any) => Promise<any>;
    fillNonLocalizedAttributes: (entry: any, relatedEntry: any, { model }: any) => void;
    getNestedPopulateOfNonLocalizedAttributes: (modelUID: any) => string[];
};
type ContentTypesService = typeof contentTypes;
export default contentTypes;
export { ContentTypesService };
//# sourceMappingURL=content-types.d.ts.map