import type { CustomField } from '@strapi/helper-plugin';
export declare class CustomFields {
    customFields: Record<string, CustomField>;
    constructor();
    register(customFields: CustomField | CustomField[]): void;
    getAll(): Record<string, CustomField>;
    get(uid: string): CustomField | undefined;
}
