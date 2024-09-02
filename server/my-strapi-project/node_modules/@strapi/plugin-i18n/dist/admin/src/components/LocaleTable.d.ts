import { Locale } from '../store/reducers';
type LocaleTableProps = {
    locales?: Locale[];
    canDelete?: boolean;
    canEdit?: boolean;
    onDeleteLocale: (locale: Locale) => void;
    onEditLocale: (locale: Locale) => void;
};
declare const LocaleTable: ({ locales, onDeleteLocale, onEditLocale, canDelete, canEdit, }: LocaleTableProps) => import("react/jsx-runtime").JSX.Element;
export { LocaleTable };
export type { LocaleTableProps };
