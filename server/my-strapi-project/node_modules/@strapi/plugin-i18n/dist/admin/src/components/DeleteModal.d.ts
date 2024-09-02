import { ConfirmDialogProps } from '@strapi/helper-plugin';
import { Locale } from '../store/reducers';
type DeleteModalProps = {
    localeToDelete: Locale;
    onClose: ConfirmDialogProps['onToggleDialog'];
};
declare const DeleteModal: ({ localeToDelete, onClose }: DeleteModalProps) => import("react/jsx-runtime").JSX.Element;
export { DeleteModal };
