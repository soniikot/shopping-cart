import { EntityService, Common } from '@strapi/types';
import { errors } from '@strapi/utils';
type Entity = EntityService.Result<Common.UID.Schema>;
/**
 * GET /single-types/:model
 */
export declare namespace Find {
    interface Request {
        body: {};
        query: {
            locale: string;
        };
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
 * PUT /single-types/:model
 */
export declare namespace CreateOrUpdate {
    interface Request {
        body: Entity;
        query: {
            plugins: {
                i18n: {
                    locale: string;
                };
            };
        };
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * DELETE /single-types/:model
 */
export declare namespace Delete {
    interface Request {
        body: {};
        query: {
            locale: string;
        };
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /single-types/:model/actions/publish
 */
export declare namespace Publish {
    interface Request {
        body: {};
        query: {
            locale: string;
        };
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /single-types/:model/actions/unpublish
 */
export declare namespace UnPublish {
    interface Request {
        body: {};
        query: {
            locale: string;
        };
    }
    interface Response {
        data: Entity;
        error?: errors.ApplicationError;
    }
}
/**
 * GET /single-types/:model/actions/countDraftRelations
 */
export declare namespace CountDraftRelations {
    interface Request {
        body: {};
        query: {};
    }
    interface Response {
        data: number;
        error?: errors.ApplicationError;
    }
}
export {};
//# sourceMappingURL=single-types.d.ts.map