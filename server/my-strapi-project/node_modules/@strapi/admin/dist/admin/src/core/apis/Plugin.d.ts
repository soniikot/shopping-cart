/// <reference types="react" />
import { Plugin as IPlugin } from '@strapi/helper-plugin';
export interface PluginConfig extends Partial<Pick<IPlugin, 'apis' | 'initializer' | 'injectionZones' | 'isReady'>> {
    name: string;
    id: string;
}
export declare class Plugin implements IPlugin {
    apis: IPlugin['apis'];
    initializer: IPlugin['initializer'] | null;
    injectionZones: IPlugin['injectionZones'];
    isReady: IPlugin['isReady'];
    name: IPlugin['name'];
    pluginId: PluginConfig['id'];
    constructor(pluginConf: PluginConfig);
    getInjectedComponents(containerName: string, blockName: string): {
        name: string;
        Component: import("react").ComponentType<{}>;
    }[];
    injectComponent(containerName: string, blockName: string, component: ReturnType<IPlugin['getInjectedComponents']>[number]): void;
}
