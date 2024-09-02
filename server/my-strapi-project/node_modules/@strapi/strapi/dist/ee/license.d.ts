import type { Strapi } from '@strapi/types';
interface LicenseInfo {
    type: 'bronze' | 'silver' | 'gold';
    expireAt?: string;
    seats?: number;
    features?: Array<{
        name: string;
        options?: Record<string, unknown>;
    }>;
}
declare class LicenseCheckError extends Error {
    shouldFallback: boolean;
    constructor(message: string, shouldFallback?: boolean);
}
declare const readLicense: (directory: string) => string | undefined;
declare const verifyLicense: (license: string) => LicenseInfo;
declare const fetchLicense: ({ strapi }: {
    strapi: Strapi;
}, key: string, projectId: string) => Promise<any>;
export { readLicense, verifyLicense, fetchLicense, LicenseCheckError };
//# sourceMappingURL=license.d.ts.map