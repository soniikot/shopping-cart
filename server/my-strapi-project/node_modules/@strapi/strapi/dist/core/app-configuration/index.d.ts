import _ from 'lodash';
declare const _default: (dirs: {
    app: string;
    dist: string;
}, initialConfig?: any) => {
    launchedAt: number;
    serveAdminPanel: any;
    autoReload: any;
    environment: string | undefined;
    uuid: any;
    packageJsonStrapi: Pick<any, string | number | symbol>;
    info: any;
} & {
    server: {
        host: string;
        port: string | number;
        proxy: boolean;
        cron: {
            enabled: boolean;
        };
        admin: {
            autoOpen: boolean;
        };
        dirs: {
            public: string;
        };
    };
    admin: {};
    api: {
        rest: {
            prefix: string;
        };
    };
} & _.Omit<Record<string, unknown>, "plugins"> & Record<string, unknown>;
export default _default;
//# sourceMappingURL=index.d.ts.map