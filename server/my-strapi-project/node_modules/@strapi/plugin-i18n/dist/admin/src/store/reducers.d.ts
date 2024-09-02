import { ADD_LOCALE, DELETE_LOCALE, RESOLVE_LOCALES, UPDATE_LOCALE } from './constants';
import type { Locale } from '../../../shared/contracts/locales';
import type { Store } from '@strapi/strapi/admin';
export interface LocalesState {
    isLoading: boolean;
    locales: Locale[];
}
export declare const initialState: {
    isLoading: boolean;
    locales: never[];
};
interface ResolveLocalesAction extends Pick<LocalesState, 'locales'> {
    type: typeof RESOLVE_LOCALES;
}
interface AddLocaleAction {
    type: typeof ADD_LOCALE;
    newLocale: LocalesState['locales'][number];
}
interface DeleteLocaleAction {
    type: typeof DELETE_LOCALE;
    id: LocalesState['locales'][number]['id'];
}
interface UpdateLocaleAction {
    type: typeof UPDATE_LOCALE;
    editedLocale: LocalesState['locales'][number];
}
type Action = ResolveLocalesAction | AddLocaleAction | DeleteLocaleAction | UpdateLocaleAction;
declare const reducers: {
    i18n_locales: (base: {
        readonly isLoading: boolean;
        readonly locales: readonly {
            readonly code: string;
            readonly isDefault: boolean;
            readonly name: string;
            readonly id: import("@strapi/types/dist/types/core/entity").ID;
            readonly createdAt: string;
            readonly updatedAt: string;
        }[];
    } | undefined, action: Action) => LocalesState | undefined;
};
type RootState = ReturnType<Store['getState']> & {
    i18n_locales: LocalesState;
};
export { reducers };
export type { RootState, Locale, Action };
