import { Webhook } from '@strapi/types';
import { FormikHelpers } from 'formik';
import { TriggerWebhook } from '../../../../../../../shared/contracts/webhooks';
interface WebhookFormValues {
    name: Webhook['name'];
    url: Webhook['url'];
    headers: Array<{
        key: string;
        value: string;
    }>;
    events: Webhook['events'];
}
interface WebhookFormProps {
    data?: Webhook;
    handleSubmit: (values: WebhookFormValues, formik: FormikHelpers<WebhookFormValues>) => Promise<void>;
    isCreating: boolean;
    isTriggering: boolean;
    triggerWebhook: () => void;
    triggerResponse?: TriggerWebhook.Response['data'];
}
declare const WebhookForm: ({ handleSubmit, triggerWebhook, isCreating, isTriggering, triggerResponse, data, }: WebhookFormProps) => import("react/jsx-runtime").JSX.Element | null;
export { WebhookForm };
export type { WebhookFormValues, WebhookFormProps };
