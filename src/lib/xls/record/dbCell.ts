import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.78 DBCell
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/e08dc762-bf8a-457c-b3ba-39055bff423a
 * @param blob
 * @param length
 * @returns
 */

export function parseDBCell(blob: CustomCFB$Blob, length: number) {
  const dbRtrw = blob.read_shift(4);
  blob.l += length - 4; // rgdb (variable)
  return { dbRtrw: dbRtrw };
}
