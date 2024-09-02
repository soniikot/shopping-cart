import { PUBLICATION_STATES } from '../Relations/RelationInputDataManager';
interface RelationDragPreviewProps {
    status: typeof PUBLICATION_STATES.DRAFT | typeof PUBLICATION_STATES.PUBLISHED;
    displayedValue: string;
    width: number;
}
declare const RelationDragPreview: ({ status, displayedValue, width }: RelationDragPreviewProps) => import("react/jsx-runtime").JSX.Element;
export { RelationDragPreview };
export type { RelationDragPreviewProps };
