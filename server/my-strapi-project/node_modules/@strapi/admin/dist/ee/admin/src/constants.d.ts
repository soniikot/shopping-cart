import type { SettingsMenu } from '../../../admin/src/constants';
export declare const ADMIN_PERMISSIONS_EE: {
    settings: {
        auditLogs: {
            main: {
                action: string;
                subject: null;
            }[];
            read: {
                action: string;
                subject: null;
            }[];
            update: {
                action: string;
                subject: null;
            }[];
        };
        'review-workflows': {
            main: {
                action: string;
                subject: null;
            }[];
            read: {
                action: string;
                subject: null;
            }[];
            create: {
                action: string;
                subject: null;
            }[];
            delete: {
                action: string;
                subject: null;
            }[];
            update: {
                action: string;
                subject: null;
            }[];
        };
        sso: {
            main: {
                action: string;
                subject: null;
            }[];
            read: {
                action: string;
                subject: null;
            }[];
            update: {
                action: string;
                subject: null;
            }[];
        };
    };
};
export declare const ROUTES_EE: {
    Component: () => {
        default: () => import("react/jsx-runtime").JSX.Element;
    };
    to: string;
    exact: boolean;
}[];
export declare const SETTINGS_LINKS_EE: () => SettingsMenu;
