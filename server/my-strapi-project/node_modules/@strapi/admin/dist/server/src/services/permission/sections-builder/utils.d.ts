/// <reference types="lodash" />
declare const isOfKind: (kind: unknown) => (value: any) => boolean;
declare const resolveContentType: (uid: any) => import("@strapi/types/dist/types/core/schemas").ContentType;
declare const isNotInSubjects: (subjects: any) => (uid: unknown) => boolean;
declare const hasProperty: import("lodash").CurriedFunction2<unknown, any, boolean>;
declare const getValidOptions: import("lodash/fp").LodashPick2x1;
declare const toSubjectTemplate: (ct: any) => {
    uid: any;
    label: any;
    properties: never[];
};
export { isOfKind, resolveContentType, isNotInSubjects, hasProperty, getValidOptions, toSubjectTemplate, };
//# sourceMappingURL=utils.d.ts.map