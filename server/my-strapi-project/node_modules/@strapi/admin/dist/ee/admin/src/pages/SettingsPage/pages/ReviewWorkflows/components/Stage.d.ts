export type StageProps = {
    id: number;
    index: number;
    canDelete: boolean;
    canReorder: boolean;
    canUpdate: boolean;
    isOpen: boolean;
    stagesCount: number;
};
export declare const Stage: ({ id, index, canDelete, canReorder, canUpdate, isOpen: isOpenDefault, stagesCount, }: StageProps) => import("react/jsx-runtime").JSX.Element;
