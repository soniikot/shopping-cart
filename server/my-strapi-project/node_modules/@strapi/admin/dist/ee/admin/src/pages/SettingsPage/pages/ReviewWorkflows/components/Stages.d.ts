import { Stage as StageType } from '../../../../../../../../shared/contracts/review-workflows';
export type StagesProps = {
    canDelete?: boolean;
    canUpdate?: boolean;
    stages?: StageType[];
};
export declare const Stages: ({ canDelete, canUpdate, stages }: StagesProps) => import("react/jsx-runtime").JSX.Element;
