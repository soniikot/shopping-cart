import { Ref } from 'react';
type PossibleRef<T> = Ref<T> | undefined;
/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
export declare const composeRefs: <T>(...refs: PossibleRef<T>[]) => (node: T) => void;
export {};
