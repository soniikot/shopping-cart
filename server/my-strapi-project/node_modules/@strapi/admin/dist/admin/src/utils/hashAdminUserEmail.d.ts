import { SanitizedAdminUser } from '../../../shared/contracts/shared';
export declare const utils: {
    bufferToHex(buffer: ArrayBuffer): string;
    digestMessage(message: string): Promise<string>;
};
export declare function hashAdminUserEmail(payload?: SanitizedAdminUser): Promise<string | null>;
