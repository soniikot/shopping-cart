import { Locale, RootState } from '../store/reducers';
interface PotentialQueryWithLocale {
    plugins?: {
        i18n?: {
            locale?: string;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
}
/**
 * Returns the locale from the passed query.
 * If a default value is passed, it will return it if the locale does not exist.
 */
declare function getLocaleFromQuery(query: PotentialQueryWithLocale): string | undefined;
declare function getLocaleFromQuery(query: PotentialQueryWithLocale, defaultValue: string): string;
/**
 * Returns the initial locale from the query falling back to the default locale
 * listed in the collection of locales provided.
 */
declare const getInitialLocale: (query: PotentialQueryWithLocale, locales?: Locale[]) => Locale | undefined;
declare const getDefaultLocale: (ctPermissions: RootState['rbacProvider']['collectionTypesRelatedPermissions'][string], locales?: Locale[]) => string | null;
export { getLocaleFromQuery, getInitialLocale, getDefaultLocale };
