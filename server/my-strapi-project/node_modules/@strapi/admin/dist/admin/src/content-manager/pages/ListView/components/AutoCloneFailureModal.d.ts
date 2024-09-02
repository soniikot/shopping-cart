import type { Entity } from '@strapi/types';
type Reason = 'relation' | 'unique';
type ProhibitedCloningField = [string[], Reason];
interface AutoCloneFailureModalProps {
    onClose: () => void;
    entryId: Entity.ID | null;
    prohibitedFields: ProhibitedCloningField[];
    pluginQueryParams: string;
}
declare const AutoCloneFailureModal: ({ onClose, entryId, prohibitedFields, pluginQueryParams, }: AutoCloneFailureModalProps) => import("react/jsx-runtime").JSX.Element | null;
export { AutoCloneFailureModal };
export type { ProhibitedCloningField };
