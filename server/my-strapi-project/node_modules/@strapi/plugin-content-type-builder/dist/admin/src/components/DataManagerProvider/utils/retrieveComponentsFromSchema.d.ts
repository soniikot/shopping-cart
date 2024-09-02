import type { AttributeType, Components } from '../../../types';
import type { UID } from '@strapi/types';
declare const retrieveComponentsFromSchema: (attributes: AttributeType[], allComponentsData: Components) => UID.Component[];
export { retrieveComponentsFromSchema };
