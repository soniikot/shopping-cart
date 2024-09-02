declare const createUid: (name: string) => `${string}.${string}`;
declare const createComponentUid: (name: string, category: string) => `${string}.${string}`;
export { createComponentUid, createUid };
