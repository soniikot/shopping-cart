import type { Strapi } from '@strapi/types';
declare const _default: Readonly<{
    init: (licenseDir: string, logger?: import("winston").Logger | undefined) => void;
    checkLicense: ({ strapi }: {
        strapi: Strapi;
    }) => Promise<void>;
    readonly isEE: boolean;
    readonly seats: number | undefined;
    features: Readonly<{
        list: () => {
            name: string;
        }[];
        get: (featureName: string) => {
            name: string;
        } | undefined;
        isEnabled: (featureName: string) => boolean;
    }>;
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map