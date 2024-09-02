import { errors } from '@strapi/utils';
import { Component } from './components';
import { ContentType } from './content-types';
/**
 * GET /init
 */
export declare namespace GetInitData {
    interface Request {
        body: {};
        query: {};
    }
    interface Response {
        data: {
            fieldSizes: Record<string, {
                default: number;
                isResizeable: boolean;
            }>;
            components: Component[];
            contentTypes: ContentType[];
        };
        error?: errors.ApplicationError;
    }
}
//# sourceMappingURL=init.d.ts.map