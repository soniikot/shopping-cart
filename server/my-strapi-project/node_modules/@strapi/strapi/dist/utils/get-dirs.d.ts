import type { Strapi, StrapiDirectories } from '@strapi/types';
export type Options = {
    app: string;
    dist: string;
};
declare const getDirs: ({ app: appDir, dist: distDir }: Options, { strapi }: {
    strapi: Strapi;
}) => StrapiDirectories;
export default getDirs;
//# sourceMappingURL=get-dirs.d.ts.map