import * as React from 'react';
import { FieldInputProps } from 'formik';
import { MessageDescriptor } from 'react-intl';
interface EventsRootProps {
    children: React.ReactNode;
}
interface EventsHeadersProps {
    getHeaders?: typeof getCEHeaders;
}
declare const getCEHeaders: (isDraftAndPublish: boolean) => MessageDescriptor[];
interface FormikContextValue {
    events: string[];
}
interface EventsBodyProps {
    providedEvents?: Record<string, FormikContextValue['events']>;
}
interface EventsRowProps {
    disabledEvents?: string[];
    events?: string[];
    inputValue?: string[];
    handleSelect: FieldInputProps<string>['onChange'];
    handleSelectAll: FieldInputProps<string>['onChange'];
    name: string;
}
declare const Events: {
    Root: ({ children }: EventsRootProps) => import("react/jsx-runtime").JSX.Element;
    Headers: ({ getHeaders }: EventsHeadersProps) => import("react/jsx-runtime").JSX.Element;
    Body: ({ providedEvents }: EventsBodyProps) => import("react/jsx-runtime").JSX.Element;
    Row: ({ disabledEvents, name, events, inputValue, handleSelect, handleSelectAll, }: EventsRowProps) => import("react/jsx-runtime").JSX.Element;
};
export { Events };
export type { EventsRowProps, EventsHeadersProps, EventsRootProps, EventsBodyProps };
