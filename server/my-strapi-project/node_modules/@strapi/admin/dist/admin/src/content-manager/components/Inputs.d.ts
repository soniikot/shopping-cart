import * as React from 'react';
import { LazyComponentStore } from '../hooks/useLazyComponents';
import { EditLayoutRow } from '../utils/layouts';
interface InputProps extends Pick<EditLayoutRow, 'fieldSchema' | 'metadatas' | 'queryInfos' | 'size'> {
    componentUid?: string;
    keys: string;
    labelAction?: React.ReactNode;
    customFieldInputs: LazyComponentStore;
}
declare const Inputs: ({ componentUid, fieldSchema, keys, labelAction, metadatas, queryInfos, size, customFieldInputs, }: InputProps) => import("react/jsx-runtime").JSX.Element | null;
export { Inputs };
