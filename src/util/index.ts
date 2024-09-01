import { Cell, CellValueType } from './type';

/**
 * @desc 获取某一个bit 位的值
 * @param bits decimal number
 * @param i The first digit, starting from 0, with 0 indicating the first digit
 * @returns
 */
export const getBit = (bits: number, i: number) => (bits & (1 << i)) >> i;

/**
 * @desc 获取连续几个bit 位的值  getBitSlice(10, 0, 4)
 * Indicates the value expressed by taking the first to the fourth digit, a total of four digits.
 *
 * @param bits decimal number
 * @param i The first digit, starting from 0, with 0 indicating the first digit
 * @param w 长度
 * @returns
 */
export const getBitSlice = (bits: number, i: number, w: number) => (bits & ((2 ** w - 1) << i)) >> i;

/**
 * decodeCell(A) -> {row: col: 0}
 * @param str A
 * @returns
 */
export function decodeCell(str: string) {
  let row = 0;
  let col = 0;
  for (let i = 0; i < str.length; ++i) {
    const code = str.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      row = 10 * row + (code - 48);
    } else if (code >= 65 && code <= 90) {
      col = 26 * col + (code - 64);
    }
  }
  if (row < 0 || col < 0) throw new Error('Abnormal parameter format, please enter the correct format.');
  return { col: col - 1, row: row - 1 };
}

export function encodeCell(row: number, col: number) {
  col = col + 1;
  let str = '';
  for (; col; col = ((col - 1) / 26) | 0) str = String.fromCharCode(((col - 1) % 26) + 65) + str;
  return str + (row + 1);
}

export function buildCell(cell: { row: number, col: number, type: CellValueType, text: string | number }) : Cell {
  const address = encodeCell(cell.row, cell.col);
  const value = { value: cell.text };
  const data = { address, ...cell, value };
  return data;
}
