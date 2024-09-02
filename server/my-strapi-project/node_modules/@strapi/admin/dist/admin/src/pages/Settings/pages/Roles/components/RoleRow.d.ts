import { IconButtonProps } from '@strapi/design-system';
import type { AdminRole } from '../../../../../hooks/useAdminRoles';
interface RoleRowProps extends Pick<AdminRole, 'id' | 'name' | 'description' | 'usersCount'> {
    icons: Array<Required<Pick<IconButtonProps, 'icon' | 'label' | 'onClick'>>>;
    rowIndex: number;
    canUpdate?: boolean;
}
declare const RoleRow: ({ id, name, description, usersCount, icons, rowIndex, canUpdate, }: RoleRowProps) => import("react/jsx-runtime").JSX.Element;
export { RoleRow };
export type { RoleRowProps };
