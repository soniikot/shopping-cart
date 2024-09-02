import type { LoadedStrapi } from '@strapi/types';
export type ValidStrapiAssertion = (strapi: unknown, msg?: string) => asserts strapi is LoadedStrapi;
export declare const assertValidStrapi: ValidStrapiAssertion;
//# sourceMappingURL=providers.d.ts.map