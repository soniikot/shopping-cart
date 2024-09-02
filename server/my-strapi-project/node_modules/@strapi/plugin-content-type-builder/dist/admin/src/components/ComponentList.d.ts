import type { UID } from '@strapi/types';
interface ComponentListProps {
    component: UID.Component;
    customRowComponent: any;
    firstLoopComponentUid?: string;
    isFromDynamicZone?: boolean;
    isNestedInDZComponent?: boolean;
}
export declare const ComponentList: ({ customRowComponent, component, isFromDynamicZone, isNestedInDZComponent, firstLoopComponentUid, }: ComponentListProps) => import("react/jsx-runtime").JSX.Element;
export {};
