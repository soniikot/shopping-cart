import { AllowedActions } from '@strapi/helper-plugin';
interface HeaderProps {
    allowedActions: AllowedActions;
}
declare const Header: ({ allowedActions: { canUpdate, canCreate, canPublish } }: HeaderProps) => import("react/jsx-runtime").JSX.Element;
export { Header };
export type { HeaderProps };
