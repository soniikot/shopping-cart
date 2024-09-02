import type { UID } from '@strapi/types';
interface DynamicZoneListProps {
    addComponent: (name?: string) => void;
    components: Array<string>;
    customRowComponent?: () => void;
    name?: string;
    targetUid: UID.Component;
}
export declare const DynamicZoneList: ({ customRowComponent, components, addComponent, name, targetUid, }: DynamicZoneListProps) => import("react/jsx-runtime").JSX.Element;
export {};
