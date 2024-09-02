import * as React from 'react';
import { TrackingEvent } from '@strapi/helper-plugin';
import type { EditViewPageParams } from '../pages/EditView/EditViewPage';
import type { EntityData } from '../sharedReducers/crud/reducer';
import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
interface RenderChildProps {
    componentsDataStructure: Record<string, any>;
    contentTypeDataStructure: Record<string, any>;
    data: EntityData | null;
    isCreatingEntry: boolean;
    isLoadingForData: boolean;
    onDelete: (trackerProperty: Extract<TrackingEvent, {
        name: 'willDeleteEntry' | 'didDeleteEntry' | 'didNotDeleteEntry';
    }>['properties']) => Promise<Contracts.SingleTypes.Delete.Response>;
    onPost: (body: Contracts.SingleTypes.CreateOrUpdate.Request['body'], trackerProperty: Extract<TrackingEvent, {
        name: 'willCreateEntry' | 'didCreateEntry' | 'didNotCreateEntry';
    }>['properties']) => Promise<Contracts.SingleTypes.CreateOrUpdate.Response>;
    onDraftRelationCheck: () => Promise<Contracts.SingleTypes.CountDraftRelations.Response['data']>;
    onPublish: () => Promise<Contracts.SingleTypes.Publish.Response>;
    onPut: (body: Contracts.SingleTypes.CreateOrUpdate.Request['body'], trackerProperty: Extract<TrackingEvent, {
        name: 'willEditEntry' | 'didEditEntry' | 'didNotEditEntry';
    }>['properties']) => Promise<Contracts.SingleTypes.CreateOrUpdate.Response>;
    onUnpublish: () => Promise<void>;
    redirectionLink: string;
    status: string;
}
interface ContentTypeFormWrapperProps extends EditViewPageParams {
    children: (props: RenderChildProps) => React.JSX.Element;
}
declare const ContentTypeFormWrapper: ({ children, slug, id, origin, collectionType, }: ContentTypeFormWrapperProps) => React.JSX.Element;
export { ContentTypeFormWrapper };
export type { ContentTypeFormWrapperProps, RenderChildProps };
