import type { Strapi, Common } from '../../../../..';
export type Controller = ({ strapi }: {
    strapi: Strapi;
}) => Common.Controller;
export interface Controllers {
    [key: string]: Controller;
}
//# sourceMappingURL=controllers.d.ts.map