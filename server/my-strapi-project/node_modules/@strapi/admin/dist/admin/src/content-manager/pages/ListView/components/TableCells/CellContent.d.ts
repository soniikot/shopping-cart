import type { FormattedContentTypeLayout } from '../../../../utils/layouts';
import type { TableHeader } from '../../ListViewPage';
import type { Attribute, Entity } from '@strapi/types';
interface CellContentProps extends Omit<TableHeader, 'key'> {
    content: Attribute.GetValue<Attribute.Any>;
    rowId: Entity.ID;
    contentType: FormattedContentTypeLayout;
}
declare const CellContent: ({ content, fieldSchema, metadatas, name, rowId, contentType, }: CellContentProps) => import("react/jsx-runtime").JSX.Element;
export { CellContent };
export type { CellContentProps };
