import { CustomCFB$Blob } from '../parse';
/**
 * @desc [MS-XLS] 2.4.21
 * @param blob
 * @param length
 * @returns
 */
export declare function parseBOF(blob: CustomCFB$Blob, length: number): {
    BIFFVer: number;
    dt: number;
};
