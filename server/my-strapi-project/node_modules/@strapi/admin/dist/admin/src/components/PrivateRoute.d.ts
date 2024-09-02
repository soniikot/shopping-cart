import * as React from 'react';
import { RouteProps } from 'react-router-dom';
interface PrivateRouteProps extends Omit<RouteProps, 'render' | 'component'> {
    children: React.ReactNode;
}
declare const PrivateRoute: ({ children, ...rest }: PrivateRouteProps) => import("react/jsx-runtime").JSX.Element;
export { PrivateRoute };
