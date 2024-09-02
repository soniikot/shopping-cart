interface RelationFormBoxProps {
    disabled?: boolean;
    error?: Record<string, any>;
    header?: string;
    isMain?: boolean;
    name: string;
    onChange: (value: any) => void;
    oneThatIsCreatingARelationWithAnother?: string;
    target?: string;
    value?: string;
}
export declare const RelationFormBox: ({ disabled, error, header, isMain, name, onChange, oneThatIsCreatingARelationWithAnother, target, value, }: RelationFormBoxProps) => import("react/jsx-runtime").JSX.Element;
export {};
