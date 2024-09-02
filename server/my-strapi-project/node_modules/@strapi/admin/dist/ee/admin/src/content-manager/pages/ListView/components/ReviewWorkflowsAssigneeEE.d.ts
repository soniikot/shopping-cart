import { SanitizedAdminUser } from '../../../../../../../shared/contracts/shared';
interface ReviewWorkflowsAssigneeEEProps {
    user: Pick<SanitizedAdminUser, 'firstname' | 'lastname' | 'username' | 'email'>;
}
declare const ReviewWorkflowsAssigneeEE: ({ user }: ReviewWorkflowsAssigneeEEProps) => import("react/jsx-runtime").JSX.Element;
export { ReviewWorkflowsAssigneeEE };
export type { ReviewWorkflowsAssigneeEEProps };
