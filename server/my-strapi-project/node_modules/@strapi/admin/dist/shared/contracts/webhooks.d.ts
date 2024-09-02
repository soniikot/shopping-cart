import { errors } from '@strapi/utils';
import type { Webhook } from '@strapi/types';
/**
 * /webhooks - GET all webhooks
 */
export declare namespace GetWebhooks {
    interface Request {
        body: {};
        query: {};
    }
    interface Response {
        data: Webhook[];
        error?: errors.ApplicationError;
    }
}
/**
 * GET /webhooks/:id - Get a webhook
 */
export declare namespace GetWebhook {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: string;
    }
    interface Response {
        data: Webhook;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /webhooks - Create a webhook
 */
export declare namespace CreateWebhook {
    interface Request {
        body: Webhook;
        query: {};
    }
    interface Response {
        data: Webhook;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * PUT /webhooks/:id - Update a webhook
 */
export declare namespace UpdateWebhook {
    interface Request {
        body: Partial<Webhook>;
        query: {};
    }
    interface Params {
        id: string;
    }
    interface Response {
        data: Webhook;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
/**
 * DELETE /webhooks/:id - Delete a webhook
 */
export declare namespace DeleteWebhook {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: string;
    }
    interface Response {
        data: Webhook;
        error?: errors.ApplicationError;
    }
}
/**
 * POST /webhooks/batch-delete' - Delete multiple webhooks
 */
export declare namespace DeleteWebhooks {
    interface Request {
        body: {
            ids: string[];
        };
        query: {};
    }
    interface Response {
        data: {};
        error?: errors.ApplicationError;
    }
}
/**
 * POST /webhooks/:id/trigger - Trigger a webhook
 */
export declare namespace TriggerWebhook {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: string;
    }
    interface Response {
        data: {
            statusCode: number;
            message?: string;
        };
        error?: errors.ApplicationError;
    }
}
//# sourceMappingURL=webhooks.d.ts.map