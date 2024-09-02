import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import { FormattedLayouts, ListLayoutRow } from '../utils/layouts';
import { ProtectedListViewPageProps } from './ListView/ListViewPage';
interface ListViewLayoutManagerProps extends ProtectedListViewPageProps {
}
declare const ListViewLayoutManager: ({ layout, ...props }: ListViewLayoutManagerProps) => import("react/jsx-runtime").JSX.Element | null;
declare const GET_DATA = "ContentManager/ListView/GET_DATA";
declare const GET_DATA_SUCCEEDED = "ContentManager/ListView/GET_DATA_SUCCEEDED";
declare const RESET_PROPS = "ContentManager/ListView/RESET_PROPS";
declare const ON_CHANGE_LIST_HEADERS = "ContentManager/ListView/ON_CHANGE_LIST_HEADERS ";
declare const ON_RESET_LIST_HEADERS = "ContentManager/ListView/ON_RESET_LIST_HEADERS ";
declare const SET_LIST_LAYOUT = "ContentManager/ListView/SET_LIST_LAYOUT ";
interface ListViewLayoutManagerState {
    contentType: FormattedLayouts['contentType'] | null;
    components: FormattedLayouts['components'];
    data: Contracts.CollectionTypes.Find.Response['results'];
    displayedHeaders: ListLayoutRow[];
    initialDisplayedHeaders: ListLayoutRow[];
    isLoading: boolean;
    pagination: Contracts.CollectionTypes.Find.Response['pagination'];
}
interface GetDataAction {
    type: typeof GET_DATA;
}
declare const getData: () => {
    type: "ContentManager/ListView/GET_DATA";
};
interface GetDataSucceededAction extends Pick<ListViewLayoutManagerState, 'data' | 'pagination'> {
    type: typeof GET_DATA_SUCCEEDED;
}
declare const getDataSucceeded: (pagination: GetDataSucceededAction['pagination'], data: GetDataSucceededAction['data']) => {
    type: "ContentManager/ListView/GET_DATA_SUCCEEDED";
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
    data: ({
        id: import("@strapi/types/dist/types/core/entity").ID;
    } & {
        [key: string]: any;
    })[];
};
interface onResetListHeadersAction {
    type: typeof ON_RESET_LIST_HEADERS;
}
declare const onResetListHeaders: () => {
    type: "ContentManager/ListView/ON_RESET_LIST_HEADERS ";
};
interface ResetPropsAction {
    type: typeof RESET_PROPS;
}
interface SetLayoutAction extends Pick<ListViewLayoutManagerState, 'components' | 'displayedHeaders'> {
    type: typeof SET_LIST_LAYOUT;
    contentType: NonNullable<ListViewLayoutManagerState['contentType']>;
}
interface OnChangeListHeadersAction {
    type: typeof ON_CHANGE_LIST_HEADERS;
    target: {
        name: string;
        value: boolean;
    };
}
declare const onChangeListHeaders: (target: OnChangeListHeadersAction['target']) => {
    type: "ContentManager/ListView/ON_CHANGE_LIST_HEADERS ";
    target: {
        name: string;
        value: boolean;
    };
};
type Action = GetDataAction | GetDataSucceededAction | ResetPropsAction | SetLayoutAction | OnChangeListHeadersAction | onResetListHeadersAction;
declare const reducer: (state: ListViewLayoutManagerState | undefined, action: Action) => ListViewLayoutManagerState;
export { ListViewLayoutManager, reducer, getData, getDataSucceeded, onChangeListHeaders, onResetListHeaders, };
export type { ListViewLayoutManagerState, ListViewLayoutManagerProps };
