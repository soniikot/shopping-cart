declare const useDefaultLocales: () => {
    defaultLocales: import("../../../shared/contracts/iso-locales").ISOLocale[] | undefined;
    isLoading: boolean;
};
export { useDefaultLocales };
