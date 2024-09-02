declare const coreApi: () => {
    addCreateLocalizationAction: (contentType: any) => void;
    addGraphqlLocalizationAction: (contentType: any) => void;
    createSanitizer: (contentType: any) => {
        sanitizeInput: (data: any) => Pick<any, string>;
        sanitizeInputFiles: (files: any) => any;
    };
    createCreateLocalizationHandler: (contentType: any) => (args?: any) => Promise<unknown>;
};
type CoreApiService = typeof coreApi;
export default coreApi;
export { CoreApiService };
//# sourceMappingURL=core-api.d.ts.map