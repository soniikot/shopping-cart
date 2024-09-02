import React, { PropsWithChildren } from 'react';
declare const DragLayerRendered: () => import("react/jsx-runtime").JSX.Element;
declare const Root: React.FC<PropsWithChildren>;
type BackProps = {
    href: string;
};
declare const Back: React.FC<BackProps>;
type HeaderProps = {
    title: string;
    navigationAction?: React.ReactNode;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    subtitle?: React.ReactNode;
};
declare const Header: React.FC<HeaderProps>;
export { Back, DragLayerRendered, Header, Root };
