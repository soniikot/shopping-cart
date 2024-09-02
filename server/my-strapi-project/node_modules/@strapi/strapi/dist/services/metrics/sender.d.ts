import type { Strapi } from '@strapi/types';
export interface Payload {
    eventProperties?: Record<string, unknown>;
    userProperties?: Record<string, unknown>;
    groupProperties?: Record<string, unknown>;
}
export type Sender = (event: string, payload?: Payload, opts?: Record<string, unknown>) => Promise<boolean>;
/**
 * Create a send function for event with all the necessary metadatas
 */
declare const _default: (strapi: Strapi) => Sender;
export default _default;
//# sourceMappingURL=sender.d.ts.map