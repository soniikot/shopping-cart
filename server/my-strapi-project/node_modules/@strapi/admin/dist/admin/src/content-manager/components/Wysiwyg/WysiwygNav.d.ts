import * as React from 'react';
import { EditorFromTextArea } from 'codemirror5';
interface WysiwygNavProps {
    disabled?: boolean;
    editorRef: React.MutableRefObject<EditorFromTextArea>;
    isExpandMode?: boolean;
    isPreviewMode?: boolean;
    onActionClick: (action: string, editorRef: React.MutableRefObject<EditorFromTextArea>, callback?: () => void) => void;
    onToggleMediaLib: () => void;
    onTogglePreviewMode?: () => void;
}
/**
 * TODO: refactor this mess.
 */
declare const WysiwygNav: ({ disabled, editorRef, isExpandMode, isPreviewMode, onActionClick, onToggleMediaLib, onTogglePreviewMode, }: WysiwygNavProps) => import("react/jsx-runtime").JSX.Element;
export { WysiwygNav };
export type { WysiwygNavProps };
