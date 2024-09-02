/**
 * Returns whether the data transfer features have been disabled from the env configuration
 */
declare const isDisabledFromEnv: () => boolean;
/**
 * A valid transfer token salt must be a non-empty string defined in the Strapi config
 */
declare const hasValidTokenSalt: () => boolean;
/**
 * Checks whether data transfer features are enabled
 */
declare const isDataTransferEnabled: () => boolean;
export { isDataTransferEnabled, isDisabledFromEnv, hasValidTokenSalt };
//# sourceMappingURL=utils.d.ts.map