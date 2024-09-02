type SelectComponentsProps = {
    dynamicZoneTarget: string;
    intlLabel: {
        id: string;
        defaultMessage: string;
        values?: object;
    };
    name: string;
    onChange: (value: {
        target: {
            name: string;
            value: string[];
            type?: string;
        };
    }) => void;
    value: string[];
};
export declare const SelectComponents: ({ dynamicZoneTarget, intlLabel, name, onChange, value, }: SelectComponentsProps) => import("react/jsx-runtime").JSX.Element;
export {};
