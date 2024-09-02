import * as React from 'react';
type FormModalNavigationProviderProps = {
    children: React.ReactNode;
};
export type State = any;
export type ModalEventProps = {
    attributeType?: string;
    customFieldUid?: string;
    dynamicZoneTarget?: string;
    forTarget?: string;
    targetUid?: string;
    attributeName?: string;
    step?: string | null;
    kind?: string;
    categoryName?: string;
    modalType?: string;
    actionType?: string;
    isOpen?: boolean;
    showBackLink?: boolean;
};
export declare const FormModalNavigationProvider: ({ children }: FormModalNavigationProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
