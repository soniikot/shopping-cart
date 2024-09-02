import * as React from 'react';
import { AccordionVariant } from '@strapi/design-system';
import type { FormattedComponentLayout } from '../../utils/layouts';
import type { Attribute } from '@strapi/types';
interface ComponentCategoryProps {
    category: string;
    components?: Array<Pick<FormattedComponentLayout, 'info' | 'attributes'> & {
        componentUid: Attribute.DynamicZone['components'][number];
    }>;
    isOpen?: boolean;
    onAddComponent: (componentUid: string) => React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLDivElement>;
    onToggle: (category: string) => void;
    variant?: AccordionVariant;
}
declare const ComponentCategory: ({ category, components, variant, isOpen, onAddComponent, onToggle, }: ComponentCategoryProps) => import("react/jsx-runtime").JSX.Element;
export { ComponentCategory };
export type { ComponentCategoryProps };
