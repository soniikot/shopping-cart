export declare const expectedData: {
    contentTypeToCreate: {
        displayName: string;
        description: string;
        attributes: {
            name: {
                type: string;
            };
            address: {
                relation: string;
                target: string;
                type: string;
            };
            testContentTypes: {
                relation: string;
                targetAttribute: string;
                target: string;
                type: string;
            };
            testContentType: {
                relation: string;
                target: string;
                targetAttribute: string;
                type: string;
            };
            mainCompoField: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            existingCompo: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            quote: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            someCustomField: {
                customField: string;
                type: string;
            };
        };
    };
    contentTypeToEdit: {
        displayName: string;
        description: string;
        attributes: {
            name: {
                type: string;
            };
            address: {
                relation: string;
                target: string;
                type: string;
            };
            testContentTypes: {
                relation: string;
                targetAttribute: string;
                target: string;
                type: string;
            };
            testContentType: {
                relation: string;
                target: string;
                targetAttribute: string;
                type: string;
            };
            mainCompoField: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            existingCompo: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            quote: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            someCustomField: {
                customField: string;
                type: string;
            };
        };
    };
    componentsToFormat: string[];
    sortedContentTypes: ({
        uid: string;
        name: string;
        title: string;
        to: string;
        kind: string;
        visible: boolean;
        plugin: null;
        restrictRelationsTo: null;
    } | {
        uid: string;
        name: string;
        title: string;
        to: string;
        kind: string;
        visible: boolean;
        plugin: null;
        restrictRelationsTo: string[];
    })[];
    components: ({
        tmpUID: string;
        name: string;
        icon: string;
        category: string;
        attributes: {
            name: {
                type: string;
            };
            testContentType: {
                relation: string;
                target: string;
                type: string;
            };
            subCompoField: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            someCustomField: {
                customField: string;
                type: string;
            };
            email?: undefined;
            quote?: undefined;
            link_to_biography?: undefined;
        };
        uid?: undefined;
        description?: undefined;
        connection?: undefined;
        collectionName?: undefined;
    } | {
        tmpUID: string;
        name: string;
        icon: string;
        category: string;
        attributes: {
            name: {
                type: string;
            };
            email: {
                type: string;
            };
            testContentType?: undefined;
            subCompoField?: undefined;
            someCustomField?: undefined;
            quote?: undefined;
            link_to_biography?: undefined;
        };
        uid?: undefined;
        description?: undefined;
        connection?: undefined;
        collectionName?: undefined;
    } | {
        uid: string;
        category: string;
        name: string;
        description: string;
        icon: string;
        connection: string;
        collectionName: string;
        attributes: {
            quote: {
                type: string;
                required: boolean;
            };
            link_to_biography: {
                type: string;
                required: boolean;
            };
            name?: undefined;
            testContentType?: undefined;
            subCompoField?: undefined;
            someCustomField?: undefined;
            email?: undefined;
        };
        tmpUID?: undefined;
    })[];
    componentsForEdit: ({
        tmpUID: string;
        name: string;
        icon: string;
        category: string;
        attributes: {
            name: {
                type: string;
            };
            testContentType: {
                relation: string;
                target: string;
                type: string;
            };
            subCompoField: {
                type: string;
                repeatable: boolean;
                component: string;
            };
            someCustomField: {
                customField: string;
                type: string;
            };
            email?: undefined;
            quote?: undefined;
            link_to_biography?: undefined;
        };
        uid?: undefined;
        description?: undefined;
        connection?: undefined;
        collectionName?: undefined;
    } | {
        tmpUID: string;
        name: string;
        icon: string;
        category: string;
        attributes: {
            name: {
                type: string;
            };
            email: {
                type: string;
            };
            testContentType?: undefined;
            subCompoField?: undefined;
            someCustomField?: undefined;
            quote?: undefined;
            link_to_biography?: undefined;
        };
        uid?: undefined;
        description?: undefined;
        connection?: undefined;
        collectionName?: undefined;
    } | {
        uid: string;
        category: string;
        name: string;
        description: string;
        icon: string;
        connection: string;
        collectionName: string;
        attributes: {
            quote: {
                type: string;
                required: boolean;
            };
            link_to_biography: {
                type: string;
                required: boolean;
            };
            name?: undefined;
            testContentType?: undefined;
            subCompoField?: undefined;
            someCustomField?: undefined;
            email?: undefined;
        };
        tmpUID?: undefined;
    })[];
    formattedComponents: {
        'components.main-compo': {
            tmpUID: string;
            name: string;
            icon: string;
            category: string;
            attributes: {
                name: {
                    type: string;
                };
                testContentType: {
                    relation: string;
                    target: string;
                    type: string;
                };
                subCompoField: {
                    type: string;
                    repeatable: boolean;
                    component: string;
                };
                someCustomField: {
                    customField: string;
                    type: string;
                };
            };
        };
        'default.nested-compo': {
            tmpUID: string;
            name: string;
            icon: string;
            category: string;
            attributes: {
                name: {
                    type: string;
                };
                email: {
                    type: string;
                };
            };
        };
        'blog.quote': {
            uid: string;
            category: string;
            name: string;
            description: string;
            icon: string;
            connection: string;
            collectionName: string;
            attributes: {
                quote: {
                    type: string;
                    required: boolean;
                };
                link_to_biography: {
                    type: string;
                    required: boolean;
                };
            };
        };
    };
    formattedComponentsForEdit: {
        'components.main-compo': {
            tmpUID: string;
            name: string;
            icon: string;
            category: string;
            attributes: {
                name: {
                    type: string;
                };
                testContentType: {
                    relation: string;
                    target: string;
                    type: string;
                };
                subCompoField: {
                    type: string;
                    repeatable: boolean;
                    component: string;
                };
                someCustomField: {
                    customField: string;
                    type: string;
                };
            };
        };
        'default.nested-compo': {
            tmpUID: string;
            name: string;
            icon: string;
            category: string;
            attributes: {
                name: {
                    type: string;
                };
                email: {
                    type: string;
                };
            };
        };
        'blog.quote': {
            uid: string;
            category: string;
            name: string;
            description: string;
            icon: string;
            connection: string;
            collectionName: string;
            attributes: {
                quote: {
                    type: string;
                    required: boolean;
                };
                link_to_biography: {
                    type: string;
                    required: boolean;
                };
            };
        };
    };
};
