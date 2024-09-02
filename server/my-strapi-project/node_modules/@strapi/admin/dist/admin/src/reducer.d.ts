import { PermissionMap } from './types/permissions';
type ThemeName = 'light' | 'dark' | 'system';
interface AppState {
    language: {
        locale: string;
        localeNames: Record<string, string>;
    };
    permissions: Partial<PermissionMap>;
    theme: {
        currentTheme: ThemeName;
        availableThemes: string[];
    };
}
declare const THEME_LOCAL_STORAGE_KEY = "STRAPI_THEME";
declare const LANGUAGE_LOCAL_STORAGE_KEY = "strapi-admin-language";
declare const reducer: import("redux").Reducer<AppState>;
declare const setAdminPermissions: import("@reduxjs/toolkit").ActionCreatorWithPayload<Partial<PermissionMap>, "admin/setAdminPermissions">, setAppTheme: import("@reduxjs/toolkit").ActionCreatorWithPayload<ThemeName, "admin/setAppTheme">, setAvailableThemes: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "admin/setAvailableThemes">, setLocale: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "admin/setLocale">;
export { reducer, setAdminPermissions, setAppTheme, setAvailableThemes, setLocale, THEME_LOCAL_STORAGE_KEY, LANGUAGE_LOCAL_STORAGE_KEY, };
export type { AppState, ThemeName };
