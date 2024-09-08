import { CustomCFB$Blob } from '../../../util/type';
import { parseShortXLUnicodeString } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.28 BoundSheet8
 * BoundSheet8 [(0x8500)133 20]
 * lbPlyPos(4 byte) (A - hsState (2 bits) unused (6 bits))(1 byte)   dt (8 bits)(1 byte)  剩下14 byte 都是 stName
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/b9ec509a-235d-424e-871d-f8e721106501
 * @param blob
 * @param length
 * @param opts
 * @returns
 */
export function parseBoundSheet8(blob: CustomCFB$Blob, length: number, options: any) {
  const lbPlyPos = blob.read_shift(4);
  const hsState = blob.read_shift(1) & 0x03; // 2位  hsState: 0 可见   hsState: 1 隐藏
  let dt = blob.read_shift(1);
  // eslint-disable-next-line default-case
  switch (dt) {
    case 0: dt = 'Worksheet'; break;
    case 1: dt = 'Macrosheet'; break;
    case 2: dt = 'Chartsheet'; break;
    case 6: dt = 'VBAModule'; break;
  }
  let stName = parseShortXLUnicodeString(blob, 0, options);
  if (stName?.length === 0) stName = 'Sheet1';
  return {
    pos: lbPlyPos,
    hiddenState: hsState,
    dt: dt,
    sheetName: stName,
  };
}

export function writeBoundSheet8(data: any, opts: any) {
  const width = 2;
  const newBlob = Buffer.alloc(8 + width * data.sheetName.length) as CustomCFB$Blob;
  newBlob.write_shift(4, data.pos);
  newBlob.write_shift(1, data.hiddenState || 0);
  newBlob.write_shift(1, data.dt);
  newBlob.write_shift(1, data.sheetName.length);
  newBlob.write_shift(1, 1); // fHighByte
  newBlob.write_shift(width * data.sheetName.length, data.sheetName, opts.biff < 8 ? 'sbcs' : 'utf16le'); // 为什么不是 encoding = 'dbcs-cont';
  const out = newBlob.slice(0, newBlob.l) as CustomCFB$Blob;
  out.l = newBlob.l;
  return out;
}
