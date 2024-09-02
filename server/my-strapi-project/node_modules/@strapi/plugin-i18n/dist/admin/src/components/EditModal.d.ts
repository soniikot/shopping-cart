import { ModalLayoutProps } from '@strapi/design-system';
import { Locale } from '../store/reducers';
interface EditModalProps extends Pick<ModalLayoutProps, 'onClose'> {
    locale: Locale;
}
declare const EditModal: ({ locale, onClose }: EditModalProps) => import("react/jsx-runtime").JSX.Element;
export { EditModal };
