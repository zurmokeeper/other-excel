import { CustomCFB$Blob } from '../../../util/type';

function parseCell(blob: CustomCFB$Blob) {
  const rw = blob.read_shift(2);
  const col = blob.read_shift(2);
  const ixfe = blob.read_shift(2);
  return { row: rw, col: col, ixfe: ixfe };
}

/**
 * @desc [MS-XLS] 2.4.20 Blank
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/2918f1db-545e-432a-8f57-599c44251f07
 *
 * The Blank record specifies an empty cell with no formula (section 2.2.2) or value.
 * Blank记录指定一个没有公式（第 2.2.2 节）或值的空单元格。
 *
 * @link: https://github.com/shakinm/xlsReader/blob/master/xls/record/blank.go
 *
 * The rw field contains the 0-based row number. The col field contains the 0-based column number.

  Record Data
  Offset		Name		Size		Contents
  --------------------------------------------
  4			    rw			2			Row
  6			    col			2			Column
  8			    ixfe		2			Index to the XF record
 *
 * @param blob
 * @param length
 * @returns
 */
export function parseBlank(blob: CustomCFB$Blob, length: number) {
  const cell = parseCell(blob);
  return { cell: cell };
}
