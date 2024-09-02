/// <reference types="react" />
import { IconByType } from './AttributeIcon';
import type { CustomFieldUID } from '@strapi/helper-plugin';
export declare const BoxWrapper: import("styled-components").StyledComponent<"div", any, import("@strapi/design-system").BoxProps<"div">, never>;
type ListRowProps = {
    configurable?: boolean;
    customField?: CustomFieldUID | null;
    editTarget: string;
    firstLoopComponentUid?: string | null;
    isFromDynamicZone?: boolean;
    name: string;
    onClick: (editTarget: string, targetUid: string | null, attributeName: string, attributeType: string, customField: string | null) => void;
    relation?: string;
    repeatable?: boolean;
    secondLoopComponentUid?: string | null;
    target?: string | null;
    targetUid?: string | null;
    type: IconByType;
};
export declare const ListRow: import("react").MemoExoticComponent<({ configurable, customField, editTarget, firstLoopComponentUid, isFromDynamicZone, name, onClick, relation, repeatable, secondLoopComponentUid, target, targetUid, type, }: ListRowProps) => import("react/jsx-runtime").JSX.Element>;
export {};
