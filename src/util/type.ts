type XLSXCFB$Blob = number[] | Uint8Array | Buffer
export type CustomCFB$Blob = XLSXCFB$Blob & {l: number, read_shift(num: number, encoding?: string): any, continuePartDataLens: number[]}

export type Options = {
	type?: 'base64' | 'buffer' | 'stream';
}

export interface ParseFuncOptions extends Options {
    biffVer?: 2 | 3 | 4 | 5 | 8 | 12;
}

export type CellValueType = 'string' | 'date' | 'hyperlink' | 'number';

export type StrsType = {
	text: string;
}

export type SSTValueType = {
    strs: StrsType[];
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

export interface CellValue {
	value: number | string;
}

export interface Cell {
	address: string;
    value: CellValue;
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

export type FillPatterns =
	| 'none' | 'solid'
	| 'darkVertical' | 'darkHorizontal' | 'darkGrid' | 'darkTrellis' | 'darkDown' | 'darkUp'
	| 'lightVertical' | 'lightHorizontal' | 'lightGrid' | 'lightTrellis' | 'lightDown' | 'lightUp'
	| 'darkGray' | 'mediumGray' | 'lightGray' | 'gray125' | 'gray0625';

export interface FillPattern {
	type: 'pattern';
	pattern: FillPatterns;
	fgColor?: Partial<Color>;
	bgColor?: Partial<Color>;
}

// export type Fill = FillPattern | FillGradientAngle | FillGradientPath;
export type Fill = FillPattern;

export interface Font {
	name: string;
	size: number;
	family: number;
	scheme: 'minor' | 'major' | 'none';
	charset: number;
	color: Partial<Color>;
	bold: boolean;
	italic: boolean;
	underline: boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
	vertAlign: 'superscript' | 'subscript';
	strike: boolean;
	outline: boolean;
}

export type BorderStyle =
	| 'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashed' | 'dashDot'
	| 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot';

export interface Color {
	/**
	 * Hex string for alpha-red-green-blue e.g. FF00FF00
	 */
	argb: string;

	/**
	 * Choose a theme by index
	 */
	theme: number;
}

export interface Border {
	style: BorderStyle;
	color: Partial<Color>;
}

export interface BorderDiagonal extends Border {
	up: boolean;
	down: boolean;
}

export interface Borders {
	top: Partial<Border>;
	left: Partial<Border>;
	bottom: Partial<Border>;
	right: Partial<Border>;
	diagonal: Partial<BorderDiagonal>;
}

export interface Margins {
	top: number;
	left: number;
	bottom: number;
	right: number;
	header: number;
	footer: number;
}

export enum ReadingOrder {
	LeftToRight = 1,
	RightToLeft = 2,
}

// TODO:centerContinuous  Center-across-selection alignment??
// https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/75e17a8f-9cd4-4b37-927e-4b0a54ef9266
export interface Alignment {
	horizontal: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
	vertical: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
	wrapText: boolean;
	shrinkToFit: boolean;
	indent: number;
	readingOrder: 'rtl' | 'ltr';
	textRotation: number | 'vertical';
}

export interface Protection {
	locked: boolean;
	hidden: boolean;
}

export interface Style {
	numFmt: string;
	font: Partial<Font>;
	alignment: Partial<Alignment>;
	protection: Partial<Protection>;
	border: Partial<Borders>;
	fill: Fill;
}
