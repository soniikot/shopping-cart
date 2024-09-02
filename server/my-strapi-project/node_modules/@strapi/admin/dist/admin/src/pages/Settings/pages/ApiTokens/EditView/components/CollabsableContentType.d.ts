import { ContentApiPermission } from '../../../../../../../../shared/contracts/content-api/permissions';
interface CollapsableContentTypeProps {
    controllers?: ContentApiPermission['controllers'];
    label: ContentApiPermission['label'];
    orderNumber?: number;
    disabled?: boolean;
    onExpanded?: (orderNumber: number) => void;
    indexExpandendCollapsedContent: number | null;
}
export declare const CollapsableContentType: ({ controllers, label, orderNumber, disabled, onExpanded, indexExpandendCollapsedContent, }: CollapsableContentTypeProps) => import("react/jsx-runtime").JSX.Element;
export {};
