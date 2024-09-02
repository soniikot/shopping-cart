import { errors } from '@strapi/utils';
import { Entity, Permission } from './shared';
import { EntityService } from '@strapi/types';
export interface StagePermission extends Omit<Permission, 'createdAt' | 'updatedAt' | 'properties' | 'conditions'> {
    role: number;
}
interface Stage extends Entity {
    color: string;
    name: string;
    permissions?: StagePermission[];
}
interface Workflow extends Entity {
    name: string;
    contentTypes: string[];
    stages: Stage[];
}
declare namespace GetAll {
    interface Request {
        body: {};
        query: EntityService.Params.Pick<'admin::review-workflow', 'filters' | 'populate:string'>;
    }
    interface Response {
        data: Workflow[];
        meta?: {
            workflowCount: number;
        };
        error?: errors.ApplicationError;
    }
}
declare namespace Get {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: Entity['id'];
    }
    interface Response {
        data: Workflow;
        error?: errors.ApplicationError;
    }
}
declare namespace Update {
    interface Request {
        body: {
            data: Partial<Workflow>;
        };
        query: {};
    }
    interface Params {
        id: Entity['id'];
    }
    interface Response {
        data: Workflow;
        error?: errors.ApplicationError;
    }
}
declare namespace Create {
    interface Request {
        body: {
            data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;
        };
        query: {};
    }
    interface Response {
        data: Workflow;
        error?: errors.ApplicationError;
    }
}
declare namespace Delete {
    interface Request {
        body: {};
        query: {};
    }
    interface Params {
        id: Entity['id'];
    }
    interface Response {
        data: Workflow;
        error?: errors.ApplicationError;
    }
}
export { Stage, Workflow, GetAll, Get, Update, Create, Delete };
//# sourceMappingURL=review-workflows.d.ts.map