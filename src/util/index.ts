import XLSX from 'xlsx';
import { Cell, CellValueType, CustomCFB$Blob } from './type';

const { CFB } = XLSX;

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

export function newCFBBuffer(size: number) {
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  CFB.utils.prep_blob(newBlob, 0);
  return newBlob;
}

/**
 * @desc [name, size, content]
 * @param buf
 * @param record
 * @param content
 * @param length
 */
export function writeRecord(buf: Buffer[], record: number, content?: CustomCFB$Blob, length?: number) {
  const newBlob = newCFBBuffer(4);
  newBlob.write_shift(2, record);
  let output;
  if (content) {
    newBlob.write_shift(2, content.length);
    output = Buffer.concat([newBlob as Buffer, content as Buffer]);
  } else {
    newBlob.write_shift(2, 0);
    output = Buffer.concat([newBlob as Buffer]);
  }

  buf.push(output);
}
// export function writeRecord(buf: Buffer[], record: number, content: Buffer, length?: number) {
//   const newBlob = Buffer.alloc(4);
//   newBlob.writeUint16LE(record, 0);
//   newBlob.writeUint16LE(content.length, 2);
//   const output = Buffer.concat([newBlob, content]);
//   buf.push(output);
// }

export function writeUInt16(content: number) {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(content, 0);
  return buf as CustomCFB$Blob;
}

export function writeZeroes(length: number) {
  const buf = Buffer.alloc(length);
  return buf as CustomCFB$Blob;
}

export function writeBool(content: boolean) {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(+!!content, 0);
  return buf as CustomCFB$Blob;
}

export function writeXnum(content: number) {
  const buf = newCFBBuffer(8);
  buf.write_shift(8, content, 'f');
  return buf;
}
