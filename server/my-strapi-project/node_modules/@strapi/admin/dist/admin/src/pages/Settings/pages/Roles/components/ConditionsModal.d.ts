import { ModalLayoutProps } from '@strapi/design-system';
import { PermissionsDataManagerContextValue } from '../hooks/usePermissionsDataManager';
import type { HiddenCheckboxAction, VisibleCheckboxAction } from './ContentTypeCollapses';
import type { ConditionForm } from '../utils/forms';
interface ConditionAction extends Pick<ActionRowProps, 'label'> {
    actionId: string;
    isDisplayed: boolean;
    hasSomeActionsSelected?: boolean;
    hasAllActionsSelected?: boolean;
    pathToConditionsObject: string[];
}
interface ConditionsModalProps extends Pick<ActionRowProps, 'isFormDisabled'> {
    actions?: Array<ConditionAction | HiddenCheckboxAction | VisibleCheckboxAction>;
    headerBreadCrumbs?: string[];
    onClosed: ModalLayoutProps['onClose'];
    onToggle: () => void;
}
declare const ConditionsModal: ({ actions, headerBreadCrumbs, isFormDisabled, onClosed, onToggle, }: ConditionsModalProps) => import("react/jsx-runtime").JSX.Element;
interface ActionRowProps {
    arrayOfOptionsGroupedByCategory: Array<[
        string,
        PermissionsDataManagerContextValue['availableConditions']
    ]>;
    isFormDisabled?: boolean;
    isGrey?: boolean;
    label: string;
    name: string;
    onChange?: (name: string, values: Record<string, boolean>) => void;
    value: Record<string, ConditionForm>;
}
export { ConditionsModal };
export type { ConditionsModalProps };
