
import { parseBoundSheet8 } from './boundSheet';
import { parseBOF } from './bof';
import { parseSST } from './sst';
import { parseCountry } from './country';
import { parseDimensions } from './dimensions';
import { parseRow } from './row';
// import { parseIndex } from './recordIndex';
import { parseLabelSST } from './labelSst';
import { parseXF } from './xf';
import { parseFont } from './font';
import { parseRK } from './rk';
import { parseExtSST } from './extSst';
import { parseWriteAccess } from './writeAccess';
import { parseDBCell } from './dbCell';
import { parseFormat } from './format';
import { parseDefaultRowHeight } from './defaultRowHeight';
import { parseMergeCells } from './mergeCells';
import { parseBlank } from './blank';
import { parseHLink } from './hLink';
import { parseNote } from './note';


import { CustomCFB$Blob } from '../../../util/type';


function parsenoop2(blob: CustomCFB$Blob, length: number) { 
    blob.read_shift(length); 
    return null; 
}

function parseSlurp(blob: CustomCFB$Blob, length: number, cb: any) {
	const arr = [];
	const target = blob.l + length;
	while(blob.l < target) {
		arr.push(cb(blob, target - blob.l));
	}
	if(target !== blob.l) throw new Error("Slurp error");
	return arr;
}

function parseUInt16(blob: CustomCFB$Blob) { 
	return blob.read_shift(2, 'u'); 
}

function parseUInt16a(blob: CustomCFB$Blob, length: number) { 
	return parseSlurp(blob, length, parseUInt16);
}
function parseBool(blob: CustomCFB$Blob, length: number) { 
    return blob.read_shift(length) === 0x1; 
}

export {
    parseBoundSheet8,
    parseBOF,
    parseSST,
    parseCountry,
    parseDimensions,
    parseRow,
    parseLabelSST,
    parseXF,
    parseFont,
    parsenoop2,
    parseRK,
    parseExtSST,
    parseWriteAccess,
    parseUInt16a,
    parseBool,
    parseUInt16,
    parseDBCell,
    parseFormat,
    parseDefaultRowHeight,
    parseMergeCells,
    parseBlank,
    parseHLink,
    parseNote
}