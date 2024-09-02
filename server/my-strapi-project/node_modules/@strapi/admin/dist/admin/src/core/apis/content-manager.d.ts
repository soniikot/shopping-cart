/**
 * This file can be removed when the content-manager is moved back to it's own plugin,
 * we would just add the APIs that plugin and continue to alias their methods on the
 * main StrapiApp class.
 */
import { type BulkActionDescription } from '../../content-manager/pages/ListView/components/BulkActions/Actions';
import type { DescriptionComponent } from '../../components/DescriptionComponentRenderer';
import type { Entity } from '@strapi/types';
type DescriptionReducer<Config extends object> = (prev: Config[]) => Config[];
interface Context {
    /**
     * Will be either 'single-types' | 'collection-types'
     */
    collectionType: string;
    /**
     * this will be undefined if someone is creating an entry.
     */
    entity?: Document;
    /**
     * this will be undefined if someone is creating an entry.
     */
    id?: Entity.ID;
    /**
     * The current content-type's model.
     */
    model: string;
}
interface BulkActionComponentProps extends Omit<Context, 'id' | 'entity'> {
    ids: Entity.ID[];
}
interface BulkActionComponent extends DescriptionComponent<BulkActionComponentProps, BulkActionDescription> {
    actionType?: 'delete' | 'publish' | 'unpublish';
}
declare class ContentManagerPlugin {
    /**
     * The following properties are the stored ones provided by any plugins registering with
     * the content-manager. The function calls however, need to be called at runtime in the
     * application, so instead we collate them and run them later with the complete list incl.
     * ones already registered & the context of the view.
     */
    bulkActions: BulkActionComponent[];
    constructor();
    addBulkAction(actions: DescriptionReducer<BulkActionComponent>): void;
    addBulkAction(actions: BulkActionComponent[]): void;
    get config(): {
        id: string;
        name: string;
        apis: {
            addBulkAction: {
                (actions: DescriptionReducer<BulkActionComponent>): void;
                (actions: BulkActionComponent[]): void;
            };
            getBulkActions: () => BulkActionComponent[];
        };
    };
}
export { ContentManagerPlugin };
export type { Context, DescriptionComponent, DescriptionReducer, BulkActionComponent };
