import { RelationData } from '../../EditViewDataManagerProvider/reducer';
export declare const diffRelations: (browserStateRelations?: RelationData[], serverStateRelations?: RelationData[]) => [connected: import("@strapi/types/dist/types/core/entity").ID[], disconnected: import("@strapi/types/dist/types/core/entity").ID[]];
