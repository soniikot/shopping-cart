import type { Context } from 'koa';
import '@strapi/types';
import type { GetProjectSettings } from '../../../shared/contracts/admin';
declare module 'koa' {
    interface Request {
        files: unknown;
    }
}
/**
 * A set of functions called "actions" for `Admin`
 */
declare const _default: {
    getProjectType(): Promise<{
        data: {
            isEE: boolean;
            features: never[];
            flags: {};
        };
    }>;
    init(): Promise<{
        data: {
            uuid: false;
            hasAdmin: boolean;
            menuLogo: string | null;
            authLogo: string | null;
        };
    }>;
    getProjectSettings(): Promise<GetProjectSettings.Response>;
    updateProjectSettings(ctx: Context): Promise<GetProjectSettings.Response>;
    telemetryProperties(ctx: Context): Promise<{
        data: {
            useTypescriptOnServer: any;
            useTypescriptOnAdmin: any;
            isHostedOnStrapiCloud: boolean;
            numberOfAllContentTypes: number;
            numberOfComponents: number;
            numberOfDynamicZones: number;
        };
    } | undefined>;
    information(): Promise<{
        data: {
            currentEnvironment: string;
            autoReload: false;
            strapiVersion: null;
            dependencies: {};
            projectId: null;
            nodeVersion: string;
            communityEdition: boolean;
            useYarn: boolean;
        };
    }>;
    plugins(ctx: Context): Promise<void>;
};
export default _default;
//# sourceMappingURL=admin.d.ts.map