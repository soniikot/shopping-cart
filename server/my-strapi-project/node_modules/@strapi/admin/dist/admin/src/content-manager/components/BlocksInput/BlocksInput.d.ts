import * as React from 'react';
import { type MessageDescriptor } from 'react-intl';
import { HintProps } from '../Hint';
import { BlocksEditor } from './BlocksEditor';
interface BlocksInputProps extends Omit<React.ComponentPropsWithoutRef<typeof BlocksEditor>, 'placeholder'>, Pick<HintProps, 'hint'> {
    intlLabel: MessageDescriptor;
    attribute: {
        type: string;
        [key: string]: unknown;
    };
    placeholder?: MessageDescriptor;
    description?: MessageDescriptor;
    labelAction?: React.ReactNode;
    required?: boolean;
}
declare const BlocksInput: React.ForwardRefExoticComponent<BlocksInputProps & React.RefAttributes<{
    focus: () => void;
}>>;
export { BlocksInput };
