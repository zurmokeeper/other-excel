import { CustomCFB$Blob, ParseFuncOptions } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.87 DefaultRowHeight
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/407c7fd6-d378-4901-8c79-432bfe38cef9
 * @returns
 */

export function parseDefaultRowHeight(blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) {
  let f = 0;
  if (!(options && options.biffVer === 2)) {
    f = blob.read_shift(2);
  }
  let miyRw = blob.read_shift(2);
  if ((options && options.biffVer === 2)) {
    f = 1 - (miyRw >> 15);
    miyRw &= 0x7fff;
  }
  const fl = {
    fUnsynced: f & 1,
    fDyZero: (f & 2) >> 1,
    fExAsc: (f & 4) >> 2,
    fExDsc: (f & 8) >> 3,
  };
  return [fl, miyRw];
}
