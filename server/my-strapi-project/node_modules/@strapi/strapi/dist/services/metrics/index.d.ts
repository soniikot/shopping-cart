/**
 * Strapi telemetry package.
 * You can learn more at https://docs.strapi.io/developer-docs/latest/getting-started/usage-information.html
 */
import type { Strapi } from '@strapi/types';
declare const createTelemetryInstance: (strapi: Strapi) => {
    readonly isDisabled: boolean;
    register(): void;
    bootstrap(): void;
    destroy(): void;
    send(event: string, payload?: Record<string, unknown>): Promise<boolean>;
};
export default createTelemetryInstance;
//# sourceMappingURL=index.d.ts.map