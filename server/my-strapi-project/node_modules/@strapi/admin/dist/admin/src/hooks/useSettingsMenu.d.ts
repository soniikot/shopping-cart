import { StrapiAppSetting, StrapiAppSettingLink as IStrapiAppSettingLink } from '@strapi/helper-plugin';
import { SettingsMenuLink } from '../constants';
interface SettingsMenuLinkWithPermissions extends SettingsMenuLink {
    permissions: IStrapiAppSettingLink['permissions'];
    hasNotification?: boolean;
}
interface StrapiAppSettingsLink extends IStrapiAppSettingLink {
    lockIcon?: never;
    hasNotification?: never;
}
interface SettingsMenuSection extends Omit<StrapiAppSetting, 'links'> {
    links: Array<SettingsMenuLinkWithPermissions | StrapiAppSettingsLink>;
}
interface SettingsMenuLinkWithPermissionsAndDisplayed extends SettingsMenuLinkWithPermissions {
    isDisplayed: boolean;
}
interface StrapiAppSettingLinkWithDisplayed extends StrapiAppSettingsLink {
    isDisplayed: boolean;
}
interface SettingsMenuSectionWithDisplayedLinks extends Omit<SettingsMenuSection, 'links'> {
    links: Array<SettingsMenuLinkWithPermissionsAndDisplayed | StrapiAppSettingLinkWithDisplayed>;
}
type SettingsMenu = SettingsMenuSectionWithDisplayedLinks[];
declare const useSettingsMenu: () => {
    isLoading: boolean;
    menu: SettingsMenu;
};
export { useSettingsMenu };
export type { SettingsMenu };
