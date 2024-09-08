import XLSX from 'xlsx';
import { CustomCFB$Blob } from '../../../util/type';

const { CFB } = XLSX;
/**
 * @desc [MS-XLS] 2.4.345 Window1
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5e7b0663-0af0-4ff5-83fb-b3c42a7ed54f
 *
 * [61, 18, content]  61-> 0x003d
 * xWn (2 bytes)
 * yWn (2 bytes)
 * dxWn (2 bytes)
 * dyWn (2 bytes)
 * A - fHidden (1 bit)
 * B - fIconic (1 bit)
 * C - fVeryHidden (1 bit)
 * D - fDspHScroll (1 bit)
 * E - fDspVScroll (1 bit)
 * F - fBotAdornment (1 bit)
 * G - fNoAFDateGroup (1 bit)
 * reserved (9 bits)
 * itabCur (2 bytes)
 * itabFirst (2 bytes)
 * ctabSel (2 bytes)
 * wTabRatio (2 bytes)
 *
 *
 * @param blob
 * @param length (18 bytes)
 * @returns
 */
export function parseWindow1(blob: CustomCFB$Blob, length: number) {
  const xWn = blob.read_shift(2);
  const yWn = blob.read_shift(2);
  const dxWn = blob.read_shift(2);
  const dyWn = blob.read_shift(2);
  const flags = blob.read_shift(2);
  const iTabCur = blob.read_shift(2); // sheetBound8的下标，从0开始
  const iTabFirst = blob.read_shift(2);
  const cTabSel = blob.read_shift(2);
  const wTabRatio = blob.read_shift(2);
  return {
    pos: [xWn, yWn],
    dim: [dxWn, dyWn],
    flags: flags,
    curTab: iTabCur,
    firstTab: iTabFirst,
    selected: cTabSel,
    tabRatio: wTabRatio,
  };
}

export function writeWindow1() {
  const size = 18;
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  CFB.utils.prep_blob(newBlob, 0);
  newBlob.write_shift(2, 0); // xWn
  newBlob.write_shift(2, 0); // yWn
  newBlob.write_shift(2, 0x7260); // dxWn
  newBlob.write_shift(2, 0x44c0); // dyWn
  newBlob.write_shift(2, 0x38); //
  newBlob.write_shift(2, 0); // itabCur
  newBlob.write_shift(2, 0); // itabFirst
  newBlob.write_shift(2, 1); // ctabSel
  newBlob.write_shift(2, 0x01f4); // wTabRatio
  return newBlob;
}
