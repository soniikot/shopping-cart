interface SelectCategoryProps {
    error?: string | null;
    intlLabel: {
        id: string;
        defaultMessage: string;
        values?: Record<string, any>;
    };
    name: string;
    onChange: (value: {
        target: {
            name: string;
            value: any;
            type: string;
        };
    }) => void;
    value?: string;
}
export declare const SelectCategory: ({ error, intlLabel, name, onChange, value, }: SelectCategoryProps) => import("react/jsx-runtime").JSX.Element;
export {};
