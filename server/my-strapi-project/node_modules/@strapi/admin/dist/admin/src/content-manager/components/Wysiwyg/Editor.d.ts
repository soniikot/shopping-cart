import * as React from 'react';
import { EditorFromTextArea } from 'codemirror5';
import 'codemirror5/addon/display/placeholder';
interface EditorApi {
    focus: () => void;
    scrollIntoView: (args?: Parameters<HTMLElement['scrollIntoView']>[0]) => void;
}
interface EditorProps {
    disabled?: boolean;
    editorRef: React.MutableRefObject<EditorFromTextArea>;
    error?: string;
    isPreviewMode?: boolean;
    isExpandMode?: boolean;
    name: string;
    onChange: (event: {
        target: {
            name: string;
            value: string;
            type: string;
        };
    }) => void;
    placeholder?: string;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    value?: string;
}
declare const Editor: React.ForwardRefExoticComponent<EditorProps & React.RefAttributes<EditorApi>>;
export { Editor };
export type { EditorProps, EditorApi };
