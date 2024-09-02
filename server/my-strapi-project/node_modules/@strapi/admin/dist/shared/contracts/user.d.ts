import { errors } from '@strapi/utils';
import type { AdminUserCreationPayload, AdminUserUpdatePayload, Pagination, SanitizedAdminUser } from './shared';
import type { Entity, EntityService } from '@strapi/types';
/**
 * /create - Create an admin user
 */
export declare namespace Create {
    interface Request {
        body: AdminUserCreationPayload;
        query: {};
    }
    interface Response {
        data: SanitizedAdminUser;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * /create - Create an admin user
 */
export declare namespace Create {
    interface Request {
        body: AdminUserCreationPayload;
        query: {};
    }
    interface Response {
        data: SanitizedAdminUser;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * /find - Find admin users
 */
export declare namespace FindAll {
    interface Request {
        body: {};
        query: EntityService.Params.Pick<'admin::user', 'filters'>;
    }
    interface Response {
        data: {
            results: SanitizedAdminUser[];
            pagination: Pagination;
        };
        error?: errors.ApplicationError;
    }
}
/**
 * /findOne - Find an admin user
 */
export declare namespace FindOne {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: Entity.ID;
    }
    interface Response {
        data: SanitizedAdminUser;
        error?: errors.ApplicationError;
    }
}
/**
 * /update - Update an admin user
 */
export declare namespace Update {
    interface Request {
        body: AdminUserUpdatePayload;
        query: {};
    }
    interface Params {
        id: Entity.ID;
    }
    interface Response {
        data: SanitizedAdminUser;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * /deleteOne - Delete an admin user
 */
export declare namespace DeleteOne {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: Entity.ID;
    }
    interface Response {
        data: SanitizedAdminUser;
        error?: errors.ApplicationError;
    }
}
/**
 * /users/batch-delete - Delete admin users
 */
export declare namespace DeleteMany {
    interface Request {
        body: {
            ids: Entity.ID[];
        };
        query: {};
    }
    interface Response {
        data: SanitizedAdminUser[];
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
//# sourceMappingURL=user.d.ts.map