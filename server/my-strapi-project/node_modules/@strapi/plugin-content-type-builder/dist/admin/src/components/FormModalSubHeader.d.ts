import type { SchemaType } from '../types';
import type { CustomField } from '@strapi/helper-plugin';
type ModalTitleProps = {
    forTarget?: SchemaType;
    step?: string;
    kind?: string;
    modalType?: string;
    actionType?: string;
};
export declare const getModalTitleSubHeader: ({ modalType, forTarget, kind, actionType, step, }: ModalTitleProps) => string;
type FormModalSubHeaderProps = {
    actionType: string;
    modalType: string;
    forTarget: SchemaType;
    kind?: string;
    step?: string;
    attributeType: string;
    attributeName: string;
    customField?: CustomField;
};
export declare const FormModalSubHeader: ({ actionType, modalType, forTarget, kind, step, attributeType, attributeName, customField, }: FormModalSubHeaderProps) => import("react/jsx-runtime").JSX.Element;
export {};
