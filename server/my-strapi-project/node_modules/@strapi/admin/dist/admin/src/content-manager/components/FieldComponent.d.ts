import * as React from 'react';
import { TranslationMessage } from '@strapi/helper-plugin';
interface FieldComponentProps {
    componentUid: string;
    intlLabel?: TranslationMessage;
    isFromDynamicZone?: boolean;
    isRepeatable?: boolean;
    isNested?: boolean;
    labelAction?: React.ReactNode;
    max?: number;
    min?: number;
    name: string;
    required?: boolean;
}
declare const FieldComponent: ({ componentUid, intlLabel, isFromDynamicZone, isRepeatable, isNested, labelAction, max, min, name, required, }: FieldComponentProps) => import("react/jsx-runtime").JSX.Element;
export { FieldComponent };
