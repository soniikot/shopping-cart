import { Menu } from '../hooks/useMenu';
interface LeftMenuProps extends Pick<Menu, 'generalSectionLinks' | 'pluginsSectionLinks'> {
}
declare const LeftMenu: ({ generalSectionLinks, pluginsSectionLinks }: LeftMenuProps) => import("react/jsx-runtime").JSX.Element;
export { LeftMenu };
