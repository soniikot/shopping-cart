import type { Strapi } from '@strapi/types';
declare const _default: (app: Strapi) => {
    logStats(): void;
    logFirstStartupMessage(): void;
    logDefaultStartupMessage(): void;
    logStartupMessage({ isInitialized }: {
        isInitialized: boolean;
    }): void;
};
export default _default;
//# sourceMappingURL=startup-logger.d.ts.map