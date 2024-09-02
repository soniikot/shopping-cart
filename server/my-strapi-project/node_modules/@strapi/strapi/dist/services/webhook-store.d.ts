/**
 * Webhook store is the implementation of webhook storage over the core_store
 */
import type { Database } from '@strapi/database';
declare const webhookModel: {
    uid: string;
    collectionName: string;
    attributes: {
        name: {
            type: string;
        };
        url: {
            type: string;
        };
        headers: {
            type: string;
        };
        events: {
            type: string;
        };
        enabled: {
            type: string;
        };
    };
};
export interface Webhook {
    id: string;
    name: string;
    url: string;
    headers: Record<string, string>;
    events: string[];
    isEnabled: boolean;
}
export interface WebhookStore {
    allowedEvents: Map<string, string>;
    addAllowedEvent(key: string, value: string): void;
    removeAllowedEvent(key: string): void;
    listAllowedEvents(): string[];
    getAllowedEvent(key: string): string | undefined;
    findWebhooks(): Promise<Webhook[]>;
    findWebhook(id: string): Promise<Webhook | null>;
    createWebhook(data: Webhook): Promise<Webhook>;
    updateWebhook(id: string, data: Webhook): Promise<Webhook | null>;
    deleteWebhook(id: string): Promise<Webhook | null>;
}
declare const createWebhookStore: ({ db }: {
    db: Database;
}) => WebhookStore;
export { webhookModel, createWebhookStore };
//# sourceMappingURL=webhook-store.d.ts.map