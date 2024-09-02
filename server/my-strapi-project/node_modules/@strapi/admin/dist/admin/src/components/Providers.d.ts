import * as React from 'react';
import { CustomFieldsProviderProps, LibraryProviderProps, StrapiAppProviderProps } from '@strapi/helper-plugin';
import { LanguageProviderProps } from './LanguageProvider';
import { ThemeProps } from './Theme';
import type { Store } from '../core/store/configure';
interface ProvidersProps extends Pick<LanguageProviderProps, 'messages'>, Pick<CustomFieldsProviderProps, 'customFields'>, Pick<LibraryProviderProps, 'components' | 'fields'>, Pick<StrapiAppProviderProps, 'getPlugin' | 'getAdminInjectedComponents' | 'menu' | 'plugins' | 'runHookParallel' | 'runHookSeries' | 'runHookWaterfall' | 'settings'>, Pick<ThemeProps, 'themes'> {
    children: React.ReactNode;
    store: Store;
}
declare const Providers: ({ children, components, customFields, fields, getAdminInjectedComponents, getPlugin, menu, messages, plugins, runHookParallel, runHookSeries, runHookWaterfall, settings, store, themes, }: ProvidersProps) => import("react/jsx-runtime").JSX.Element;
export { Providers };
