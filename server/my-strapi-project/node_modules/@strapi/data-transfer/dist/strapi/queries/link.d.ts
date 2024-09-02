import type { Knex } from 'knex';
import type { LoadedStrapi } from '@strapi/types';
import { ILink } from '../../../types';
export declare const createLinkQuery: (strapi: LoadedStrapi, trx?: Knex.Transaction) => () => {
    generateAll: (uid: string) => AsyncGenerator<ILink>;
    generateAllForAttribute: (uid: string, fieldName: string) => AsyncGenerator<ILink>;
    insert: (link: ILink) => Promise<void>;
};
//# sourceMappingURL=link.d.ts.map