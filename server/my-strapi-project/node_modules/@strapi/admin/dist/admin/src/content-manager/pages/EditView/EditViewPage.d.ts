import { Permission, AllowedActions } from '@strapi/helper-plugin';
import { RouteComponentProps } from 'react-router-dom';
interface EditViewPageParams {
    collectionType: string;
    slug: string;
    id?: string;
    origin?: string;
}
interface EditViewPageProps extends RouteComponentProps<EditViewPageParams> {
    allowedActions: AllowedActions;
    userPermissions?: Permission[];
}
declare const EditViewPage: ({ allowedActions, history: { goBack }, match: { params: { slug, collectionType, id, origin }, }, userPermissions, }: EditViewPageProps) => import("react/jsx-runtime").JSX.Element | null;
interface ProtectedEditViewPageProps extends Omit<EditViewPageProps, 'allowedActions'> {
}
declare const ProtectedEditViewPage: ({ userPermissions, ...restProps }: ProtectedEditViewPageProps) => import("react/jsx-runtime").JSX.Element;
export { EditViewPage, ProtectedEditViewPage };
export type { EditViewPageProps, EditViewPageParams, ProtectedEditViewPageProps };
