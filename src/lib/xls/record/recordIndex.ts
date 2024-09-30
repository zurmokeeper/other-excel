import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.144 Index
 *
 * @link  https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/67c20922-0427-4c2d-96cc-2267d3f09e8c
 *
 * @link https://github.com/shakinm/xlsReader/blob/master/xls/record/index.go
 *
 * Excel writes an INDEX record immediately after the BOF record for each worksheet
  substream in a BIFF file. For more information about the INDEX record

  Record Data — BIFF8
  Offset		Field Name		Size		Contents
  ------------------------------------------------
  4			    (Reserved)		4			  Reserved; must be 0 (zero)
  8			    rwMic			    4			  First row that exists on the sheet
  12			  rwMac			    4			  Last row that exists on the sheet, plus 1
  16			  (Reserved)		4			  Reserved; must be 0 (zero)
  20			  rgibRw			var			  Array of file offsets to the DBCELL records for each
                                  block of ROW records. A block contains ROW records for up to 32 rows.

  Record Data — BIFF7
  Offset		Field Name		Size		Contents
  ------------------------------------------------
  4			    (Reserved)		4			  Reserved; must be 0 (zero)
  8			    rwMic			    2			  First row that exists on the sheet
  10			  rwMac			    2			  Last row that exists on the sheet, plus 1
  12			  (Reserved)		4			  Reserved; must be 0 (zero)
  16			  rgibRw			var			  Array of file offsets to the DBCELL records for each
                                  block of ROW records. A block contains ROW records for up to 32 rows.

  The rwMic field contains the number of the first row in the sheet that contains a
  value or a formula that is referenced by a cell in some other row. Because rows (and
  columns) are always stored 0-based rather than 1-based (as they appear on the
  screen), cell A1 is stored as row 0, cell A2 is row 1, and so on. The rwMac field
  contains the 0-based number of the last row in the sheet, plus 1.
 *
 * @returns
 */
export function parseIndex(blob: CustomCFB$Blob, length: number) {
  const total = blob.l + length;

  const reserved = blob.read_shift(4);
  const rowMic = blob.read_shift(4);
  const rowMac = blob.read_shift(4);
  const ibXF = blob.read_shift(4);
  const rgibRw = blob.read_shift(total - blob.l);

  return {
    rowMic, rowMac, ibXF, rgibRw,
  };
}
