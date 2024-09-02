import type { CellContentProps } from './CellContent';
import type { Entity } from '@strapi/types';
interface RelationSingleProps extends Pick<CellContentProps, 'metadatas' | 'content'> {
}
declare const RelationSingle: ({ metadatas, content }: RelationSingleProps) => import("react/jsx-runtime").JSX.Element;
interface RelationMultipleProps extends Pick<CellContentProps, 'metadatas' | 'name' | 'content'> {
    entityId: Entity.ID;
    uid: string;
}
declare const RelationMultiple: ({ metadatas, name, entityId, content, uid }: RelationMultipleProps) => import("react/jsx-runtime").JSX.Element;
export { RelationSingle, RelationMultiple };
export type { RelationSingleProps, RelationMultipleProps };
