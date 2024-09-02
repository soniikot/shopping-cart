import { Entity } from '@strapi/types';
import type { AdminUser, AdminUserCreationPayload, SanitizedAdminUser, AdminUserUpdatePayload } from '../../../shared/contracts/shared';
declare const _default: {
    create: (attributes: Partial<AdminUserCreationPayload> & {
        isActive?: true | undefined;
    }) => Promise<AdminUser>;
    updateById: (id: Entity.ID, attributes: Partial<AdminUserUpdatePayload>) => Promise<AdminUser>;
    exists: (attributes?: unknown) => Promise<boolean>;
    findRegistrationInfo: (registrationToken: string) => Promise<Pick<AdminUser, "firstname" | "lastname" | "email"> | undefined>;
    register: ({ registrationToken, userInfo, }: {
        registrationToken: string;
        userInfo: Partial<AdminUser>;
    }) => Promise<AdminUser>;
    sanitizeUser: (user: AdminUser) => SanitizedAdminUser;
    findOne: (id: Entity.ID, populate?: string[]) => Promise<({
        id: Entity.ID;
    } & {
        [key: string]: any;
    }) | null>;
    findOneByEmail: (email: string, populate?: never[]) => Promise<any>;
    findPage: (query?: {}) => Promise<unknown>;
    deleteById: (id: Entity.ID) => Promise<AdminUser | null>;
    deleteByIds: (ids: (string | number)[]) => Promise<AdminUser[]>;
    countUsersWithoutRole: () => Promise<number>;
    count: (where?: {}) => Promise<number>;
    assignARoleToAll: (roleId: Entity.ID) => Promise<void>;
    displayWarningIfUsersDontHaveRole: () => Promise<void>;
    resetPasswordByEmail: (email: string, password: string) => Promise<void>;
    getLanguagesInUse: () => Promise<string[]>;
};
export default _default;
//# sourceMappingURL=user.d.ts.map