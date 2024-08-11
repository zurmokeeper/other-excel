import { CustomCFB$Blob } from '../../../util/type';
import { getBit, getBitSlice } from '../../../util/index';

/**
 * @desc [MS-XLS] 3.9.34
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/673697da-fb33-41d4-b497-418fdb316c1e
 * 
 * 
 * @param blob 
 * @param length 
 * @returns 
 */

export function parseRK(blob: CustomCFB$Blob, length: number){
	const rw = blob.read_shift(2);
    const col = blob.read_shift(2);
	const rkrec = parseRkRec(blob);
	return {row:rw, col:col, ixfe:rkrec[0], rknum:rkrec[1]};
}

function parseRkRec(blob: CustomCFB$Blob, length?: number){
    const ixfe = blob.read_shift(2);
	const RK = parseRkNumber(blob); // 4 byte
    return [ixfe, RK];
}

// function read_double_le(b: any, idx: number) {
// 	var s = 1 - 2 * (b[idx + 7] >>> 7);
// 	var e = ((b[idx + 7] & 0x7f) << 4) + ((b[idx + 6] >>> 4) & 0x0f);
// 	var m = (b[idx+6]&0x0f);
// 	for(var i = 5; i >= 0; --i) m = m * 256 + b[idx + i];
// 	if(e == 0x7ff) return m == 0 ? (s * Infinity) : NaN;
// 	if(e == 0) e = -1022;
// 	else { e -= 1023; m += Math.pow(2,52); }
// 	return s * Math.pow(2, e - 52) * m;
// }
// const ___double = function(b: any, idx: number) { return read_double_le(b, idx);};
// const __double = ___double;

// const __readInt32LE = function(b: any, idx: number) { return (b[idx+3]<<24)|(b[idx+2]<<16)|(b[idx+1]<<8)|b[idx]; };

function parseRkNumber(blob: CustomCFB$Blob, length?: number){

    const data = blob.slice(blob.l, blob.l + 4);
    const buffer = blob.read_shift(4);
    const fX100 = getBit(buffer, 0);
    const fInt = getBit(buffer, 1);
    let RK;
    if(fInt === 0 ) {
        let bufferData = Buffer.from([0, 0, 0, 0, (data[0] & 0xFC), data[1], data[2], data[3]]);
        RK = bufferData.readDoubleLE(0);
        // RK = __double([0, 0, 0, 0, (data[0] & 0xFC), data[1], data[2], data[3]], 0)
    } else {  // 1
        RK = getBitSlice(buffer, 2, 32)
        // RK = __readInt32LE(b, 0) >> 2
    }
    return fX100 ? (RK / 100) : RK;
}