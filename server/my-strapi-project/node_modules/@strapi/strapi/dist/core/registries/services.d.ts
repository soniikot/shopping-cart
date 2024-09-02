import type { Strapi, Common } from '@strapi/types';
export type ServiceFactory = (params: {
    strapi: Strapi;
}) => Common.Service | Common.Service;
export type ServiceFactoryMap = Record<string, ServiceFactory>;
export type ServiceMap = Record<string, Common.Service>;
export type ServiceExtendFn = (service: Common.Service) => Common.Service;
declare const servicesRegistry: (strapi: Strapi) => {
    /**
     * Returns this list of registered services uids
     */
    keys(): string[];
    /**
     * Returns the instance of a service. Instantiate the service if not already done
     */
    get(uid: Common.UID.Service): Common.Service | undefined;
    /**
     * Returns a map with all the services in a namespace
     */
    getAll(namespace: string): ServiceMap;
    /**
     * Registers a service
     */
    set(uid: string, service: ServiceFactory): any;
    /**
     * Registers a map of services for a specific namespace
     */
    add(namespace: string, newServices: ServiceFactoryMap): any;
    /**
     * Wraps a service to extend it
     */
    extend(uid: Common.UID.Service, extendFn: ServiceExtendFn): any;
};
export default servicesRegistry;
//# sourceMappingURL=services.d.ts.map