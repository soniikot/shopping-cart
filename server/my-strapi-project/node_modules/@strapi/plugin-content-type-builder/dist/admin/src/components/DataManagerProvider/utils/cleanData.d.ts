import type { Components, Component, AttributeType, ContentTypes } from '../../../types';
import type { UID } from '@strapi/types';
declare const getCreatedAndModifiedComponents: (allComponents: Components, initialComponents: Components) => string[];
declare const formatComponent: (component: Component | Record<string, any>, mainDataUID: UID.Any) => any;
declare const formatMainDataType: (data: any, isComponent?: boolean) => ({
    category: any;
} | {
    category?: undefined;
}) & Pick<any, string | number | symbol> & {
    attributes: Record<string, AttributeType>;
};
declare const getComponentsToPost: (allComponents: Components, initialComponents: Components, mainDataUID: UID.Any) => any[];
declare const sortContentType: (types: ContentTypes) => {
    visible: any;
    name: string;
    title: any;
    plugin: string | null;
    uid: string;
    to: string;
    kind: any;
    restrictRelationsTo: any;
}[];
export { formatComponent, formatMainDataType, getComponentsToPost, getCreatedAndModifiedComponents, sortContentType, };
