interface HintProps {
    id?: string;
    error?: string;
    name: string;
    hint?: string;
}
declare const Hint: ({ id, error, name, hint }: HintProps) => import("react/jsx-runtime").JSX.Element | null;
export { Hint };
export type { HintProps };
