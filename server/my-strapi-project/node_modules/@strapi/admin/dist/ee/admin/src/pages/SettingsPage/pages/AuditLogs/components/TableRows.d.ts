import React from 'react';
import { Attribute, Entity } from '@strapi/types';
import PropTypes from 'prop-types';
import { ListLayoutRow } from '../../../../../../../../admin/src/content-manager/utils/layouts';
import { AuditLog } from '../../../../../../../../shared/contracts/audit-logs';
export interface TableHeader extends Omit<ListLayoutRow, 'metadatas' | 'fieldSchema' | 'name'> {
    metadatas: Omit<ListLayoutRow['metadatas'], 'label'> & {
        label: string;
    };
    name: keyof AuditLog;
    fieldSchema?: Attribute.Any | {
        type: 'custom';
    };
    cellFormatter?: (data?: AuditLog[keyof AuditLog]) => React.ReactNode;
}
type TableRowsProps = {
    headers: TableHeader[];
    rows: AuditLog[];
    onOpenModal: (id: Entity.ID) => void;
};
export declare const TableRows: {
    ({ headers, rows, onOpenModal }: TableRowsProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        rows: never[];
    };
    propTypes: {
        headers: PropTypes.Validator<any[]>;
        rows: PropTypes.Requireable<any[]>;
        onOpenModal: PropTypes.Validator<(...args: any[]) => any>;
    };
};
export {};
