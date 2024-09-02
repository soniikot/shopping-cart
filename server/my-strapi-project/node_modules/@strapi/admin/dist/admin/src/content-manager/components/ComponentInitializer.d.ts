import * as React from 'react';
import { TranslationMessage } from '@strapi/helper-plugin';
interface ComponentInitializerProps {
    error?: TranslationMessage;
    isReadOnly?: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLDivElement>;
}
declare const ComponentInitializer: ({ error, isReadOnly, onClick }: ComponentInitializerProps) => import("react/jsx-runtime").JSX.Element;
export { ComponentInitializer };
export type { ComponentInitializerProps };
