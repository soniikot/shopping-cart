import { ReducersMapObject } from '@reduxjs/toolkit';
import { MenuItem, StrapiAppSetting, StrapiAppSettingLink } from '@strapi/helper-plugin';
import { DefaultTheme } from 'styled-components';
import { InjectionZoneBlock, InjectionZoneComponent, InjectionZoneContainer, InjectionZoneModule, InjectionZones } from './components/InjectionZone';
import { Components, Component } from './core/apis/Components';
import { CustomFields } from './core/apis/CustomFields';
import { Field, Fields } from './core/apis/Fields';
import { Middleware, Middlewares } from './core/apis/Middlewares';
import { Plugin, PluginConfig } from './core/apis/Plugin';
import { Reducers } from './core/apis/Reducers';
import { PreloadState, Store } from './core/store/configure';
import { Handler, createHook } from './core/utils/createHook';
interface StrapiAppConstructorArgs extends Partial<Pick<StrapiApp, 'appPlugins'>> {
    adminConfig?: {
        config?: StrapiApp['customConfigurations'];
        bootstrap?: StrapiApp['customBootstrapConfiguration'];
    };
}
interface StrapiAppPlugin {
    bootstrap: (args: Pick<StrapiApp, 'addSettingsLink' | 'addSettingsLinks' | 'getPlugin' | 'injectContentManagerComponent' | 'injectAdminComponent' | 'registerHook'>) => void;
    register: (app: StrapiApp) => void;
    registerTrads: (args: {
        locales: string[];
    }) => Promise<{
        data: Record<string, string>;
        locale: string;
    }[]>;
}
declare class StrapiApp {
    admin: {
        injectionZones: InjectionZones;
    };
    appPlugins: Record<string, StrapiAppPlugin>;
    configurations: {
        authLogo: string;
        head: {
            favicon: string;
        };
        locales: string[];
        menuLogo: string;
        notifications: {
            releases: boolean;
        };
        themes: {
            light: DefaultTheme;
            dark: DefaultTheme;
        };
        translations: Record<string, Record<string, string>>;
        tutorials: boolean;
    };
    customBootstrapConfiguration: unknown;
    customConfigurations: {
        auth?: {
            logo: string;
        };
        head?: {
            favicon: string;
        };
        locales?: string[];
        menu?: {
            logo: string;
        };
        notifications?: {
            releases: boolean;
        };
        theme?: {
            light: DefaultTheme;
            dark: DefaultTheme;
        };
        translations?: Record<string, unknown>;
        tutorials?: boolean;
    };
    customFields: CustomFields;
    hooksDict: Record<string, ReturnType<typeof createHook>>;
    library: {
        components: Components;
        fields: Fields;
    };
    menu: MenuItem[];
    middlewares: Middlewares;
    plugins: Record<string, Plugin>;
    reducers: Reducers;
    settings: Record<string, StrapiAppSetting>;
    translations: StrapiApp['configurations']['translations'];
    /**
     * APIs
     */
    private contentManager;
    constructor({ adminConfig, appPlugins }?: StrapiAppConstructorArgs);
    addComponents: (components: Component | Component[]) => void;
    addCorePluginMenuLink: (link: MenuItem) => void;
    addFields: (fields: Field | Field[]) => void;
    addMenuLink: (link: MenuItem) => void;
    addMiddlewares: (middlewares: Middleware[]) => void;
    addReducers: (reducers: ReducersMapObject) => void;
    addSettingsLink: (sectionId: keyof StrapiApp['settings'], link: StrapiAppSettingLink) => void;
    addSettingsLinks: (sectionId: keyof StrapiApp['settings'], links: StrapiAppSettingLink[]) => void;
    bootstrap(): Promise<void>;
    bootstrapAdmin: () => Promise<void>;
    createCustomConfigurations: () => Promise<void>;
    createHook: (name: string) => void;
    createSettingSection: (section: StrapiAppSetting, links: StrapiAppSettingLink[]) => void;
    createStore: (preloadedState?: PreloadState) => Store;
    getAdminInjectedComponents: (moduleName: InjectionZoneModule, containerName: InjectionZoneContainer, blockName: InjectionZoneBlock) => InjectionZoneComponent[];
    getPlugin: (pluginId: PluginConfig['id']) => Plugin;
    initialize(): Promise<void>;
    injectContentManagerComponent: <TContainerName extends "listView" | "editView">(containerName: TContainerName, blockName: keyof {
        editView: {
            informations: InjectionZoneComponent[];
            'right-links': InjectionZoneComponent[];
        };
        listView: {
            actions: InjectionZoneComponent[];
            deleteModalAdditionalInfos: InjectionZoneComponent[];
            publishModalAdditionalInfos: InjectionZoneComponent[];
            unpublishModalAdditionalInfos: InjectionZoneComponent[];
        };
    }[TContainerName], component: InjectionZoneComponent) => void;
    injectAdminComponent: <TContainerName extends "tutorials">(containerName: TContainerName, blockName: keyof {
        tutorials: {
            links: InjectionZoneComponent[];
        };
    }[TContainerName], component: InjectionZoneComponent) => void;
    /**
     * Load the admin translations
     * @returns {Object} The imported admin translations
     */
    loadAdminTrads(): Promise<{
        [locale: string]: Record<string, string>;
    }>;
    /**
     * Load the application's translations and merged the custom translations
     * with the default ones.
     *
     */
    loadTrads(): Promise<void>;
    registerHook: (name: string, fn: Handler) => void;
    registerPlugin: (pluginConf: PluginConfig) => void;
    runHookSeries: (name: string, asynchronous?: boolean) => any[] | Promise<any[]>;
    runHookWaterfall: <T>(name: string, initialValue: T, asynchronous?: boolean, store?: Store) => T | Promise<T>;
    runHookParallel: (name: string) => Promise<any[]>;
    render(): import("react/jsx-runtime").JSX.Element;
}
export { StrapiApp, StrapiAppConstructorArgs };
