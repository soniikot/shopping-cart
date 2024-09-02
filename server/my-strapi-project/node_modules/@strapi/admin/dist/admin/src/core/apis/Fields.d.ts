import * as React from 'react';
export interface Field {
    type: string;
    Component: React.ComponentType;
}
export declare class Fields {
    fields: Record<Field['type'], Field['Component']>;
    constructor();
    add(field: Field): void;
}
