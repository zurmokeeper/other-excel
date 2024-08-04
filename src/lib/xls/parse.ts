
// import * as CFB from 'cfb';
import * as fs from 'fs';
import XLSX from 'xlsx';

const CFB = XLSX.CFB

import { CountryCodeEnum } from '../../util/enum';
import { parseBoundSheet8 } from '../xls/record/boundSheet';
import { parseBOF } from '../xls/record/bof';
import { parseSST } from '../xls/record/sst';
import { parseCountry } from '../xls/record/country';
import { parseDimensions } from '../xls/record/dimensions';
import { parseRow } from '../xls/record/row';
// import { parseIndex } from '../xls/record/recordIndex';
import { parseIndex } from './record/tttt';
import { parseLabelSST } from '../xls/record/labelSst';
import { parseXF } from '../xls/record/xf';
import { parseFont } from '../xls/record/font';

// import { read_shift } from '../../util/customCfbJS';
const customCfbJS: any = require('../../util/customCfbJS.js');

// import * as customCfbJS from '../../../customCfbJS';
// const customModule: any = customCfbJS;

/**
 * @desc cfb blob.l  未加定义，手动加上
 */
// export type CustomCFB$Blob = CFB.CFB$Blob & {l: number, read_shift(num: number, encoding?: string): any}
type XLSXCFB$Blob = number[] | Uint8Array
export type CustomCFB$Blob = XLSXCFB$Blob & {l: number, read_shift(num: number, encoding?: string): any}

interface XLSRecord {
	func?: (blob: CustomCFB$Blob, length: number, options?: any) => any;
}

interface XLSRecordEnum {
	[key: number]: XLSRecord
}

const XLSRECORDENUM: XLSRecordEnum = {
    0x0085: {func: parseBoundSheet8},
    0x0809: {func: parseBOF},
	0x0086: { },
	0x00fc: {func: parseSST},
	0x00fd: {func: parseLabelSST},
	0x008c: {func: parseCountry },
	0x0200: { /* n:"Dimensions", */ func: parseDimensions },
	0x0208: {func: parseRow },
	0x013d: { /* n:"RRTabId", */ func: parseUInt16a },
	0x020b: { /* n:"Index", */ func: parseIndex },
	0x00e0: { /* n:"XF", */ func: parseXF },
	0x0031: { /* n:"Font", */ func: parseFont },
}


let currentCodepage = 1200;
/**
 * @desc [MS-XLS] 2.5.240 ShortXLUnicodeString
 * 
 * 'sbcs-cont': 这表示单字节字符集 (SBCS) 连续字符串。在这种编码中，每个字符由一个字节表示，字符集通常是 ASCII 或类似的编码。

	'cpstr': 这表示代码页字符串 (Code Page String)。在早期的 Excel 文件格式中，字符串可能使用不同的代码页来编码。'cpstr' 会根据当前的代码页来解析字符串。

	'wstr': 这表示宽字符 (Wide String)，即 Unicode 字符串。在 Excel 中，这种编码通常用于支持国际化和多语言文本。
 * @param blob 
 * @param length 
 * @returns 
 */
export function parseShortXLUnicodeString(blob: CustomCFB$Blob, length: number, options?: any) {
	const cch = blob.read_shift(options && options.biff >= 12 ? 2 : 1);   // cch -> count of characters
	let encoding = 'sbcs-cont';
	const codepage = currentCodepage;
	if(options && options.biff >= 8) currentCodepage = 1200;
	if(!options || options.biff == 8 ) {
		const fHighByte = blob.read_shift(1);
		if(fHighByte) { 
            encoding = 'dbcs-cont'; 
        }
	} else if(options.biff == 12) {
		encoding = 'wstr';
	}
	if(options && options.biff >= 2 && options.biff <= 5) encoding = 'cpstr';
	// const str = cch ? blob.read_shift(cch, encoding) : "";

	let str = '';
	if(cch) {
		// str = customCfbJS.read_shift(cch, encoding);

		// str = xlsx.CFB.utils.ReadShift(cch, encoding)
		str = blob.read_shift(cch, encoding)

		blob.l = blob.l + cch;
	}
	
	currentCodepage = codepage;
	return str;
}



interface XLUnicodeRichExtendedStringResult {

}

