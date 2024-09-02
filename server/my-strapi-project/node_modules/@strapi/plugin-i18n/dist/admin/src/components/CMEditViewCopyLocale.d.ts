import { Permission } from '@strapi/helper-plugin';
import { Locale } from '../store/reducers';
import { Localization } from '../utils/data';
interface CMEditViewCopyLocaleProps {
    appLocales: Locale[];
    currentLocale: string;
    localizations: Localization[];
    readPermissions: Permission[];
}
declare const CMEditViewCopyLocale: ({ appLocales, currentLocale, localizations, readPermissions, }: CMEditViewCopyLocaleProps) => import("react/jsx-runtime").JSX.Element | null;
export { CMEditViewCopyLocale };
