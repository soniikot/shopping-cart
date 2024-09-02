import { Schema } from '@strapi/types';
declare const _default: () => {
    toContentManagerModel(contentType: Schema.Component): {
        apiID: string;
        isDisplayed: boolean;
        attributes: any;
        modelType: "component";
        uid: `${string}.${string}`;
        category: string;
        modelName: string;
        globalId: string;
        pluginOptions?: Schema.PluginOptions | undefined;
        options?: Schema.Options | undefined;
        collectionName?: string | undefined;
        info: Schema.Info;
    };
    toDto: import("lodash/fp").LodashPick2x1;
};
export default _default;
//# sourceMappingURL=data-mapper.d.ts.map