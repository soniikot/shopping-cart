import * as React from 'react';
declare function createContext<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType): readonly [{
    (props: ContextValueType & {
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string) => NonNullable<ContextValueType>];
export { createContext };
