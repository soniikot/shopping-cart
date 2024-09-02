import type { Strapi } from '@strapi/types';
declare const createUpdateNotifier: (strapi: Strapi) => {
    notify({ checkInterval, notifInterval }?: {
        checkInterval?: number | undefined;
        notifInterval?: number | undefined;
    }): void;
};
export default createUpdateNotifier;
//# sourceMappingURL=index.d.ts.map