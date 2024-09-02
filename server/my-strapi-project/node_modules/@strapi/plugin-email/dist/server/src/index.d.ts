declare const _default: {
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types").Strapi;
    }) => Promise<void>;
    services: {
        email: () => {
            getProviderSettings: () => import("./types").EmailConfig;
            send: (options: import("./types").SendOptions) => Promise<any>;
            sendTemplatedEmail: (emailOptions: import("./types").EmailOptions, emailTemplate: import("./types").EmailTemplate, data: import("./types").EmailTemplateData) => any;
        };
    };
    routes: {
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: (string | {
                        name: string;
                        config: {
                            actions: string[];
                        };
                    })[];
                };
            }[];
        };
        'content-api': {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
            }[];
        };
    };
    controllers: {
        email: {
            send(ctx: Koa.Context): Promise<void>;
            test(ctx: Koa.Context): Promise<void>;
            getSettings(ctx: Koa.Context): Promise<void>;
        };
    };
    config: import("./types").StrapiConfig;
};
export default _default;
