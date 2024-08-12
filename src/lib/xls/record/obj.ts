import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';
import { getBit, getBitSlice } from '../../../util/index';

/**
 * @desc [MS-XLS] 2.4.107
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5d981e62-9e25-490a-9a75-b177373e2d79
 * @param blob 
 * @param length 
 * @returns 
 */

export function parseObj(blob: CustomCFB$Blob, length: number, options?: any){
	// if(options && options.biff < 8) return parse_BIFF5Obj(blob, length, options);
	const cmo = parseFtCmo(blob, 22); // id, ot, flags
	// const fts = parseFtArray(blob, length-22, cmo.ot);
    const fts = parseFtArray(blob, length-22);
	return { cmo: cmo, ft:fts };
}

/* [MS-XLS] 2.5.143 */
function parseFtCmo(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;
	const ot = blob.read_shift(2);
	const id = blob.read_shift(2);
	const flags = blob.read_shift(2);
	blob.l+=12;
	return {id, ot, flags};
}
function parse_FtSkip(blob: CustomCFB$Blob, length?: number) { 
    blob.l += 2;  // ft
    blob.l += blob.read_shift(2);  // cb
}

/* [MS-XLS] 2.5.142 */
function parse_FtCf(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;
    const cf = blob.read_shift(2);
	// blob.cf = cf;
	return {cf};
}
/* [MS-XLS] 2.5.149 */
function parse_FtNts(blob: CustomCFB$Blob, length?: number) {
	blob.l += 4;
	blob.l += 16; // GUID TODO
	const fSharedNote = blob.read_shift(2);
	blob.l += 4;
	return {fSharedNote};
}


interface FtTabEnum {
	[key: number]: (blob: CustomCFB$Blob, length?: number) => any
}

const FtTab: FtTabEnum = {
    0x00: parse_FtSkip,      /* FtEnd */
    0x04: parse_FtSkip,      /* FtMacro */
    0x05: parse_FtSkip,      /* FtButton */
    0x06: parse_FtSkip,      /* FtGmo */
    0x07: parse_FtCf,        /* FtCf */
    0x08: parse_FtSkip,      /* FtPioGrbit */
    0x09: parse_FtSkip,      /* FtPictFmla */
    0x0A: parse_FtSkip,      /* FtCbls */
    0x0B: parse_FtSkip,      /* FtRbo */
    0x0C: parse_FtSkip,      /* FtSbs */
    0x0D: parse_FtNts,       /* FtNts */
    0x0E: parse_FtSkip,      /* FtSbsFmla */
    0x0F: parse_FtSkip,      /* FtGboData */
    0x10: parse_FtSkip,      /* FtEdoData */
    0x11: parse_FtSkip,      /* FtRboData */
    0x12: parse_FtSkip,      /* FtCblsData */
    0x13: parse_FtSkip,      /* FtLbsData */
    0x14: parse_FtSkip,      /* FtCblsFmla */
    0x15: parseFtCmo
};

function parseFtArray(blob: CustomCFB$Blob, length: number) {
	var tgt = blob.l + length;
	var fts = [];
	while(blob.l < tgt) {
		var ft = blob.read_shift(2);
		blob.l-=2;
		try {
			fts.push(FtTab[ft](blob, tgt - blob.l));
		} catch(e) { blob.l = tgt; return fts; }
	}
	if(blob.l != tgt) blob.l = tgt; //throw new Error("bad Object Ft-sequence");
	return fts;
}