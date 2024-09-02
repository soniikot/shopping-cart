declare const iconByTypes: {
    biginteger: import("react/jsx-runtime").JSX.Element;
    boolean: import("react/jsx-runtime").JSX.Element;
    date: import("react/jsx-runtime").JSX.Element;
    datetime: import("react/jsx-runtime").JSX.Element;
    decimal: import("react/jsx-runtime").JSX.Element;
    email: import("react/jsx-runtime").JSX.Element;
    enum: import("react/jsx-runtime").JSX.Element;
    enumeration: import("react/jsx-runtime").JSX.Element;
    file: import("react/jsx-runtime").JSX.Element;
    files: import("react/jsx-runtime").JSX.Element;
    float: import("react/jsx-runtime").JSX.Element;
    integer: import("react/jsx-runtime").JSX.Element;
    media: import("react/jsx-runtime").JSX.Element;
    number: import("react/jsx-runtime").JSX.Element;
    relation: import("react/jsx-runtime").JSX.Element;
    string: import("react/jsx-runtime").JSX.Element;
    text: import("react/jsx-runtime").JSX.Element;
    richtext: import("react/jsx-runtime").JSX.Element;
    time: import("react/jsx-runtime").JSX.Element;
    timestamp: import("react/jsx-runtime").JSX.Element;
    json: import("react/jsx-runtime").JSX.Element;
    uid: import("react/jsx-runtime").JSX.Element;
    component: import("react/jsx-runtime").JSX.Element;
    dynamiczone: import("react/jsx-runtime").JSX.Element;
};
interface FieldTypeIconProps {
    type: keyof typeof iconByTypes;
    customFieldUid?: string;
}
declare const FieldTypeIcon: ({ type, customFieldUid }: FieldTypeIconProps) => import("react/jsx-runtime").JSX.Element | null;
export { FieldTypeIcon };
