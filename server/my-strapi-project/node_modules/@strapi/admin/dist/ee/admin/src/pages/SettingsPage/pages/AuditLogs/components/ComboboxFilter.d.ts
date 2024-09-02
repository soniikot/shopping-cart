import { ComboboxProps } from '@strapi/design-system';
type ComboboxFilterProps = {
    value?: string;
    options?: {
        label: string;
        customValue: string;
    }[];
    onChange?: ComboboxProps['onChange'];
};
export declare const ComboboxFilter: ({ value, options, onChange }?: ComboboxFilterProps) => import("react/jsx-runtime").JSX.Element;
export {};
