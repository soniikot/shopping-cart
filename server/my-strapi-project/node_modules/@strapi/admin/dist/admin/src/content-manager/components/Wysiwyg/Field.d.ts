import * as React from 'react';
import { TranslationMessage } from '@strapi/helper-plugin';
import { HintProps } from '../Hint';
import { EditorApi, EditorProps } from './Editor';
import { EditorLayoutProps } from './EditorLayout';
interface WysiwygProps extends Pick<EditorProps, 'disabled' | 'name' | 'onChange' | 'value'>, Pick<EditorLayoutProps, 'error'>, Pick<HintProps, 'hint'> {
    intlLabel: TranslationMessage;
    labelAction?: React.ReactNode;
    placeholder?: TranslationMessage;
    required?: boolean;
}
declare const Wysiwyg: React.ForwardRefExoticComponent<WysiwygProps & React.RefAttributes<EditorApi>>;
export { Wysiwyg };
export type { WysiwygProps };
