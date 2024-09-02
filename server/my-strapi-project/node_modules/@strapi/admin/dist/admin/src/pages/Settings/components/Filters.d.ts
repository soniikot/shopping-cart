import { FilterPopoverURLQueryProps } from '@strapi/helper-plugin';
interface FitlersProps extends Pick<FilterPopoverURLQueryProps, 'displayedFilters'> {
}
declare const Filters: ({ displayedFilters }: FitlersProps) => import("react/jsx-runtime").JSX.Element;
export { Filters, FitlersProps };
