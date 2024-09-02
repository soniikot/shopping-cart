import { type AxiosResponse } from 'axios';
import type { CLIContext, CloudCliConfig, TrackPayload } from '../types';
export declare const VERSION = "v1";
export type ProjectInfos = {
    id: string;
    name: string;
    displayName?: string;
    nodeVersion?: string;
    region?: string;
    plan?: string;
    url?: string;
};
export type ProjectInput = Omit<ProjectInfos, 'id'>;
export type DeployResponse = {
    build_id: string;
    image: string;
};
export type ListProjectsResponse = {
    data: {
        data: string;
    };
};
export type ListLinkProjectsResponse = {
    data: {
        data: ProjectInfos[] | Record<string, never>;
    };
};
export type GetProjectResponse = {
    data: {
        updatedAt: string;
        suspendedAt?: string;
        isTrial: boolean;
    };
    metadata: {
        dashboardUrls: {
            project: string;
            deployments: string;
        };
    };
};
export interface CloudApiService {
    deploy(deployInput: {
        filePath: string;
        project: {
            name: string;
        };
    }, { onUploadProgress, }: {
        onUploadProgress: (progressEvent: {
            loaded: number;
            total?: number;
        }) => void;
    }): Promise<AxiosResponse<DeployResponse>>;
    createProject(createProjectInput: ProjectInput): Promise<{
        data: ProjectInput;
        status: number;
    }>;
    getUserInfo(): Promise<AxiosResponse>;
    config(): Promise<AxiosResponse<CloudCliConfig>>;
    listProjects(): Promise<AxiosResponse<ListProjectsResponse>>;
    listLinkProjects(): Promise<AxiosResponse<ListLinkProjectsResponse>>;
    getProject(project: {
        name: string;
    }): Promise<AxiosResponse<GetProjectResponse>>;
    track(event: string, payload?: TrackPayload): Promise<AxiosResponse<void>>;
}
export declare function cloudApiFactory({ logger }: {
    logger: CLIContext['logger'];
}, token?: string): Promise<CloudApiService>;
//# sourceMappingURL=cli-api.d.ts.map