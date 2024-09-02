import { FilterData } from '@strapi/helper-plugin';
interface FilterProps {
    displayedFilters: FilterData[];
}
declare const Filter: ({ displayedFilters }: FilterProps) => import("react/jsx-runtime").JSX.Element;
export { Filter };
export type { FilterProps };
