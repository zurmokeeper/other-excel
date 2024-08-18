
import {Cell, CellValueType} from './type';

// 获取某一个bit 位的值
export const getBit = (bits: number, i: number) => (bits & (1 << i)) >> i;
export const getBitSlice = (bits: number, i: number, w: number) => (bits & ((2 ** w - 1) << i)) >> i;

export function decodeCell(str: string) {
	let row = 0, col = 0;
	for(let i = 0; i < str.length; ++i) {
		const code = str.charCodeAt(i);
		if(code >= 48 && code <= 57) {
            row = 10 * row + (code - 48);
        }else if(code >= 65 && code <= 90) {
            col = 26 * col + (code - 64);
        }
	}
    if(row < 0 || col < 0) throw new Error('str 格式异常，请输入正确的格式')
	return { col: col - 1, row: row - 1 };
}

export function encodeCell(row: number, col: number) {
	col = col + 1;
	let str = "";
	for(; col; col=((col-1)/26)|0) str = String.fromCharCode(((col-1)%26) + 65) + str;
	return str + (row + 1);
}

export function buildCell(cell: { row: number, col: number, type: CellValueType, text: string | number }) : Cell {
	const address = encodeCell(cell.row, cell.col);
	const value = {value: cell.text};
	const data = {address, ...cell, value};
	return data;
}
