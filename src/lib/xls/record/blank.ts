import { CustomCFB$Blob } from '../../../util/type';

export function parseBlank(blob: CustomCFB$Blob, length: number) {
    const cell = parseCell(blob);
    return {cell: cell}
}

function parseCell(blob: CustomCFB$Blob){
    const rw = blob.read_shift(2);
	const col = blob.read_shift(2);
    const ixfe = blob.read_shift(2);
    return {row: rw, col: col, indexOfXFCell: ixfe}
}