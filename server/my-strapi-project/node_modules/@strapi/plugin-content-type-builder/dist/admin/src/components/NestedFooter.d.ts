import type { ReactNode } from 'react';
interface NestedTFooterProps {
    color: string;
    children: ReactNode;
    icon: ReactNode;
    onClick?: () => void;
}
export declare const NestedTFooter: ({ children, icon, color, ...props }: NestedTFooterProps) => import("react/jsx-runtime").JSX.Element;
export {};
