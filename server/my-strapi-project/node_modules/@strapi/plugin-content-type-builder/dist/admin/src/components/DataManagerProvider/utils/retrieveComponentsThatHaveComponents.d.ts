import type { Component, Components } from '../../../types';
declare const retrieveComponentsThatHaveComponents: (allComponents: Components) => `${string}.${string}`[];
declare const doesComponentHaveAComponentField: (component: Component) => boolean;
export { doesComponentHaveAComponentField, retrieveComponentsThatHaveComponents };