// TODO: cfb read_shift 不完全，要看下怎么补回xlsx里的那些代码
/* 2.5.293 XLUnicodeRichExtendedString */
export function parseXLUnicodeRichExtendedString(blob: CustomCFB$Blob) {
	let codepage = currentCodepage;
	currentCodepage = 1200;
	const cch = blob.read_shift(2);
	const flags = blob.read_shift(1);
	let /*fHighByte = flags & 0x1,*/ fExtSt = flags & 0x4, fRichSt = flags & 0x8;
	let width = 1 + (flags & 0x1); // 0x0 -> utf8, 0x1 -> dbcs   // 拿第1位的数据  fHighByte
	let cRun = 0, cbExtRst;
	let z = {
		t: '',
		raw: '',
		r: ''
	};
	if(fRichSt) cRun = blob.read_shift(2);
	if(fExtSt) cbExtRst = blob.read_shift(4);
	const encoding = width == 2 ? 'dbcs-cont' : 'sbcs-cont';
	const msg = cch === 0 ? "" : blob.read_shift(cch, encoding);
	if(fRichSt) blob.l += 4 * cRun; //TODO: parse this
	if(fExtSt) blob.l += cbExtRst; //TODO: parse this
	z.t = msg;
	if(!fRichSt) { 
		z.raw = "<t>" + z.t + "</t>"; 
		z.r = z.t; 
	}
	currentCodepage = codepage;
	return z;
}

function parseUInt16(blob: CustomCFB$Blob) { 
	return blob.read_shift(2, 'u'); 
}


function parseSlurp(blob: CustomCFB$Blob, length: number, cb: any) {
	const arr = [];
	const target = blob.l + length;
	while(blob.l < target) {
		arr.push(cb(blob, target - blob.l));
	}
	if(target !== blob.l) throw new Error("Slurp error");
	return arr;
}


function parseUInt16a(blob: CustomCFB$Blob, length: number) { 
	return parseSlurp(blob, length, parseUInt16);
}


function slurp(blob: any, length: number, record: XLSRecord){
	const data = blob.slice(blob.l, blob.l + length);
	blob.l += length;
	CFB.utils.prep_blob(data, 0);
	if(!record || !record.func) {  // TODO: 想想这些没有func的要怎么处理
		return {};
	}
	const result = record.func(data, length);
	return result;
}

interface Workbook {
	sheetNames: string[];
	date1904: boolean;
	// country: string;
	worksheet: Record<string, any>;
	// worksheetClass: Record<string, any>;
	wordsheets: any[];
	refreshAll?: boolean;
	calcCount?: number;
	calcDelta?: boolean;
	calcIter?: boolean;
	calcMode?: number;
	calcPrecision?: number;
	calcSaveRecalc?: boolean;
	calcRefMode?: boolean;
	fullCalc?: boolean;
	country: string[];
	dimensions: Record<string, any>[]
	// dimensions?: any[]
	rows: Record<string, any>[],
	RRTabId: [];
	LabelSst: Record<string, any>[],
	XF: Record<string, any>[],
	Font: Record<string, any>[],
}

class Worksheet {
	constructor() {
	}
}

/**
 * @desc record [type, size, data]
 * @param blob 
 * @param options 
 */
// export function parseWorkbook(blob: CustomCFB$Blob, options?: any){
export async function parseWorkbook(blob: any, options?: any){

	const worksheet = new Worksheet();

	const workbook: Workbook = {
		sheetNames: [],
		date1904: false,
		// country: '',
		wordsheets: [],
		worksheet: {},
		country: [],
		dimensions: [],
		rows: [],
		RRTabId: [],
		LabelSst: [],
		XF: [],
		Font: [],
		// worksheetClass: worksheet
	}
 


	let recordTypeList = [];
    while (blob.l < blob.length - 1) {
        const recordType = blob.read_shift(2);
		recordTypeList.push(recordType)
        const size = blob.read_shift(2);
        const record = XLSRECORDENUM[recordType];
		// console.log('------->xxx', blob.l , recordType, size)
		let value;
		let range;
		let sst;
		let labelSst;
		value = slurp(blob, size, record)

        if(record?.func) {

            switch (recordType) {
                case 0x0085:   // BoundSheet8
					// console.log('value-->123', value)
					workbook.sheetNames.push(value)
					workbook.worksheet[value.stName] = value
                    break;
				case 0x0022:
					workbook.date1904 = value;
					break;
				case 0x0000: 
				case 0x0200:   /* Dimensions */
					console.log('value-->range', value)
					workbook.dimensions.push(value)
					break;
				case 0x00fc:   /* SST */
					console.log('value-->sst', value)
					sst = value;
					workbook.wordsheets.push(value)
					break;
				case 0x00fd:   /* LabelSst */
					console.log('value-->sst', value)
					labelSst = value;
					workbook.LabelSst.push(value)
					break;
				case 0x00e0:   /* xf */
					console.log('value-->xf', value)
					// labelSst = value;
					// workbook.XF.push(value)
					break;
				case 0x0031:   /* font */
					console.log('value-->font', value)
					// labelSst = value;
					// workbook.Font.push(value)
					break;
				case 0x0208: /* Row */
					workbook.rows.push(value)
					break;
				case 0x008c: /* Country */
					workbook.country = value;
					break;
				case 0x020B: /* Index */
					break;
				case 0x013d: /* RRTabId */
					workbook.RRTabId = value;
					break;
					
                default:
                    break;
            }
        }
		// console.log('value-->', value)

    }
	console.log('workbook-->', JSON.stringify(workbook))
}