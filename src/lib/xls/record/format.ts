import { CustomCFB$Blob, ParseFuncOptions } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 3.9.10 Number Formats
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/bf92a450-2adb-417f-9309-cf2a0b26af3c
 *
 * @link https://github.com/shakinm/xlsReader/blob/master/xls/record/format.go
 * The FORMAT record describes a number format in the workbook.
  All the FORMAT records should appear together in a BIFF file. The order of FORMAT
  records in an existing BIFF file should not be changed. It is possible to write custom
  number formats in a file, but they should be added at the end of the existing FORMAT
  records.

  Record Data
  Offset		Field Name		Size		Contents
  ------------------------------------------------
  4			    ifmt			    2			  Format index code (for internal use only)
  6			    cch				    2			  Length of the string
  7			    grbit			    1			  Option Flags (described in Unicode Strings in BIFF8 section)
  8			    rgb				  var			  Array of string characters

  Excel uses the ifmt structure to identify built-in formats when it reads a file that was
  created by a different localized version. For more information about built-in formats,
  see "XF".
 *
 * @param length
 * @returns
 */

export function parseFormat(blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) {
  const numFmtId = blob.read_shift(2); // ifmt
  const fmtstr = parseXLUnicodeString2(blob, 0, options); // stFormat
  return { numFmtId: numFmtId, fmtstr };
}
