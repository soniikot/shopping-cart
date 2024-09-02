import type { Common } from '@strapi/types';
export type UploadFile = (uid: Common.UID.Schema, entity: Record<string, unknown>, files: Record<string, unknown>) => Promise<void>;
/**
 * Upload files and link them to an entity
 */
declare const uploadFile: UploadFile;
export default uploadFile;
//# sourceMappingURL=upload-files.d.ts.map