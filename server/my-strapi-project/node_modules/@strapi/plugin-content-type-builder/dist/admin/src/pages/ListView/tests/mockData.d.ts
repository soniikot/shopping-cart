declare const _default: {
    contentType: {
        uid: string;
        apiID: string;
        schema: {
            name: string;
            description: string;
            draftAndPublish: boolean;
            pluginOptions: {
                i18n: {
                    localized: boolean;
                };
            };
            kind: string;
            collectionName: string;
            attributes: ({
                type: string;
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                required?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                repeatable?: undefined;
                component?: undefined;
                components?: undefined;
            } | {
                type: string;
                relation: string;
                target: string;
                inversedBy: string;
                targetAttribute: string;
                private: boolean;
                name: string;
                pluginOptions?: undefined;
                multiple?: undefined;
                required?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                repeatable?: undefined;
                component?: undefined;
                components?: undefined;
            } | {
                type: string;
                multiple: boolean;
                required: boolean;
                allowedTypes: string[];
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                repeatable?: undefined;
                component?: undefined;
                components?: undefined;
            } | {
                type: string;
                required: boolean;
                maxLength: number;
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                allowedTypes?: undefined;
                targetField?: undefined;
                repeatable?: undefined;
                component?: undefined;
                components?: undefined;
            } | {
                type: string;
                targetField: string;
                name: string;
                pluginOptions?: undefined;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                required?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                repeatable?: undefined;
                component?: undefined;
                components?: undefined;
            } | {
                type: string;
                repeatable: boolean;
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                component: string;
                required: boolean;
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                components?: undefined;
            } | {
                type: string;
                repeatable: boolean;
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                component: string;
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                required?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                components?: undefined;
            } | {
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                type: string;
                components: string[];
                name: string;
                relation?: undefined;
                target?: undefined;
                inversedBy?: undefined;
                targetAttribute?: undefined;
                private?: undefined;
                multiple?: undefined;
                required?: undefined;
                allowedTypes?: undefined;
                maxLength?: undefined;
                targetField?: undefined;
                repeatable?: undefined;
                component?: undefined;
            })[];
            visible: boolean;
            restrictRelationsTo: null;
        };
    };
    components: {
        'blog.test-como': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: ({
                    type: string;
                    default: string;
                    name: string;
                } | {
                    type: string;
                    name: string;
                    default?: undefined;
                })[];
            };
        };
        'basic.compopo': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: {
                    type: string;
                    name: string;
                }[];
            };
        };
        'basic.compo': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: {
                    type: string;
                    name: string;
                }[];
            };
        };
        'default.dish': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: ({
                    type: string;
                    required: boolean;
                    default: string;
                    name: string;
                    multiple?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    private?: undefined;
                } | {
                    type: string;
                    name: string;
                    required?: undefined;
                    default?: undefined;
                    multiple?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    private?: undefined;
                } | {
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    name: string;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    private?: undefined;
                } | {
                    type: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    private: boolean;
                    name: string;
                    required?: undefined;
                    default?: undefined;
                    multiple?: undefined;
                })[];
            };
        };
        'default.openingtimes': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: ({
                    type: string;
                    required: boolean;
                    default: string;
                    name: string;
                    repeatable?: undefined;
                    component?: undefined;
                } | {
                    type: string;
                    name: string;
                    required?: undefined;
                    default?: undefined;
                    repeatable?: undefined;
                    component?: undefined;
                } | {
                    type: string;
                    repeatable: boolean;
                    component: string;
                    name: string;
                    required?: undefined;
                    default?: undefined;
                })[];
            };
        };
        'default.restaurantservice': {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                collectionName: string;
                attributes: ({
                    type: string;
                    required: boolean;
                    default: string;
                    name: string;
                    multiple?: undefined;
                } | {
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    name: string;
                    default?: undefined;
                } | {
                    type: string;
                    required: boolean;
                    default: boolean;
                    name: string;
                    multiple?: undefined;
                })[];
            };
        };
    };
};
export default _default;
