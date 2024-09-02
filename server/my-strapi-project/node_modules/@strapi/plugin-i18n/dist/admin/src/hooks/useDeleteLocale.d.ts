import { DeleteLocale } from '../../../shared/contracts/locales';
declare const useDeleteLocale: () => {
    isDeleting: boolean;
    deleteLocale: (id: DeleteLocale.Request['params']['id']) => Promise<void>;
};
export { useDeleteLocale };
