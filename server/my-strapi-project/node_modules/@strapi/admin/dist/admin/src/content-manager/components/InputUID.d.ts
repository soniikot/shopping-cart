import * as React from 'react';
import { TextInputProps } from '@strapi/design-system';
import { CMEditViewDataManagerContextValue, TranslationMessage } from '@strapi/helper-plugin';
interface InputUIDProps extends Pick<TextInputProps, 'disabled' | 'error' | 'hint' | 'labelAction' | 'required'>, Required<Pick<CMEditViewDataManagerContextValue, 'onChange'>> {
    contentTypeUID: string;
    intlLabel: TranslationMessage;
    name: string;
    placeholder?: TranslationMessage;
    value: string;
}
declare const InputUID: React.ForwardRefExoticComponent<InputUIDProps & React.RefAttributes<{
    inputWrapperRef: React.MutableRefObject<HTMLDivElement>;
    input: React.MutableRefObject<HTMLInputElement>;
}>>;
export { InputUID };
export type { InputUIDProps };
