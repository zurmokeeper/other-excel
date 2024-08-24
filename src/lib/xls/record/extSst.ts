import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.107 ExtSST
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5d981e62-9e25-490a-9a75-b177373e2d79
 * @param blob
 * @param length
 * @returns
 */

export function parseExtSST(blob: CustomCFB$Blob, length: number) {
  const dsst = blob.read_shift(2);
  // const col = blob.read_shift(2);
  blob.l += length - 2;
  return { dsst: dsst };
}
