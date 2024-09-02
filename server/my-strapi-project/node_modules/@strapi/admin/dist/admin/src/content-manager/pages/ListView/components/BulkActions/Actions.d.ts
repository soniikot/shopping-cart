import * as React from 'react';
import type { BulkActionComponent } from '../../../../../core/apis/content-manager';
interface BulkActionDescription {
    dialog?: DialogOptions | NotificationOptions | ModalOptions;
    disabled?: boolean;
    icon?: React.ReactNode;
    label: string;
    onClick?: (event: React.SyntheticEvent) => void;
    /**
     * @default 'default'
     */
    type?: 'icon' | 'default';
    /**
     * @default 'secondary'
     */
    variant?: 'default' | 'secondary' | 'tertiary' | 'danger-light' | 'success';
}
interface DialogOptions {
    type: 'dialog';
    title: string;
    content?: React.ReactNode;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
}
interface NotificationOptions {
    type: 'notification';
    title: string;
    link?: {
        label: string;
        url: string;
        target?: string;
    };
    content?: string;
    onClose?: () => void;
    status?: 'info' | 'warning' | 'softWarning' | 'success';
    timeout?: number;
}
interface ModalOptions {
    type: 'modal';
    title: string;
    content: React.ComponentType<{
        onClose: () => void;
    }>;
    onClose?: () => void;
}
declare const BulkActionsRenderer: () => import("react/jsx-runtime").JSX.Element;
declare const Emphasis: (chunks: React.ReactNode) => import("react/jsx-runtime").JSX.Element;
declare const DEFAULT_BULK_ACTIONS: BulkActionComponent[];
export { DEFAULT_BULK_ACTIONS, BulkActionsRenderer, Emphasis };
export type { BulkActionDescription };
