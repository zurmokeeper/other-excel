
import { CustomCFB$Blob, parseShortXLUnicodeString } from '../parse';

/**
 * @desc [MS-XLS] 2.4.28
 * BoundSheet8 [(0x8500)133 20]
 * lbPlyPos(4 byte) (A - hsState (2 bits) unused (6 bits))(1 byte)   dt (8 bits)(1 byte)  剩下14 byte 都是 stName
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/b9ec509a-235d-424e-871d-f8e721106501
 * @param blob 
 * @param length 
 * @param opts 
 * @returns 
 */
export function parseBoundSheet8(blob: CustomCFB$Blob, length: number, options: any) {
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
	if(stName?.length === 0) stName = "Sheet1";
	return { pos: lbPlyPos, hsState: hsState, dt:dt, stName: stName };
	// return { pos: lbPlyPos, hiddenState: hsState, dt:dt, sheetName: stName };
}