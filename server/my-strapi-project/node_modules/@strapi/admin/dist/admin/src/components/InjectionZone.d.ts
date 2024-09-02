import * as React from 'react';
declare const INJECTION_ZONES: {
    admin: {
        tutorials: {
            links: never[];
        };
    };
    contentManager: {
        editView: {
            informations: never[];
            'right-links': never[];
        };
        listView: {
            actions: never[];
            deleteModalAdditionalInfos: never[];
            publishModalAdditionalInfos: never[];
            unpublishModalAdditionalInfos: never[];
        };
    };
};
interface InjectionZoneComponent {
    Component: React.ComponentType;
    name: string;
    slug: string;
}
interface InjectionZones {
    admin: {
        tutorials: {
            links: InjectionZoneComponent[];
        };
    };
    contentManager: {
        editView: {
            informations: InjectionZoneComponent[];
            'right-links': InjectionZoneComponent[];
        };
        listView: {
            actions: InjectionZoneComponent[];
            deleteModalAdditionalInfos: InjectionZoneComponent[];
            publishModalAdditionalInfos: InjectionZoneComponent[];
            unpublishModalAdditionalInfos: InjectionZoneComponent[];
        };
    };
}
type InjectionZoneArea = 'admin.tutorials.links' | 'contentManager.editView.informations' | 'contentManager.editView.right-links' | 'contentManager.listView.actions' | 'contentManager.listView.unpublishModalAdditionalInfos' | 'contentManager.listView.deleteModalAdditionalInfos' | 'contentManager.listView.publishModalAdditionalInfos' | 'contentManager.listView.deleteModalAdditionalInfos';
type InjectionZoneModule = InjectionZoneArea extends `${infer Word}.${string}` ? Word : never;
type InjectionZoneContainer = InjectionZoneArea extends `${string}.${infer Word}.${string}` ? Word : never;
type InjectionZoneBlock = InjectionZoneArea extends `${string}.${string}.${infer Word}` ? Word : never;
/**
 * You can't know what this component props will be because it's generic and used everywhere
 * e.g. content-manager edit view, we just send the slug but we might not in the listView,
 * therefore, people should type it themselves on the components they render.
 */
declare const InjectionZone: ({ area, ...props }: {
    [key: string]: unknown;
    area: InjectionZoneArea;
}) => import("react/jsx-runtime").JSX.Element;
export { InjectionZone, INJECTION_ZONES };
export type { InjectionZoneArea, InjectionZoneComponent, InjectionZones, InjectionZoneModule, InjectionZoneContainer, InjectionZoneBlock, };
