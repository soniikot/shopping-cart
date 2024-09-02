import type { Attribute } from '@strapi/types';
interface CellValueProps {
    type: Attribute.Kind | 'custom';
    value: any;
}
declare const CellValue: ({ type, value }: CellValueProps) => string;
export { CellValue };
export type { CellValueProps };
