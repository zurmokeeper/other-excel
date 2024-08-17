import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.349 WriteAccess
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/231de348-d93c-4be3-a12b-a19173a45d69
 * @param blob 
 * @param length 
 * @returns 
 */

export function parseWriteAccess(blob: CustomCFB$Blob, length: number, options?: any){
	// if(options.enc) { blob.l += length; return ""; } //TODO:
	const posItion = blob.l;
	// TODO: make sure XLUnicodeString doesnt overrun
	const userName = parseXLUnicodeString2(blob, 0, options);
	blob.read_shift(posItion + length - blob.l);  // 跳过后面的 unused (variable)
	return {userName: userName};
}