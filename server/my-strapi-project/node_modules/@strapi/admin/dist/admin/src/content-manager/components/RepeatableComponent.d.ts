interface RepeatableComponentProps {
    componentUid: string;
    componentValue?: Array<{
        __temp_key__: number;
    }>;
    componentValueLength?: number;
    isReadOnly?: boolean;
    max?: number;
    min?: number;
    name: string;
}
declare const RepeatableComponent: ({ componentUid, componentValue, componentValueLength, isReadOnly, max, min, name, }: RepeatableComponentProps) => import("react/jsx-runtime").JSX.Element;
export { RepeatableComponent };
export type { RepeatableComponentProps };
