import type { Strapi, Common } from '@strapi/types';
export type ControllerFactory = ((params: {
    strapi: Strapi;
}) => Common.Controller) | Common.Controller;
export type ControllerFactoryMap = Record<Common.UID.Controller, ControllerFactory>;
export type ControllerMap = Record<Common.UID.Controller, Common.Controller>;
export type ControllerExtendFn = (service: Common.Controller) => Common.Controller;
declare const controllersRegistry: (strapi: Strapi) => {
    /**
     * Returns this list of registered controllers uids
     */
    keys(): string[];
    /**
     * Returns the instance of a controller. Instantiate the controller if not already done
     */
    get(uid: Common.UID.Controller): Common.Controller | undefined;
    /**
     * Returns a map with all the controller in a namespace
     */
    getAll(namespace: string): {};
    /**
     * Registers a controller
     */
    set(uid: Common.UID.Controller, value: ControllerFactory): any;
    /**
     * Registers a map of controllers for a specific namespace
     */
    add(namespace: string, newControllers: ControllerFactoryMap): any;
    /**
     * Wraps a controller to extend it
     */
    extend(controllerUID: Common.UID.Controller, extendFn: ControllerExtendFn): any;
};
export default controllersRegistry;
//# sourceMappingURL=controllers.d.ts.map