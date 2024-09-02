import { Permission } from '@strapi/helper-plugin';
declare const generatePermissionsObject: (uid: string) => Record<string, Permission[]>;
declare const getFieldsActionMatchingPermissions: (userPermissions: Permission[], slug: string) => {
    createActionAllowedFields: string[];
    readActionAllowedFields: string[];
    updateActionAllowedFields: string[];
};
export { generatePermissionsObject, getFieldsActionMatchingPermissions };
