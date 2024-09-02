import { TableProps as DynamicTableProps } from '@strapi/helper-plugin';
import { ApiToken } from '../../../../../../shared/contracts/api-token';
import { SanitizedTransferToken } from '../../../../../../shared/contracts/transfer';
import type { Entity } from '@strapi/types';
interface TokenTableRowData {
    id: Entity.ID;
    name: string;
    description: string;
    createdAt: string;
    lastUsedAt: string;
}
interface TableProps extends Pick<DynamicTableProps<TokenTableRowData>, 'contentType' | 'onConfirmDelete' | 'headers' | 'isLoading'> {
    permissions: {
        canRead: boolean;
        canDelete: boolean;
        canUpdate: boolean;
    };
    tokens: SanitizedTransferToken[] | ApiToken[];
    tokenType: 'api-token' | 'transfer-token';
}
declare const Table: ({ permissions, headers, contentType, isLoading, tokens, onConfirmDelete, tokenType, }: TableProps) => import("react/jsx-runtime").JSX.Element;
export { Table };
export type { TableProps };
