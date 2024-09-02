/**
 *
 * App.js
 *
 */
import { ConfigurationProviderProps } from './features/Configuration';
interface AppProps extends Omit<ConfigurationProviderProps, 'children' | 'authLogo' | 'menuLogo'> {
    authLogo: string;
    menuLogo: string;
}
export declare const App: ({ authLogo, menuLogo, showReleaseNotification, showTutorials }: AppProps) => import("react/jsx-runtime").JSX.Element;
export {};
