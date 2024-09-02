import { Permission } from '@strapi/helper-plugin';
import { Localization } from '../utils/data';
import type { Locale } from '../store/reducers';
import type { Entity } from '@strapi/types';
export interface CMEditViewLocalePickerProps {
    appLocales: Locale[];
    createPermissions: Permission[];
    currentEntityId: Entity.ID;
    currentLocale: string;
    localizations: Localization[];
    readPermissions: Permission[];
}
declare const CMEditViewLocalePicker: ({ appLocales, createPermissions, currentEntityId, currentLocale, localizations, readPermissions, }: CMEditViewLocalePickerProps) => import("react/jsx-runtime").JSX.Element | null;
export { CMEditViewLocalePicker };
