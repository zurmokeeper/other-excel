import { CustomCFB$Blob } from '../../../util/type';
import { getBit, getBitSlice } from '../../../util/index';

/**
 * @desc [MS-XLS] 3.9.34 RK
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
	return {row:rw, col:col, ixfe:rkrec[0], rknum:rkrec[1], type: 'number'};
}

function parseRkRec(blob: CustomCFB$Blob, length?: number){
    const ixfe = blob.read_shift(2);
	const RK = parseRkNumber(blob); // 4 byte
    return [ixfe, RK];
}

function parseRkNumber(blob: CustomCFB$Blob, length?: number){

    const data = blob.slice(blob.l, blob.l + 4);
    const buffer = blob.read_shift(4);
    const fX100 = getBit(buffer, 0);
    const fInt = getBit(buffer, 1);
    let RK;
    if(fInt === 0 ) {
        const bufferData = Buffer.from([0, 0, 0, 0, (data[0] & 0xFC), data[1], data[2], data[3]]);
        RK = bufferData.readDoubleLE(0);
    } else {  // 1
        RK = getBitSlice(buffer, 2, 32)
    }
    return fX100 ? (RK / 100) : RK;
}