import { Schema, Entity as StrapiEntity, Attribute } from '@strapi/types';
export interface Entity {
    id: StrapiEntity.ID;
    createdAt: string;
    updatedAt: string;
}
interface ValidateOptions {
    contentType: Schema.ContentType;
    components: {
        [key: Schema.Component['uid']]: Schema.Component;
    };
    isCreatingEntry?: boolean;
}
/**
 * @alpha - This hook is not stable and likely to change. Use at your own risk.
 */
export declare function useDocument(): {
    validate: (entry: Entity & {
        [key: string]: Attribute.Any;
    }, { contentType, components, isCreatingEntry }: ValidateOptions) => {
        errors: Record<string, import("@strapi/helper-plugin").TranslationMessage>;
    };
};
export {};
