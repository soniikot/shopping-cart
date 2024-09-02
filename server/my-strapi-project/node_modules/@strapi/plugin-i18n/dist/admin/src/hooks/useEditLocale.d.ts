import { UpdateLocale } from '../../../shared/contracts/locales';
declare const useEditLocale: () => {
    isEditing: boolean;
    editLocale: (id: UpdateLocale.Request['params']['id'], payload: UpdateLocale.Request['body']) => Promise<void>;
};
export { useEditLocale };
