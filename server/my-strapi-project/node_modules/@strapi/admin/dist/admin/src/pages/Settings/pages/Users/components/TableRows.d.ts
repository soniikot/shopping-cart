import { TableRowProps } from '@strapi/helper-plugin';
import { SanitizedAdminUser } from '../../../../../../../shared/contracts/shared';
import type { ListPageTableHeader } from '../ListPage';
interface TableRowsProps extends Partial<TableRowProps<SanitizedAdminUser, ListPageTableHeader>> {
    canDelete: boolean;
}
declare const TableRows: ({ canDelete, headers, entriesToDelete, onClickDelete, onSelectRow, withMainAction, withBulkActions, rows, }: TableRowsProps) => import("react/jsx-runtime").JSX.Element;
export { TableRows };
export type { TableRowsProps };
