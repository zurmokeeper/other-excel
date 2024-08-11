
type XLSXCFB$Blob = number[] | Uint8Array
export type CustomCFB$Blob = XLSXCFB$Blob & {l: number, read_shift(num: number, encoding?: string): any}

export type SSTValueType = {
    strs: Record<string, any>[];
    count: number;
    uniqueCount: number;
}