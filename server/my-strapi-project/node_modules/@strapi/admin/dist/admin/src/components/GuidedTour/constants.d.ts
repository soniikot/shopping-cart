declare const LAYOUT_DATA: {
    readonly contentTypeBuilder: {
        readonly home: {
            readonly title: {
                readonly id: "app.components.GuidedTour.home.CTB.title";
                readonly defaultMessage: "🧠 Build the content structure";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.home.CTB.cta.title";
                    readonly defaultMessage: "Go to the Content type Builder";
                };
                readonly type: "REDIRECT";
                readonly target: "/plugins/content-type-builder";
            };
            readonly trackingEvent: "didClickGuidedTourHomepageContentTypeBuilder";
        };
        readonly create: {
            readonly title: {
                readonly id: "app.components.GuidedTour.CTB.create.title";
                readonly defaultMessage: "🧠 Create a first Collection type";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.CTB.create.content";
                readonly defaultMessage: "<p>Collection types help you manage several entries, Single types are suitable to manage only one entry.</p> <p>Ex: For a Blog website, Articles would be a Collection type whereas a Homepage would be a Single type.</p>";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.CTB.create.cta.title";
                    readonly defaultMessage: "Build a Collection type";
                };
                readonly type: "CLOSE";
            };
            readonly trackingEvent: "didClickGuidedTourStep1CollectionType";
        };
        readonly success: {
            readonly title: {
                readonly id: "app.components.GuidedTour.CTB.success.title";
                readonly defaultMessage: "Step 1: Completed ✅";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.CTB.success.content";
                readonly defaultMessage: "<p>Good going!</p><b>⚡️ What would you like to share with the world?</b>";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.create-content";
                    readonly defaultMessage: "Create content";
                };
                readonly type: "REDIRECT";
                readonly target: "/content-manager";
            };
            readonly trackingEvent: "didCreateGuidedTourCollectionType";
        };
    };
    readonly contentManager: {
        readonly home: {
            readonly title: {
                readonly id: "app.components.GuidedTour.home.CM.title";
                readonly defaultMessage: "⚡️ What would you like to share with the world?";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.create-content";
                    readonly defaultMessage: "Create content";
                };
                readonly type: "REDIRECT";
                readonly target: "/content-manager";
            };
            readonly trackingEvent: "didClickGuidedTourHomepageContentManager";
        };
        readonly create: {
            readonly title: {
                readonly id: "app.components.GuidedTour.CM.create.title";
                readonly defaultMessage: "⚡️ Create content";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.CM.create.content";
                readonly defaultMessage: "<p>Create and manage all the content here in the Content Manager.</p><p>Ex: Taking the Blog website example further, one can write an Article, save and publish it as they like.</p><p>💡 Quick tip - Don't forget to hit publish on the content you create.</p>";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.create-content";
                    readonly defaultMessage: "Create content";
                };
                readonly type: "CLOSE";
            };
            readonly trackingEvent: "didClickGuidedTourStep2ContentManager";
        };
        readonly success: {
            readonly title: {
                readonly id: "app.components.GuidedTour.CM.success.title";
                readonly defaultMessage: "Step 2: Completed ✅";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.CM.success.content";
                readonly defaultMessage: "<p>Awesome, one last step to go!</p><b>🚀  See content in action</b>";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.CM.success.cta.title";
                    readonly defaultMessage: "Test the API";
                };
                readonly type: "REDIRECT";
                readonly target: "/settings/api-tokens";
            };
            readonly trackingEvent: "didCreateGuidedTourEntry";
        };
    };
    readonly apiTokens: {
        readonly home: {
            readonly title: {
                readonly id: "app.components.GuidedTour.apiTokens.create.title";
                readonly defaultMessage: "🚀 See content in action";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.home.apiTokens.cta.title";
                    readonly defaultMessage: "Test the API";
                };
                readonly type: "REDIRECT";
                readonly target: "/settings/api-tokens";
            };
            readonly trackingEvent: "didClickGuidedTourHomepageApiTokens";
        };
        readonly create: {
            readonly title: {
                readonly id: "app.components.GuidedTour.apiTokens.create.title";
                readonly defaultMessage: "🚀 See content in action";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.apiTokens.create.content";
                readonly defaultMessage: "<p>Generate an authentication token here and retrieve the content you just created.</p>";
            };
            readonly cta: {
                readonly title: {
                    readonly id: "app.components.GuidedTour.apiTokens.create.cta.title";
                    readonly defaultMessage: "Generate an API Token";
                };
                readonly type: "CLOSE";
            };
            readonly trackingEvent: "didClickGuidedTourStep3ApiTokens";
        };
        readonly success: {
            readonly title: {
                readonly id: "app.components.GuidedTour.apiTokens.success.title";
                readonly defaultMessage: "Step 3: Completed ✅";
            };
            readonly content: {
                readonly id: "app.components.GuidedTour.apiTokens.success.content";
                readonly defaultMessage: "<p>See content in action by making an HTTP request:</p><ul><li><p>To this URL: <light>https://'<'YOUR_DOMAIN'>'/api/'<'YOUR_CT'>'</light></p></li><li><p>With the header: <light>Authorization: bearer '<'YOUR_API_TOKEN'>'</light></p></li></ul><p>For more ways to interact with content, see the <documentationLink>documentation</documentationLink>.</p>";
            };
            readonly trackingEvent: "didGenerateGuidedTourApiTokens";
        };
    };
};
declare const STATES: {
    readonly IS_DONE: "IS_DONE";
    readonly IS_ACTIVE: "IS_ACTIVE";
    readonly IS_NOT_DONE: "IS_NOT_DONE";
};
type LayoutData = typeof LAYOUT_DATA;
type States = keyof typeof STATES;
export { LAYOUT_DATA, STATES };
export type { LayoutData, States };
