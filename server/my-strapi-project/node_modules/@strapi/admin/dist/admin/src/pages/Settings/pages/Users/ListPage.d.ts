import * as React from 'react';
import { TableHeader } from '@strapi/helper-plugin';
import { IntlShape, MessageDescriptor } from 'react-intl';
import { SanitizedAdminUser } from '../../../../../../shared/contracts/shared';
declare const ListPageCE: () => import("react/jsx-runtime").JSX.Element | null;
interface ListPageTableHeader extends Omit<TableHeader, 'metadatas' | 'name'> {
    name: Extract<keyof SanitizedAdminUser, 'firstname' | 'lastname' | 'email' | 'roles' | 'username' | 'isActive'>;
    cellFormatter?: (data: SanitizedAdminUser, meta: Omit<ListPageTableHeaderWithStringMetadataLabel, 'cellFormatter'> & Pick<IntlShape, 'formatMessage'>) => React.ReactNode;
    key: string;
    metadatas: {
        label: MessageDescriptor;
    } & Omit<TableHeader['metadatas'], 'label'>;
}
interface ListPageTableHeaderWithStringMetadataLabel extends Omit<ListPageTableHeader, 'metadatas'> {
    metadatas: {
        label: string;
    } & Omit<ListPageTableHeader['metadatas'], 'label'>;
}
declare const ListPage: () => import("react/jsx-runtime").JSX.Element | null;
declare const ProtectedListPage: () => import("react/jsx-runtime").JSX.Element;
export { ProtectedListPage, ListPage, ListPageCE };
export type { ListPageTableHeaderWithStringMetadataLabel as ListPageTableHeader };
