import * as React from 'react';
import { IconByType } from '../AttributeIcon';
import type { CustomFieldUID } from '@strapi/helper-plugin';
export type CustomFieldOption = {
    name: string;
    type: IconByType;
    icon: React.ComponentType;
    intlLabel: {
        id: string;
        defaultMessage: string;
    };
    intlDescription: {
        id: string;
        defaultMessage: string;
    };
};
type CustomFieldOptionProps = {
    customFieldUid: CustomFieldUID;
    customField: CustomFieldOption;
};
export declare const CustomFieldOption: ({ customFieldUid, customField }: CustomFieldOptionProps) => import("react/jsx-runtime").JSX.Element;
export {};
