import { MessageDescriptor } from 'react-intl';
import { RelationInputProps } from './RelationInput';
declare const PUBLICATION_STATES: {
    readonly DRAFT: "draft";
    readonly PUBLISHED: "published";
};
interface RelationInputDataManagerProps extends Pick<RelationInputProps, 'description' | 'error' | 'labelAction' | 'name' | 'required' | 'size'> {
    componentUid?: string;
    editable?: boolean;
    intlLabel: MessageDescriptor;
    isUserAllowedToEditField?: boolean;
    isUserAllowedToReadField?: boolean;
    mainField: {
        name: string;
    };
    placeholder?: MessageDescriptor;
    queryInfos: {
        defaultParams?: object;
        shouldDisplayRelationLink?: boolean;
    };
    relationType: string;
    targetModel: string;
}
declare const RelationInputDataManager: ({ componentUid, name, error, editable, description, intlLabel, isUserAllowedToEditField, isUserAllowedToReadField, labelAction, mainField, placeholder, queryInfos: { defaultParams, shouldDisplayRelationLink }, required, relationType, size, targetModel, }: RelationInputDataManagerProps) => import("react/jsx-runtime").JSX.Element;
export { RelationInputDataManager, PUBLICATION_STATES };
export type { RelationInputDataManagerProps };
