
type XLSXCFB$Blob = number[] | Uint8Array | Buffer
export type CustomCFB$Blob = XLSXCFB$Blob & {l: number, read_shift(num: number, encoding?: string): any, continuePartDataLens: number[]}

export type SSTValueType = {
    strs: Record<string, any>[];
    count: number;
    uniqueCount: number;
}