import { parseShortXLUnicodeString } from '../../../util/charsetParseUtil';
import { getBit, getBitSlice } from '../../../util/index';
import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.122 Font
 *
 * size 20
 *
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/291a910c-cb69-4799-875e-a201845d4fd1
 * @param blob
 * @param length
 * @returns
 */
export function parseFont(blob: CustomCFB$Blob, length: number) {
  const dyHeight = blob.read_shift(2);

  const buffer = blob.read_shift(1);
  const unused1 = getBit(buffer, 0);
  const fItalic = getBit(buffer, 1);
  const unused2 = getBit(buffer, 2);
  const fStrikeOut = getBit(buffer, 3);
  const fOutline = getBit(buffer, 4);
  const fShadow = getBit(buffer, 5);
  const fCondense = getBit(buffer, 6);
  const fExtend = getBit(buffer, 7);

  const reserved = blob.read_shift(1);
  const icv = blob.read_shift(2);
  const bls = blob.read_shift(2);
  const sss = blob.read_shift(2);
  const uls = blob.read_shift(1);
  const bFamily = blob.read_shift(1);
  const bCharSet = blob.read_shift(1);
  const unused3 = blob.read_shift(1);

  // 剩余 6个字节
  const fontName = parseShortXLUnicodeString(blob, 0);
  return {
    dyHeight: dyHeight,
    fontName: fontName,
    fItalic,
    fStrikeOut,
    fShadow,
    fCondense,
    fExtend,
    uls,
    bCharSet,
  };
}
