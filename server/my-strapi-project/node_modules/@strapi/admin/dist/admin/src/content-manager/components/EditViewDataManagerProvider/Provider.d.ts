import * as React from 'react';
import { AllowedActions } from '@strapi/helper-plugin';
import { RenderChildProps } from '../ContentTypeFormWrapper';
import type { EntityData } from '../../sharedReducers/crud/reducer';
interface EditViewDataManagerProviderProps extends Pick<RenderChildProps, 'componentsDataStructure' | 'contentTypeDataStructure' | 'isCreatingEntry' | 'isLoadingForData' | 'onDraftRelationCheck' | 'onPost' | 'onPublish' | 'onPut' | 'onUnpublish' | 'status'> {
    allowedActions: AllowedActions;
    createActionAllowedFields: string[];
    children: React.ReactNode;
    from: RenderChildProps['redirectionLink'];
    initialValues: EntityData | null;
    isSingleType: boolean;
    readActionAllowedFields: string[];
    redirectToPreviousPage: () => void;
    slug: string;
    updateActionAllowedFields: string[];
}
declare const EditViewDataManagerProvider: ({ allowedActions: { canRead, canUpdate }, children, componentsDataStructure, contentTypeDataStructure, createActionAllowedFields, from, initialValues, isCreatingEntry, isLoadingForData, isSingleType, onPost, onPublish, onDraftRelationCheck, onPut, onUnpublish, readActionAllowedFields, redirectToPreviousPage, slug, status, updateActionAllowedFields, }: EditViewDataManagerProviderProps) => import("react/jsx-runtime").JSX.Element | null;
export { EditViewDataManagerProvider };
