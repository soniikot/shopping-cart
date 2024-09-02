interface DialogConfirmDeleteProps {
    isConfirmButtonLoading?: boolean;
    isOpen?: boolean;
    onConfirm: () => void;
    onToggleDialog: () => void;
}
declare const DialogConfirmDelete: ({ isConfirmButtonLoading, isOpen, onToggleDialog, onConfirm, }: DialogConfirmDeleteProps) => import("react/jsx-runtime").JSX.Element;
export { DialogConfirmDelete };
export type { DialogConfirmDeleteProps };
