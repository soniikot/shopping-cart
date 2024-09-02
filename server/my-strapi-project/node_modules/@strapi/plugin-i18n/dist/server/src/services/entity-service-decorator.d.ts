declare const entityServiceDecorator: () => {
    decorator: (service: any) => {
        /**
         * Wraps result
         * @param {object} result - result object of query
         * @param {object} ctx - Query context
         * @param {object} ctx.model - Model that is being used
         */
        wrapResult(result?: {}, ctx?: {}): Promise<any>;
        /**
         * Wraps query options. In particular will add default locale to query params
         * @param {object} params - Query options object (params, data, files, populate)
         * @param {object} ctx - Query context
         * @param {object} ctx.model - Model that is being used
         */
        wrapParams(params?: any, ctx?: any): Promise<any>;
        /**
         * Creates an entry & make links between it and its related localizations
         * @param {string} uid - Model uid
         * @param {object} opts - Query options object (params, data, files, populate)
         */
        create(uid: any, opts?: any): Promise<any>;
        /**
         * Updates an entry & update related localizations fields
         * @param {string} uid
         * @param {string} entityId
         * @param {object} opts - Query options object (params, data, files, populate)
         */
        update(uid: any, entityId: any, opts?: any): Promise<any>;
        /**
         * Find an entry or several if fetching all locales
         * @param {string} uid - Model uid
         * @param {object} opts - Query options object (params, data, files, populate)
         */
        findMany(uid: any, opts: any): Promise<any>;
    };
    wrapParams: (params?: any, ctx?: any) => Promise<any>;
};
type EntityServiceDecoratorService = typeof entityServiceDecorator;
export default entityServiceDecorator;
export type { EntityServiceDecoratorService };
//# sourceMappingURL=entity-service-decorator.d.ts.map