import { Permission } from '@strapi/helper-plugin';
declare const useContentTypePermissions: (slug?: string) => {
    createPermissions: Permission[];
    readPermissions: Permission[];
};
export { useContentTypePermissions };
