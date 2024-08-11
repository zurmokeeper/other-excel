import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.168
 * cmcs (2 bytes): An unsigned integer that specifies the count of Ref8 structures. MUST be less than or equal to 1026.
 * 
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/41a3a3e7-1015-4322-8329-37dcdf41179b
 * @param length 
 * @returns 
 */

export function parseMergeCells(blob: CustomCFB$Blob, length: number, options?: any){
	let merges = [];
	let cmcs = blob.read_shift(2);
    console.log('--------->cmcs-->parseMergeCells', cmcs)
	while (cmcs--) merges.push(parseRef8U(blob,length));
	return merges;
}


function parseRef8U(blob: CustomCFB$Blob, length: number) {
	const rwFirst = blob.read_shift(2);
	const rwLast = blob.read_shift(2);
	const colFirst = blob.read_shift(2);
	const colLast = blob.read_shift(2);
	return {start:{col:colFirst, row:rwFirst}, end:{col:colLast,row:rwLast}};
}