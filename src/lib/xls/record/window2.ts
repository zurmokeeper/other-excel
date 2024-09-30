import { CustomCFB$Blob } from '../../../util/type';
import { newCFBBuffer } from '../../../util/index';

/**
 * @desc [MS-XLS] 2.4.346 Window2
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5e7b0663-0af0-4ff5-83fb-b3c42a7ed54f
 *
 * [61, 18, content]  61-> 0x003d
 *
 *
 * @param blob
 * @param length (18 bytes)
 * @returns
 */
export function parseWindow2(blob: CustomCFB$Blob, length: number) {
  const flags = blob.read_shift(2);
  return { RTL: flags & 0x40 }; // fDspGuts
}

export function writeWindow2(view: any) {
  const size = 18;
  const newBlob = newCFBBuffer(size);
  let flags = 0x6b6;
  if (view && view.RTL) flags |= 0x40;
  newBlob.write_shift(2, 0);
  newBlob.write_shift(2, flags);
  newBlob.write_shift(2, 64);
  newBlob.write_shift(2, 0);
  newBlob.write_shift(2, 0);
  return newBlob;
}
