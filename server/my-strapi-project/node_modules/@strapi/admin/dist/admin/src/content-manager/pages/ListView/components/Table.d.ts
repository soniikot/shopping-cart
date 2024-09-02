import * as React from 'react';
import { Entity } from '@strapi/types';
interface CheckboxDataCellProps {
    rowId: Entity.ID;
    index: number;
}
interface EntityActionsDataCellProps {
    rowId: Entity.ID;
    index: number;
    canCreate?: boolean;
    canDelete?: boolean;
    setIsConfirmDeleteRowOpen: (isOpen: boolean) => void;
    handleCloneClick: (id: Entity.ID) => () => void;
}
interface RootProps {
    children: React.ReactNode;
    onConfirmDelete: (id: Entity.ID) => Promise<void>;
    isConfirmDeleteRowOpen: boolean;
    setIsConfirmDeleteRowOpen: (isOpen: boolean) => void;
}
declare const Table: {
    CheckboxDataCell: ({ rowId, index }: CheckboxDataCellProps) => import("react/jsx-runtime").JSX.Element;
    EntityActionsDataCell: ({ rowId, index, canCreate, canDelete, setIsConfirmDeleteRowOpen, handleCloneClick, }: EntityActionsDataCellProps) => import("react/jsx-runtime").JSX.Element;
    Root: ({ children, onConfirmDelete, isConfirmDeleteRowOpen, setIsConfirmDeleteRowOpen, }: RootProps) => import("react/jsx-runtime").JSX.Element;
};
type TableProps = RootProps;
export { Table };
export type { TableProps };
