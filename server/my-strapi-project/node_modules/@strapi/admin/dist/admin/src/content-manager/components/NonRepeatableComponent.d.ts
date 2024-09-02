interface NonRepeatableComponentProps {
    componentUid: string;
    isFromDynamicZone?: boolean;
    isNested?: boolean;
    name: string;
}
declare const NonRepeatableComponent: ({ componentUid, isFromDynamicZone, isNested, name, }: NonRepeatableComponentProps) => import("react/jsx-runtime").JSX.Element;
export { NonRepeatableComponent };
export type { NonRepeatableComponentProps };
