import { Entity } from '@strapi/types';
interface LocaleListCellProps {
    id?: Entity.ID;
    localizations?: Array<{
        locale: string;
    }>;
    locale?: string;
}
declare const LocaleListCell: ({ localizations, locale: currentLocaleCode, id, }: LocaleListCellProps) => import("react/jsx-runtime").JSX.Element;
export { LocaleListCell };
export type { LocaleListCellProps };
