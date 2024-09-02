/**
 * This component renders all the routes for either multiple or single content types
 * including the settings views available.
 */
import { RouteComponentProps } from 'react-router-dom';
interface CollectionTypePagesProps extends RouteComponentProps<{
    collectionType: string;
    slug: string;
}> {
}
declare const CollectionTypePages: (props: CollectionTypePagesProps) => import("react/jsx-runtime").JSX.Element;
export { CollectionTypePages };
