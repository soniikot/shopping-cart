/// <reference types="react" />
interface LinkToCMSettingsViewProps {
    disabled: boolean;
    contentTypeKind?: string;
    isInContentTypeView?: boolean;
    isTemporary?: boolean;
    targetUid?: string;
}
export declare const LinkToCMSettingsView: import("react").MemoExoticComponent<({ disabled, isTemporary, isInContentTypeView, contentTypeKind, targetUid, }: LinkToCMSettingsViewProps) => import("react/jsx-runtime").JSX.Element>;
export {};
