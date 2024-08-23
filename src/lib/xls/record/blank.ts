import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.20 Blank
 * The Blank record specifies an empty cell with no formula (section 2.2.2) or value.
 * Blank记录指定一个没有公式（第 2.2.2 节）或值的空单元格。
 * 
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/2918f1db-545e-432a-8f57-599c44251f07
 * @param blob 
 * @param length 
 * @returns 
 */
export function parseBlank(blob: CustomCFB$Blob, length: number) {
    const cell = parseCell(blob);
    return {cell: cell};
}

function parseCell(blob: CustomCFB$Blob) {
    const rw = blob.read_shift(2);
	const col = blob.read_shift(2);
    const ixfe = blob.read_shift(2);
    return {row: rw, col: col, ixfe: ixfe};
}