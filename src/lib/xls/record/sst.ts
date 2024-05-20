
import { CustomCFB$Blob, parseXLUnicodeRichExtendedString } from '../parse';


/**
 * @desc [MS-XLS] 2.4.265   Strings: [ { t: '阿萨德', raw: '<t>阿萨德</t>', r: '阿萨德' }, Count: 1, Unique: 1 ],
 * 
 * sst -> shared string table
 * @param blob 
 * @param length 
 * @returns 
 */
export function parseSST(blob: CustomCFB$Blob, length: number) {
	const end = blob.l + length;
	// var cnt = blob.read_shift(4);
	// var ucnt = blob.read_shift(4);

	const cstTotal = blob.read_shift(4);
	const cstUnique = blob.read_shift(4);

	const strs : any = [];
	for(let i = 0; i != cstUnique && blob.l < end; ++i) {
		strs.push(parseXLUnicodeRichExtendedString(blob));
	}
	const o = {
		strs: [],
		count: 0, 
		uniqueCount: 0
	};
	o.strs = strs; 
	o.count = cstTotal; 
	o.uniqueCount = cstUnique;
	return o;
}