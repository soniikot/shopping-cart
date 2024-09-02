import type { Common } from '@strapi/types';
declare const _default: () => (uid: Common.UID.Schema) => {
    /**
     * Populates all attribute fields present in a query.
     * @param query - Strapi query object
     */
    populateFromQuery(query: object): any;
    /**
     * Populate relations as count if condition is true.
     * @param condition
     * @param [options]
     * @param [options.toMany] - Populate XtoMany relations as count if true.
     * @param [options.toOne] - Populate XtoOne relations as count if true.
     */
    countRelationsIf(condition: boolean, { toMany, toOne }?: {
        toMany: boolean;
        toOne: boolean;
    }): any;
    /**
     * Populate relations as count.
     * @param [options]
     * @param [options.toMany] - Populate XtoMany relations as count if true.
     * @param [options.toOne] - Populate XtoOne relations as count if true.
     */
    countRelations({ toMany, toOne }?: {
        toMany: boolean;
        toOne: boolean;
    }): any;
    /**
     * Populate relations deeply, up to a certain level.
     * @param [level=Infinity] - Max level of nested populate.
     */
    populateDeep(level?: number): any;
    /**
     * Construct the populate object based on the builder options.
     * @returns Populate object
     */
    build(): Promise<{} | undefined>;
};
export default _default;
//# sourceMappingURL=populate-builder.d.ts.map