interface ComponentCardProps {
    component: string;
    dzName: string;
    index: number;
    isActive?: boolean;
    isInDevelopmentMode?: boolean;
    onClick?: () => void;
}
export declare const ComponentCard: ({ component, dzName, index, isActive, isInDevelopmentMode, onClick, }: ComponentCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
