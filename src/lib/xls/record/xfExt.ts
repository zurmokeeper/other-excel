
import { CustomCFB$Blob } from '../../../util/type';
import { parseNoop } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.355 XFExt
 * 
 * @link  https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/8a198485-3609-4bcb-87e7-41894d48b76a
 * @returns 
 */
export function parseXFExt(blob: CustomCFB$Blob, length: number) {

    const total = blob.l + length;

    const frtHeader = blob.read_shift(12);
    const reserved1 = blob.read_shift(2);
    const ixfe = blob.read_shift(2);
    const reserved2 = blob.read_shift(2);
    let cexts = blob.read_shift(2);
    const rgExt = [];
    while(cexts-- > 0) {
        rgExt.push(parseExtProp(blob, total-blob.l));
    }

	return {ixfe, ext: rgExt};
}

/* [MS-XLS] 2.5.108 */
function parseExtProp(blob: CustomCFB$Blob, length: number) {
	const extType = blob.read_shift(2);
	const cb = blob.read_shift(2) - 4;
	const o = [extType];
	switch(extType) {
		case 0x04: case 0x05: case 0x07: case 0x08:
		case 0x09: case 0x0A: case 0x0B: case 0x0D:
			o[1] = parseFullColorExt(blob, cb); break;
		case 0x06: o[1] = parseXFExtGradient(blob, cb); break;
		case 0x0E: case 0x0F: o[1] = blob.read_shift(cb === 1 ? 1 : 2); break;
		default: throw new Error("Unrecognized ExtProp type: " + extType + " " + cb);
	}
	return o;
}

function parseXFExtGradient(blob: CustomCFB$Blob, length: number) {
	return parseNoop(blob, length);
}

type FullColorExt = {
    xclrType: number;
    nTintShade: number;
    xclrValue: number | number[] | void
}

/* 2.5.155 */
function parseFullColorExt(blob: CustomCFB$Blob, length: number) {
	const o: FullColorExt = {
        xclrType: 0,
        nTintShade: 0,
        xclrValue: 0,
    };
	o.xclrType = blob.read_shift(2);
	o.nTintShade = blob.read_shift(2);
	switch(o.xclrType) {
		case 0: blob.l += 4; break;
		case 1: o.xclrValue = parseIcvXF(blob, 4); break;
		case 2: o.xclrValue = parseLongRGBA(blob, 4); break;
		case 3: o.xclrValue = parseColorTheme(blob, 4); break;
		case 4: blob.l += 4; break;
	}
	blob.l += 8;
	return o;
}

/* 2.5.164 TODO: read 7 bits*/
function parseIcvXF(blob: CustomCFB$Blob, length: number) {
	return parseNoop(blob, length);
}

/* 2.5.178 LongRGBA */
function parseLongRGBA(blob: CustomCFB$Blob, length: number) { 
    const r = blob.read_shift(1);
    const g = blob.read_shift(1); 
    const b = blob.read_shift(1); 
    const a = blob.read_shift(1); 
    return [r,g,b,a]; 
}

/* 2.5.49 */
function parseColorTheme(blob: CustomCFB$Blob, length: number) { 
    return blob.read_shift(4); 
}