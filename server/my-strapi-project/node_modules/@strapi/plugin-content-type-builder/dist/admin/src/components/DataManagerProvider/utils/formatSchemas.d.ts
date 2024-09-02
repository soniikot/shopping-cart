import { AttributeType } from '../../../types';
/**
 * Format the attributes to array instead of an object
 */
export declare const formatSchemas: (schemas: Record<string, any>) => any;
export declare const toAttributesArray: (attributes: Record<string, AttributeType>) => AttributeType[];
