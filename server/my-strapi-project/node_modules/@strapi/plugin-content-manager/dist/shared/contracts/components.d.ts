import { Schema } from '@strapi/types';
import { errors } from '@strapi/utils';
import { Configuration, Settings, Metadatas, Layouts } from './content-types';
export interface Component extends Schema.Component {
    isDisplayed: boolean;
    info: Schema.Info;
    apiID: string;
}
export interface ComponentConfiguration extends Configuration {
    category: string;
    isComponent: boolean;
}
/**
 * GET /components
 */
export declare namespace FindComponents {
    interface Request {
        body: {};
        query: {};
    }
    interface Response {
        data: Component[];
        error?: errors.ApplicationError;
    }
}
/**
 * GET /components/:uid/configuration
 */
export declare namespace FindComponentConfiguration {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        uid: string;
    }
    interface Response {
        data: {
            component: ComponentConfiguration;
            components: Record<string, ComponentConfiguration>;
        };
        error?: errors.ApplicationError;
    }
}
/**
 * PUT /components/:uid/configuration
 */
export declare namespace UpdateComponentConfiguration {
    interface Request {
        body: {
            layouts: Layouts;
            metadatas: Metadatas;
            settings: Settings;
        };
        query: {};
    }
    interface Params {
        uid: string;
    }
    interface Response {
        data: ComponentConfiguration;
        error?: errors.ApplicationError | errors.YupValidationError;
    }
}
//# sourceMappingURL=components.d.ts.map