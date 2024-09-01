import { CustomCFB$Blob, ParseFuncOptions } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 3.9.10 Number Formats
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/bf92a450-2adb-417f-9309-cf2a0b26af3c
 * @param length
 * @returns
 */

export function parseFormat(blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) {
  const numFmtId = blob.read_shift(2); // ifmt
  const fmtstr = parseXLUnicodeString2(blob, 0, options); // stFormat
  return { numFmtId: numFmtId, fmtstr };
}
