import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';
import { getBit, getBitSlice } from '../../../util/index';

/**
 * @desc [MS-XLS] 2.4.181 Obj
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/dd34df60-8250-40a9-83a3-911476a31ea7
 * @param blob 
 * @param length 
 * @returns 
 */

export function parseObj(blob: CustomCFB$Blob, length: number, options?: any){
	// if(options && options.biff < 8) return parseBIFF5Obj(blob, length, options);
	const cmo = parseFtCmo(blob, 22); // id, ot, flags
	// const fts = parseFtArray(blob, length-22, cmo.ot);
    const fts = parseFtArray(blob, length - 22);
	return { cmo: cmo, ft:fts };
}

/**
 * @desc [MS-XLS] 2.5.143 FtCmo
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/29161566-5018-4356-8d25-50e6674c66fa
 * @param blob 
 * @param length 
 * @returns 
 */
function parseFtCmo(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;  // skip ft (2 bytes) and cb (2 bytes)
	const ot = blob.read_shift(2);
	const id = blob.read_shift(2);
	const flags = blob.read_shift(2);
	blob.l += 12; // skip 12(12 bytes)
	return {id, objectType: ot, flags};
}
function parseFtSkip(blob: CustomCFB$Blob, length?: number) { 
    blob.l += 2;  // ft
    blob.l += blob.read_shift(2);
}

/* [MS-XLS] 2.5.142 */
function parseFtCf(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;
    const cf = blob.read_shift(2);
	// blob.cf = cf;
	return {cf};
}

/**
 * @desc [MS-XLS] 2.5.149 FtNts -> Ft Note ts
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/b0991167-6b90-4e6f-910b-8c153a7e0f87
 * @param blob 
 * @param length 
 * @returns 
 */
function parseFtNts(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;  // skip ft (2 bytes) and cb (2 bytes)
	blob.l += 16; // GUID TODO:
	const fSharedNote = blob.read_shift(2);
	blob.l += 4;  // skip unused (4 bytes)
	return {fSharedNote};
}


interface FtTabEnum {
	[key: number]: (blob: CustomCFB$Blob, length?: number) => any
}

const FtTab: FtTabEnum = {
    0x00: parseFtSkip,      /* FtEnd */
    0x04: parseFtSkip,      /* FtMacro */
    0x05: parseFtSkip,      /* FtButton */
    0x06: parseFtSkip,      /* FtGmo */
    0x07: parseFtCf,        /* FtCf */
    0x08: parseFtSkip,      /* FtPioGrbit */
    0x09: parseFtSkip,      /* FtPictFmla */
    0x0A: parseFtSkip,      /* FtCbls */
    0x0B: parseFtSkip,      /* FtRbo */
    0x0C: parseFtSkip,      /* FtSbs */
    0x0D: parseFtNts,       /* FtNts */
    0x0E: parseFtSkip,      /* FtSbsFmla */
    0x0F: parseFtSkip,      /* FtGboData */
    0x10: parseFtSkip,      /* FtEdoData */
    0x11: parseFtSkip,      /* FtRboData */
    0x12: parseFtSkip,      /* FtCblsData */
    0x13: parseFtSkip,      /* FtLbsData */
    0x14: parseFtSkip,      /* FtCblsFmla */
    0x15: parseFtCmo
};

function parseFtArray(blob: CustomCFB$Blob, length: number) {
	const endLength = blob.l + length;
	const fts = [];
	while(blob.l < endLength) {
		const ft = blob.read_shift(2);
		blob.l -= 2;
		try {
			fts.push(FtTab[ft](blob, endLength - blob.l));
		} catch(e) {  // TODO:
			blob.l = endLength; 
			return fts; 
		}
	}
	if(blob.l != endLength) blob.l = endLength; //throw new Error("bad Object Ft-sequence");
	return fts;
}