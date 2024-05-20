import { CustomCFB$Blob } from '../parse';
/**
 * @desc [MS-XLS] 2.4.28
 * @param blob
 * @param length
 * @param opts
 * @returns
 */
export declare function parseBoundSheet8(blob: CustomCFB$Blob, length: number, options: any): {
    pos: any;
    hsState: number;
    dt: any;
    stName: any;
};
