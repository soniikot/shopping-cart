import * as React from 'react';
export interface Component {
    name: string;
    Component: React.ComponentType;
}
export declare class Components {
    components: Record<Component['name'], Component['Component']>;
    constructor();
    add(component: Component): void;
}
