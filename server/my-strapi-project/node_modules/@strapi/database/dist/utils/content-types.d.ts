import type { Model } from '../types';
export interface Attribute {
    type: string;
    multiple?: boolean;
}
export interface ContentType {
    uid: string;
    modelName: string;
    collectionName: string;
    attributes: Record<string, Attribute>;
}
export declare const transformContentTypes: (contentTypes: ContentType[]) => Model[];
//# sourceMappingURL=content-types.d.ts.map