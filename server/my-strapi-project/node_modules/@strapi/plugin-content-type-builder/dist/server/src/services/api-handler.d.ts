import type { UID } from '@strapi/types';
/**
 * Deletes the API folder of a contentType
 */
export declare function clear(uid: UID.ContentType): Promise<void>;
/**
 * Backups the API folder of a contentType
 * @param {string} uid content type uid
 */
export declare function backup(uid: UID.ContentType): Promise<void>;
/**
 * Rollbacks the API folder of a contentType
 */
export declare function rollback(uid: UID.ContentType): Promise<void>;
//# sourceMappingURL=api-handler.d.ts.map