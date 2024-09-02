import { errors } from '@strapi/utils';
import { Schema, Common, EntityService } from '@strapi/types';
type Entity = EntityService.Result<Common.UID.Schema>;
type PaginatedEntities = EntityService.PaginatedResult<Common.UID.Schema>;
type PaginationQuery = EntityService.Params.Pagination.PageNotation;
type SortQuery = EntityService.Params.Sort.StringNotation<Common.UID.Schema> & string;
/**
 * GET /collection-types/:model
 */
export declare namespace Find {
    interface Request {
        body: {};
        query: {
            page: PaginationQuery['page'];
            pageSize: PaginationQuery['pageSize'];
            sort: SortQuery;
        };
    }
    interface Params {
        model: string;
    }
    interface Response {
        results: PaginatedEntities['results'];
        pagination: PaginatedEntities['pagination'];
        error?: errors.ApplicationError;
    }
}
/**
 * GET /collection-types/:model/:id
 */
export declare namespace FindOne {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
        id: number;
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model
 */
export declare namespace Create {
    interface Request {
        body: Schema.Attributes;
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model/auto-clone/:sourceId
 */
export declare namespace AutoClone {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
        sourceId: Entity['id'];
    }
    type Response = Entity | {
        error?: errors.ApplicationError;
    };
}
/**
 * POST /collection-types/:model/clone/:sourceId
 */
export declare namespace Clone {
    interface Request {
        body: Schema.Attributes;
        query: {};
    }
    interface Params {
        model: string;
        sourceId: number;
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model/:id
 */
export declare namespace Update {
    interface Request {
        body: Entity;
        query: {};
    }
    interface Params {
        model: string;
        id: number;
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * DELETE /collection-types/:model/:id
 */
export declare namespace Delete {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
        id: Entity['id'];
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model/:id/actions/publish
 */
export declare namespace Publish {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
        id: number;
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model/:id/actions/unpublish
 */
export declare namespace Unpublish {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
        id: Entity['id'];
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /collection-types/:model/actions/bulkDelete
 */
export declare namespace BulkDelete {
    interface Request {
        body: {
            ids: Entity['id'][];
        };
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        data: {
            count: number;
        };
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * POST /collection-types/:model/actions/bulkPublish
 */
export declare namespace BulkPublish {
    interface Request {
        body: {
            ids: Entity['id'][];
        };
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        count: number;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * POST /collection-types/:model/actions/bulkUnpublish
 */
export declare namespace BulkUnpublish {
    interface Request {
        body: {
            ids: Entity['id'][];
        };
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        data: {
            count: number;
        };
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * GET /collection-types/:model/:id/actions/countDraftRelations
 */
export declare namespace CountDraftRelations {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        data: number;
        error?: errors.ApplicationError;
    }
}
/**
 * GET /collection-types/:model/actions/countManyEntriesDraftRelations
 */
export declare namespace CountManyEntriesDraftRelations {
    interface Request {
        body: {
            ids: number[];
        };
        query: {};
    }
    interface Params {
        model: string;
    }
    interface Response {
        data: number;
        error?: errors.ApplicationError;
    }
}
export {};
//# sourceMappingURL=collection-types.d.ts.map