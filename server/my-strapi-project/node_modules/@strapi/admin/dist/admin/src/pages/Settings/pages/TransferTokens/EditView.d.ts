declare const EditView: () => import("react/jsx-runtime").JSX.Element;
declare const ProtectedEditView: () => import("react/jsx-runtime").JSX.Element;
interface LoadingViewProps {
    transferTokenName?: string;
}
export declare const LoadingView: ({ transferTokenName }: LoadingViewProps) => import("react/jsx-runtime").JSX.Element;
export { EditView, ProtectedEditView };
