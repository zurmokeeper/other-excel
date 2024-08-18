
type XLSXCFB$Blob = number[] | Uint8Array | Buffer
export type CustomCFB$Blob = XLSXCFB$Blob & {l: number, read_shift(num: number, encoding?: string): any, continuePartDataLens: number[]}

export type CellValueType = 'string' | 'date' | 'hyperlink' | 'number';

export type SSTValueType = {
    strs: Record<string, any>[];
    count: number;
    uniqueCount: number;
}

export type LabelSSTValueType = {
    row: number;
    col: number;
    type: CellValueType;
    ixfe: number;
    isst: number;
    value: Record<string, any>;
    xf: Record<string, any>;
}

export interface Cell {
    value: Record<string, any>;
    type: CellValueType;
    col: number;
    row: number;
    text: string | number; // 单元格字面量
}

export interface Row {
    readonly number: number;
    values: Cell[];
}

export interface Column {
    readonly number: number;
    values: Cell[];
}

export interface Column {
    readonly number: number;
    values: Cell[];
}

export interface Range {
    start: {
        col: number;
        row: number;
    }
    end: {
        col: number;
        row: number;
    }
}