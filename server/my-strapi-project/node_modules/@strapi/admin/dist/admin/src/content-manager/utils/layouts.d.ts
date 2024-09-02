import { ModifiedLayoutData } from './schemas';
import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import type { Attribute, Schema } from '@strapi/types';
type LayoutData = Contracts.ContentTypes.FindContentTypeConfiguration.Response['data'];
type Models = Array<Contracts.Components.Component | Contracts.ContentTypes.ContentType>;
type FormattedContentTypeLayout = Omit<SchemasWithMeta['contentType'], 'layouts'> & {
    layouts: {
        edit: EditLayoutRow[][];
        list: ListLayoutRow[];
    };
};
type FormattedComponentLayout = Omit<SchemasWithMeta['components'][string], 'layouts'> & {
    layouts: {
        list: string[];
        edit: EditLayoutRow[][];
    };
};
interface FormattedLayouts {
    contentType: FormattedContentTypeLayout;
    components: Record<string, FormattedComponentLayout>;
}
declare const formatLayouts: (initialData: LayoutData, models: Models) => FormattedLayouts;
type MainField = Attribute.Any & {
    name: string;
};
interface Metadata {
    edit: Contracts.ContentTypes.Metadatas[string]['edit'] & {
        mainField?: MainField;
    };
    list: Contracts.ContentTypes.Metadatas[string]['list'] & {
        mainField?: MainField;
    };
}
interface SchemasWithMeta {
    contentType: Omit<ModifiedLayoutData<'contentType'>['contentType'], 'metadatas'> & {
        metadatas: Record<string, Metadata>;
    };
    components: Record<string, Omit<ModifiedLayoutData<'contentType'>['components'][string], 'metadatas'> & {
        metadatas: Record<string, Metadata>;
    }>;
}
interface EditLayoutRow {
    name: string;
    size: number;
    fieldSchema: Attribute.Any & {
        /**
         * This type is not part of the strapi types, because it doesn't exist
         * on the schema, it's added by the server code.
         */
        customField?: string;
    };
    metadatas: Metadata['edit'];
    targetModelPluginOptions?: Schema.ContentType['pluginOptions'];
    queryInfos?: {
        defaultParams?: object;
        shouldDisplayRelationLink?: boolean;
    };
}
interface ListLayoutRow {
    key: string;
    name: string;
    fieldSchema: Attribute.Any | {
        type: 'custom';
    };
    metadatas: Metadata['list'];
}
interface MetadataWithStringMainField {
    edit: Omit<Metadata['edit'], 'mainField'> & {
        mainField?: string;
    };
    list: Omit<Metadata['list'], 'mainField'>;
}
type ReturnLayout<TLayout> = TLayout extends FormattedContentTypeLayout ? SettingsViewContentTypeLayout : SettingsViewComponentLayout;
declare const formatLayoutForSettingsView: <TLayout extends FormattedComponentLayout | FormattedContentTypeLayout>({ layouts, metadatas, ...rest }: TLayout) => ReturnLayout<TLayout>;
interface SettingsViewContentTypeLayout extends Omit<FormattedContentTypeLayout, 'metadatas' | 'layouts'> {
    layouts: {
        edit: Array<Array<{
            name: string;
            size: number;
        }>>;
        list: Array<string>;
    };
    metadatas: Record<string, MetadataWithStringMainField>;
}
interface SettingsViewComponentLayout extends Omit<FormattedComponentLayout, 'metadatas' | 'layouts'> {
    layouts: {
        edit: Array<Array<{
            name: string;
            size: number;
        }>>;
        list: Array<string>;
    };
    metadatas: Record<string, MetadataWithStringMainField>;
}
export { formatLayouts, formatLayoutForSettingsView };
export type { FormattedLayouts, FormattedContentTypeLayout, FormattedComponentLayout, ListLayoutRow, EditLayoutRow, Metadata, SettingsViewContentTypeLayout, SettingsViewComponentLayout, MainField, };
