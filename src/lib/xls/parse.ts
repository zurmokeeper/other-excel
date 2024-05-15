
import * as CFB from 'cfb';
import * as fs from 'fs';
import { CountryCodeEnum } from '../../util/enum';

/**
 * @desc cfb blob.l  未加定义，手动加上
 */
type CustomCFB$Blob = CFB.CFB$Blob & {l: number, read_shift(num: number, encoding?: string): any}

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
	0x008c: {func: parseCountry },
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
function parseShortXLUnicodeString(blob: CustomCFB$Blob, length: number, options: any) {
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
	const str = cch ? blob.read_shift(cch, encoding) : "";
	currentCodepage = codepage;
	return str;
}

/**
 * @desc [MS-XLS] 2.4.21 
 * @param blob 
 * @param length 
 * @returns 
 */
// function parseBOF(blob: CFB.CFB$Blob, length){
function parseBOF(blob: CustomCFB$Blob, length: number){
	const o = {BIFFVer: 0, dt: 0};
	o.BIFFVer = blob.read_shift(2); 
    length -= 2;
	if(length >= 2) { 
		// 0x0005  Specifies the workbook substream.
		// 0x0010  Specifies the dialog sheet substream or the worksheet substream.
		// 0x0020  Specifies the chart sheet substream.
		// 0x0040  Specifies the macro sheet substream.
		o.dt = blob.read_shift(2); 
		blob.l -= 2; 
	}
	switch(o.BIFFVer) {
		case 0x0600: /* BIFF8 */
		case 0x0500: /* BIFF5 */
		case 0x0400: /* BIFF4 */
		case 0x0300: /* BIFF3 */
		case 0x0200: /* BIFF2 */
		case 0x0002: 
		case 0x0007: /* BIFF2 */
			break;
		default: if(length > 6) throw new Error("Unexpected BIFF Ver " + o.BIFFVer);
	}

	blob.read_shift(length);
	return o;
}

/**
 * @desc [MS-XLS] 2.4.28
 * @param blob 
 * @param length 
 * @param opts 
 * @returns 
 */
function parseBoundSheet8(blob: CustomCFB$Blob, length: number, options: any) {
	const lbPlyPos = blob.read_shift(4);
	const hsState = blob.read_shift(1) & 0x03;   // 2位  hsState: 0 可见   hsState: 1 隐藏
	let dt = blob.read_shift(1);
	switch(dt) {
		case 0: dt = 'Worksheet'; break;
		case 1: dt = 'Macrosheet'; break;
		case 2: dt = 'Chartsheet'; break;
		case 6: dt = 'VBAModule'; break;
	}
	let stName = parseShortXLUnicodeString(blob, 0, options);
	if(stName.length === 0) stName = "Sheet1";
	return { pos: lbPlyPos, hsState: hsState, dt:dt, stName: stName };
}

interface XLUnicodeRichExtendedStringResult {

}

/* 2.5.293 XLUnicodeRichExtendedString */
function parseXLUnicodeRichExtendedString(blob: CustomCFB$Blob) {
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

/**
 * @desc [MS-XLS] 2.4.265   Strings: [ { t: '阿萨德', raw: '<t>阿萨德</t>', r: '阿萨德' }, Count: 1, Unique: 1 ],
 * 
 * sst -> shared string table
 * @param blob 
 * @param length 
 * @returns 
 */
function parseSST(blob: CustomCFB$Blob, length: number) {
	const end = blob.l + length;
	// var cnt = blob.read_shift(4);
	// var ucnt = blob.read_shift(4);

	const cstTotal = blob.read_shift(4);
	const cstUnique = blob.read_shift(4);

	const strs : any = [];
	for(let i = 0; i != cstUnique && blob.l < end; ++i) {
		strs.push(parseXLUnicodeRichExtendedString(blob));
	}
	const o = {
		strs: [],
		count: 0, 
		uniqueCount: 0
	};
	o.strs = strs; 
	o.count = cstTotal; 
	o.uniqueCount = cstUnique;
	return o;
}

/** 
 * @desc  [MS-XLS] 2.4.63 
 * @param blob 
 * @returns 
 */
function parseCountry(blob: CustomCFB$Blob) {
	let o: string[] = [], countryCode: number = 1;
	countryCode = blob.read_shift(2); // iCountryDef
	o[0] = CountryCodeEnum[countryCode];
	countryCode = blob.read_shift(2);  // iCountryWinIni
	o[1] = CountryCodeEnum[countryCode];
	return o;
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
}

/**
 * @desc record [type, size, data]
 * @param blob 
 * @param options 
 */
// export function parseWorkbook(blob: CustomCFB$Blob, options?: any){
export async function parseWorkbook(blob: any, options?: any){

	const workbook: Workbook = {
		sheetNames: [],
		date1904: false,
		// country: '',
		wordsheets: [],
		country: []
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
		value = slurp(blob, size, record)

        if(record?.func) {

            switch (recordType) {
                case 0x0085:   // BoundSheet8
					console.log('value-->123', value)
					workbook.sheetNames.push(value)
                    break;
				case 0x0022:
					workbook.date1904 = value;
					break;
				case 0x0000: 
				case 0x0200:   /* Dimensions */
					range = value;
					break;
				case 0x00fc:   /* SST */
					console.log('value-->sst', value)
					sst = value;
					workbook.wordsheets.push(value)
					break;
				case 0x0208: /* Row */
					break;
				case 0x008c: /* Country */
					workbook.country = value;
					break;
                default:
                    break;
            }
        }
		// console.log('value-->', value)
		console.log('workbook-->', JSON.stringify(workbook))
    }
}