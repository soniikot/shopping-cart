import { CellContentProps } from './CellContent';
import type { Attribute } from '@strapi/types';
interface SingleComponentProps extends Pick<CellContentProps, 'metadatas'> {
    content: Attribute.GetValue<Attribute.Component>;
}
declare const SingleComponent: ({ content, metadatas }: SingleComponentProps) => import("react/jsx-runtime").JSX.Element | null;
interface RepeatableComponentProps extends Pick<CellContentProps, 'metadatas'> {
    content: Attribute.GetValue<Attribute.Component<`${string}.${string}`, true>>;
}
declare const RepeatableComponent: ({ content, metadatas }: RepeatableComponentProps) => import("react/jsx-runtime").JSX.Element | null;
export { SingleComponent, RepeatableComponent };
export type { SingleComponentProps, RepeatableComponentProps };
