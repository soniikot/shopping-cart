import type { ProjectInfos } from './cli-api';
export declare const LOCAL_SAVE_FILENAME = ".strapi-cloud.json";
export type LocalSave = {
    project?: Omit<ProjectInfos, 'id'>;
};
export declare function save(data: LocalSave, { directoryPath }?: {
    directoryPath?: string;
}): Promise<void>;
export declare function retrieve({ directoryPath, }?: {
    directoryPath?: string;
}): Promise<LocalSave>;
//# sourceMappingURL=strapi-info-save.d.ts.map