import * as React from 'react';
import { MessageDescriptor } from 'react-intl';
interface DynamicZoneLabelProps {
    label?: string;
    labelAction?: React.ReactNode;
    name: string;
    numberOfComponents?: number;
    required?: boolean;
    intlDescription?: MessageDescriptor;
}
declare const DynamicZoneLabel: ({ label, labelAction, name, numberOfComponents, required, intlDescription, }: DynamicZoneLabelProps) => import("react/jsx-runtime").JSX.Element;
export { DynamicZoneLabel };
export type { DynamicZoneLabelProps };
