import * as React from 'react';
import { UpdateProjectSettings } from '../../../shared/contracts/admin';
import { ConfigurationLogo } from '../services/admin';
interface UpdateProjectSettingsBody {
    authLogo: ((UpdateProjectSettings.Request['body']['authLogo'] | ConfigurationLogo['custom']) & {
        rawFile?: File;
    }) | null;
    menuLogo: ((UpdateProjectSettings.Request['body']['menuLogo'] | ConfigurationLogo['custom']) & {
        rawFile?: File;
    }) | null;
}
interface ConfigurationContextValue {
    logos: {
        auth: ConfigurationLogo;
        menu: ConfigurationLogo;
    };
    showTutorials: boolean;
    showReleaseNotification: boolean;
    updateProjectSettings: (body: UpdateProjectSettingsBody) => Promise<void>;
}
/**
 * TODO: it would be nice if this context actually lived in redux.
 * But we'd probably need to reconcile the fact we get the data three
 * different ways and what that actually looks like.
 */
declare const ConfigurationContextProvider: {
    (props: ConfigurationContextValue & {
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, useConfiguration: (consumerName: string) => ConfigurationContextValue;
interface ConfigurationProviderProps extends Required<Logos> {
    children: React.ReactNode;
    showReleaseNotification?: boolean;
    showTutorials?: boolean;
}
interface Logos {
    menuLogo: ConfigurationContextValue['logos']['menu'];
    authLogo: ConfigurationContextValue['logos']['auth'];
}
declare const ConfigurationProvider: ({ children, authLogo: defaultAuthLogo, menuLogo: defaultMenuLogo, showReleaseNotification, showTutorials, }: ConfigurationProviderProps) => import("react/jsx-runtime").JSX.Element;
export { ConfigurationContextProvider as _internalConfigurationContextProvider, ConfigurationProvider, useConfiguration, };
export type { ConfigurationProviderProps, ConfigurationContextValue, ConfigurationLogo, UpdateProjectSettingsBody, };
