import { SettingPermission, PluginPermission } from '../../../../../../../shared/contracts/permissions';
import { PermissionsDataManagerContextValue } from '../hooks/usePermissionsDataManager';
import type { GenericLayout } from '../utils/layouts';
type Layout = GenericLayout<SettingPermission | PluginPermission>[];
interface PluginsAndSettingsPermissionsProps extends Pick<RowProps, 'kind' | 'isFormDisabled'> {
    layout: Layout;
}
declare const PluginsAndSettingsPermissions: ({ layout, ...restProps }: PluginsAndSettingsPermissionsProps) => import("react/jsx-runtime").JSX.Element;
interface RowProps extends Pick<Layout[number], 'childrenForm'> {
    kind: Exclude<keyof PermissionsDataManagerContextValue['modifiedData'], `${string}Types`>;
    name: string;
    isFormDisabled?: boolean;
    isOpen?: boolean;
    isWhite?: boolean;
    onOpenCategory: (categoryName: string) => void;
    pathToData: string[];
}
export { PluginsAndSettingsPermissions };
