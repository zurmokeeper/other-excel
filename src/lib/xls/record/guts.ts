import { CustomCFB$Blob } from '../../../util/type';
import { newCFBBuffer } from '../../../util/index';

/**
 * @desc  [MS-XLS] 2.4.134 Guts
 * @link  https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/13b8e6ce-7463-4501-9bd3-287b04d1b54a
 * @param blob
 * @param length
 * @param options
 * @returns
 */
export function parseGuts(blob: CustomCFB$Blob, length: number) {
  //   blob.read_shift(4); // skip unused1(2 Bytes) + unused2(2 Bytes)
  blob.l += 4;
  let iLevelRwMac = blob.read_shift(2);
  let iLevelColMac = blob.read_shift(2);
  if (iLevelRwMac) iLevelRwMac--;
  if (iLevelColMac) iLevelColMac--;
  return { colOutlineLevel: iLevelColMac, rowOutlineLevel: iLevelRwMac };
}

export function writeGuts() {
  const newBlob = newCFBBuffer(8);
  newBlob.write_shift(4, 0);
  newBlob.write_shift(2, 0);
  newBlob.write_shift(2, 0);
  return newBlob;
}
