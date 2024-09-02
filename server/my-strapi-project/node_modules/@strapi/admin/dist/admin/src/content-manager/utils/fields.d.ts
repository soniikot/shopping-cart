declare const getFieldName: (stringName: string) => string[];
declare const getMaxTempKey: (arr: Array<{
    __temp_key__?: number;
    id?: number;
}>) => number;
declare const isFieldTypeNumber: (type: string) => boolean;
export { getFieldName, getMaxTempKey, isFieldTypeNumber };
