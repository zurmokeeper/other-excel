import { CustomCFB$Blob } from '../../../util/type';
import { parseNoop } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.53 ColInfo
 * 
 * ColInfo 记录指定一系列列的列格式。
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/2c339a18-0819-4221-9c5d-3e9cf304224b
 * @param length 
 * @returns 
 */

export function parseColInfo(blob: CustomCFB$Blob, length: number, options: any){
	// if(!options.cellStyles) return parseNoop(blob, length);
	const size = options?.biff >= 12 ? 4 : 2;
	const colFirst = blob.read_shift(size);
	const colLast = blob.read_shift(size);
	const coldx = blob.read_shift(size);
	const ixfe = blob.read_shift(size);
	const flags = blob.read_shift(2);
	if(size == 2) blob.l += 2;
	const o = {start:colFirst, end:colLast, coldx:coldx, ixfe:ixfe, flags:flags, level: 0};
	if(options?.biff >= 5 || !options?.biff) o.level = (flags >> 8) & 0x7; //  iOutLevel 指定由 colFirst 和 colLast 定义的列范围的大纲级别。
	return o;
}