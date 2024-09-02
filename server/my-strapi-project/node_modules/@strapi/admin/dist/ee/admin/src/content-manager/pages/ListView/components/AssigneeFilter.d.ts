import { ComboboxProps } from '@strapi/design-system';
interface AssigneeFilterProps extends Pick<ComboboxProps, 'value' | 'onChange'> {
}
declare const AssigneeFilter: ({ value, onChange }: AssigneeFilterProps) => import("react/jsx-runtime").JSX.Element;
export { AssigneeFilter };
export type { AssigneeFilterProps };
