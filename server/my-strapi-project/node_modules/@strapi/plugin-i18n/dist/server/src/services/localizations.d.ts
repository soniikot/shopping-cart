declare const localizations: () => {
    assignDefaultLocaleToEntries: (data: any) => Promise<void>;
    syncLocalizations: (entry: any, { model }: any) => Promise<void>;
    syncNonLocalizedAttributes: (entry: any, { model }: any) => Promise<void>;
};
type LocalizationsService = typeof localizations;
export default localizations;
export type { LocalizationsService };
//# sourceMappingURL=localizations.d.ts.map