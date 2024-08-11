import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.107
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5d981e62-9e25-490a-9a75-b177373e2d79
 * @param blob 
 * @param length 
 * @returns 
 */

export function parseNote(blob: CustomCFB$Blob, length: number, options?: any){
	return parseNoteSh(blob, length, options);
}

/* [MS-XLS] 2.5.186 TODO: BIFF5 */
function parseNoteSh(blob: CustomCFB$Blob, length: number, options?: any) {
	if(options?.biff < 8) return;
	var row = blob.read_shift(2), col = blob.read_shift(2);
	var flags = blob.read_shift(2), idObj = blob.read_shift(2);
	var stAuthor = parseXLUnicodeString2(blob, 0, options);
	if(options?.biff < 8) blob.read_shift(1);
	return [{r:row,c:col}, stAuthor, idObj, flags];
}