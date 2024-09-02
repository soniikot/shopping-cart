import * as React from 'react';
export type LimitsModalProps = {
    isOpen?: boolean;
    onClose: () => void;
};
declare const LimitsModal: {
    Title: React.FC<{
        children?: React.ReactNode;
    }>;
    Body: React.FC<{
        children?: React.ReactNode;
    }>;
    Root: React.FC<React.PropsWithChildren<LimitsModalProps>>;
};
export { LimitsModal };
