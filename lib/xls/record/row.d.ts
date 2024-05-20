import { CustomCFB$Blob } from '../parse';
type DataType = {
    rw: number;
    colMic: number;
    level: number;
    hidden: boolean;
    hpt: number;
    cnt: number;
};
export declare function parseRow(blob: CustomCFB$Blob): DataType;
export {};
