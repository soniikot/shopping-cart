import { MenuItem } from '@strapi/helper-plugin';
interface LazyCompoProps {
    loadComponent: Required<MenuItem>['Component'];
}
export declare const createRoute: (loadComponent: LazyCompoProps['loadComponent'], to: MenuItem['to'], exact?: MenuItem['exact']) => import("react/jsx-runtime").JSX.Element;
export {};
