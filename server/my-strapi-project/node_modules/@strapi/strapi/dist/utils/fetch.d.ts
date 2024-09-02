import { RequestInit, Response } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { Strapi } from '@strapi/types';
export interface Fetch {
    (url: string, options: RequestInit): Promise<Response>;
    agent?: HttpsProxyAgent;
}
export declare function createStrapiFetch(strapi: Strapi): Fetch;
//# sourceMappingURL=fetch.d.ts.map