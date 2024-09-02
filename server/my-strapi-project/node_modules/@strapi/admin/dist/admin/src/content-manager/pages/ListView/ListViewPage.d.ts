import * as React from 'react';
import { Permission } from '@strapi/helper-plugin';
import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import { FormattedLayouts, ListLayoutRow } from '../../utils/layouts';
interface TableHeader extends Omit<ListLayoutRow, 'metadatas'> {
    metadatas: ListLayoutRow['metadatas'] & {
        label: string;
    };
    cellFormatter?: (data: Contracts.CollectionTypes.Find.Response['results'][number], header: Omit<TableHeader, 'cellFormatter'>) => React.ReactNode;
}
interface ListViewPageProps {
    canCreate?: boolean;
    canDelete?: boolean;
    canRead?: boolean;
    canPublish?: boolean;
    layout: FormattedLayouts;
    slug: string;
}
declare const ListViewPage: ({ canCreate, canDelete, canRead, canPublish, layout, slug, }: ListViewPageProps) => import("react/jsx-runtime").JSX.Element | null;
interface ProtectedListViewPageProps extends ListViewPageProps {
    permissions?: Permission[] | null;
}
declare const ProtectedListViewPage: ({ permissions, ...restProps }: ProtectedListViewPageProps) => import("react/jsx-runtime").JSX.Element;
export { ListViewPage, ProtectedListViewPage };
export type { ListViewPageProps, ProtectedListViewPageProps, TableHeader };
