import type { AdminUser } from '../../../shared/contracts/shared';
export type TokenOptions = {
    expiresIn?: string;
    [key: string]: unknown;
};
export type TokenPayload = {
    id: AdminUser['id'];
};
export type AdminAuthConfig = {
    secret: string;
    options: TokenOptions;
};
declare const getTokenOptions: () => {
    secret: string;
    options: {
        expiresIn: string;
    } & TokenOptions;
};
/**
 * Create a random token
 */
declare const createToken: () => string;
/**
 * Creates a JWT token for an administration user
 * @param user - admin user
 */
declare const createJwtToken: (user: {
    id: AdminUser['id'];
}) => string;
/**
 * Tries to decode a token an return its payload and if it is valid
 * @param token - a token to decode
 * @return decodeInfo - the decoded info
 */
declare const decodeJwtToken: (token: string) => {
    payload: TokenPayload;
    isValid: true;
} | {
    payload: null;
    isValid: false;
};
declare const checkSecretIsDefined: () => void;
export { createToken, createJwtToken, getTokenOptions, decodeJwtToken, checkSecretIsDefined };
//# sourceMappingURL=token.d.ts.map