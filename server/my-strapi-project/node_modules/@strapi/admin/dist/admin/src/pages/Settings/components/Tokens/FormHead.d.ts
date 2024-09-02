import { MessageDescriptor } from 'react-intl';
import type { Entity } from '@strapi/types';
interface Token {
    id: Entity.ID;
    name: string;
}
interface FormHeadProps<TToken extends Token | null> {
    title: MessageDescriptor;
    token: TToken;
    canEditInputs: boolean;
    canRegenerate: boolean;
    setToken: (token: TToken) => void;
    isSubmitting: boolean;
    backUrl: string;
    regenerateUrl: string;
}
export declare const FormHead: <TToken extends Token | null>({ title, token, setToken, canEditInputs, canRegenerate, isSubmitting, backUrl, regenerateUrl, }: FormHeadProps<TToken>) => import("react/jsx-runtime").JSX.Element;
export {};
