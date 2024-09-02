import { CreateLocale } from '../../../shared/contracts/locales';
declare const useAddLocale: () => {
    isAdding: boolean;
    addLocale: (locale: CreateLocale.Request['body']) => Promise<void>;
};
export { useAddLocale };
