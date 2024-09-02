import * as React from 'react';
import { FlexProps, ComboboxProps } from '@strapi/design-system';
import { ListChildComponentProps } from 'react-window';
import { UseDragAndDropOptions } from '../../hooks/useDragAndDrop';
import type { NormalizedRelation } from './utils/normalizeRelations';
import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import type { Entity } from '@strapi/types';
interface RelationInputProps extends Pick<ComboboxProps, 'disabled' | 'error' | 'id' | 'labelAction' | 'placeholder' | 'required'>, Pick<RelationItemProps, 'onCancel' | 'onDropItem' | 'onGrabItem' | 'iconButtonAriaLabel'> {
    canReorder: boolean;
    description: ComboboxProps['hint'];
    numberOfRelationsToDisplay: number;
    label: string;
    labelLoadMore?: string;
    labelDisconnectRelation: string;
    listAriaDescription: string;
    liveText: string;
    loadingMessage: string;
    name: string;
    noRelationsMessage: string;
    onRelationConnect: (relation: Contracts.Relations.RelationResult) => void;
    onRelationLoadMore: () => void;
    onRelationDisconnect: (relation: NormalizedRelation) => void;
    onRelationReorder?: (currentIndex: number, newIndex: number) => void;
    onSearchNextPage: () => void;
    onSearch: (searchTerm?: string) => void;
    publicationStateTranslations: {
        draft: string;
        published: string;
    };
    relations: {
        data: NormalizedRelation[];
        isLoading: boolean;
        isFetchingNextPage: boolean;
        hasNextPage?: boolean;
    };
    searchResults: {
        data: NormalizedRelation[];
        isLoading: boolean;
        hasNextPage?: boolean;
    };
    size: number;
}
declare const RelationInput: ({ canReorder, description, disabled, error, iconButtonAriaLabel, id, name, numberOfRelationsToDisplay, label, labelAction, labelLoadMore, labelDisconnectRelation, listAriaDescription, liveText, loadingMessage, onCancel, onDropItem, onGrabItem, noRelationsMessage, onRelationConnect, onRelationLoadMore, onRelationDisconnect, onRelationReorder, onSearchNextPage, onSearch, placeholder, publicationStateTranslations, required, relations: paginatedRelations, searchResults, size, }: RelationInputProps) => import("react/jsx-runtime").JSX.Element;
declare const DisconnectButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {}, never>;
declare const LinkEllipsis: import("styled-components").StyledComponent<React.ForwardRefExoticComponent<import("@strapi/design-system/Link/Link.js").LinkProps & React.RefAttributes<HTMLAnchorElement>>, import("styled-components").DefaultTheme, {}, never>;
interface RelationItemProps extends Pick<UseDragAndDropOptions, 'onCancel' | 'onDropItem' | 'onGrabItem'>, Omit<FlexProps, 'id' | 'style'>, Pick<ListChildComponentProps, 'style' | 'index'> {
    ariaDescribedBy: string;
    canDrag: boolean;
    children: React.ReactNode;
    displayValue: string;
    disabled: boolean;
    endAction: React.ReactNode;
    iconButtonAriaLabel: string;
    id: Entity.ID;
    name: string;
    status?: NormalizedRelation['publicationState'];
    updatePositionOfRelation: UseDragAndDropOptions['onMoveItem'];
}
declare const FlexWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, FlexProps<"div">, never>;
declare const ChildrenWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, FlexProps<"div">, never>;
export { RelationInput, FlexWrapper, ChildrenWrapper, LinkEllipsis, DisconnectButton };
export type { RelationInputProps };
