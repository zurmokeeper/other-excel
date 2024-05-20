import { CustomCFB$Blob } from '../parse';
/**
 * @desc [MS-XLS] 2.4.265   Strings: [ { t: '阿萨德', raw: '<t>阿萨德</t>', r: '阿萨德' }, Count: 1, Unique: 1 ],
 *
 * sst -> shared string table
 * @param blob
 * @param length
 * @returns
 */
export declare function parseSST(blob: CustomCFB$Blob, length: number): {
    strs: never[];
    count: number;
    uniqueCount: number;
};
