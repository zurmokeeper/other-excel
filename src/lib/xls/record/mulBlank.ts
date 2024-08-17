import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.174 MulBlank
 * 
 * 
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/a9ab7fa1-183a-487c-a506-6b4a19e770be
 * @param length 
 * @returns 
 */
export function parseMulBlank(blob: CustomCFB$Blob, length: number, options: any){
    const target = blob.l + length - 2;
	const rw = blob.read_shift(2);
    const col = blob.read_shift(2);
	const ixfes = [];
	while(blob.l < target) {
        ixfes.push(blob.read_shift(2));
    }
	if(blob.l !== target) {
		throw new Error("MulBlank read error");
	}
	const lastCol = blob.read_shift(2);
	if(ixfes.length != lastCol - col + 1) {
		throw new Error("MulBlank length mismatch");
	}
	return {row:rw, col:col, lastCol: lastCol, ixfe:ixfes};
}