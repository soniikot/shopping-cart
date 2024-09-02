import type { Strapi } from '@strapi/types';
interface Event {
    action: string;
    date: Date;
    userId: string | number;
    payload: Record<string, unknown>;
}
declare const _default: {
    register({ strapi }: {
        strapi: Strapi;
    }): Promise<{
        saveEvent(event: Event): Promise<any>;
        findMany(query: Record<string, unknown>): Promise<import("@strapi/types/dist/modules/entity-service").PaginatedResult<"admin::audit-log", {
            populate: "user"[];
            fields: ("action" | "date" | "payload")[];
        }>> | undefined;
        findOne(id: `${number}` | number): Promise<({
            id: import("@strapi/types/dist/types/core/entity").ID;
        } & {
            [key: string]: any;
        }) | null> | undefined;
        deleteExpiredEvents(expirationDate: Date): Promise<{
            count: number;
        }> | undefined;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map