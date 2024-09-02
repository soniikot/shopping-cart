import { SingleSelectProps } from '@strapi/design-system';
interface StageFilterProps extends Pick<SingleSelectProps, 'value' | 'onChange'> {
    uid?: string;
}
declare const StageFilter: ({ value, onChange, uid }: StageFilterProps) => import("react/jsx-runtime").JSX.Element;
export { StageFilter };
export type { StageFilterProps };
