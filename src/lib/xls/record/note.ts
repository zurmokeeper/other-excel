import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';
import { getBit, getBitSlice } from '../../../util/index';

/**
 * [MS-XLS] 2.5.186
 * @param blob
 * @param length
 * @param options
 * @returns
 */
function parseNoteSh(blob: CustomCFB$Blob, length: number, options?: any) {
  if (options?.biff < 8) return;
  const row = blob.read_shift(2);
  const col = blob.read_shift(2);
  const buffer = blob.read_shift(2);

  const fShow = getBit(buffer, 1);
  const fRwHidden = getBit(buffer, 7);
  const fColHidden = getBit(buffer, 8);

  const idObj = blob.read_shift(2);
  const stAuthor = parseXLUnicodeString2(blob, 0, options);
  if (options?.biff < 8) blob.read_shift(1);
  // return [{r:row,c:col}, stAuthor, idObj, flags];
  return {
    cell: { row: row, col: col }, stAuthor, idObj, fShow, fRwHidden, fColHidden,
  };
}

/**
 * @desc [MS-XLS] 2.4.107 Note
 *
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5d981e62-9e25-490a-9a75-b177373e2d79
 * @param blob
 * @param length
 * @returns
 */

export function parseNote(blob: CustomCFB$Blob, length: number, options?: any) {
  return parseNoteSh(blob, length, options);
}
