import { FieldInputProps } from 'formik';
import type { Entity } from '@strapi/types';
interface SelectRolesProps extends Pick<FieldInputProps<Entity.ID[]>, 'onChange' | 'value'> {
    disabled?: boolean;
    error?: string;
}
declare const SelectRoles: ({ disabled, error, onChange, value }: SelectRolesProps) => import("react/jsx-runtime").JSX.Element;
export { SelectRoles };
