import { ComponentType } from 'react';
import type { SchemaType } from '../types';
import type { UID } from '@strapi/types';
interface ListProps {
    addComponentToDZ?: () => void;
    customRowComponent: ComponentType<any>;
    editTarget: SchemaType;
    firstLoopComponentUid?: string;
    isFromDynamicZone?: boolean;
    isNestedInDZComponent?: boolean;
    isMain?: boolean;
    items: any[];
    secondLoopComponentUid?: string | null;
    targetUid?: UID.Any;
    isSub?: boolean;
}
export declare const List: ({ addComponentToDZ, customRowComponent, editTarget, firstLoopComponentUid, isFromDynamicZone, isMain, isNestedInDZComponent, isSub, items, secondLoopComponentUid, targetUid, }: ListProps) => import("react/jsx-runtime").JSX.Element;
export {};
