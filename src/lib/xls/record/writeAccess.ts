import XLSX from 'xlsx';
import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeString2 } from '../../../util/charsetParseUtil';

const { CFB } = XLSX;

/**
 * @desc [MS-XLS] 2.4.349 WriteAccess
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/231de348-d93c-4be3-a12b-a19173a45d69
 *
 * userName (variable)
 * unused (variable)  MUST be equal to the value of the following formula: (112 – number of bytes of userName).
 *
 * @param blob
 * @param length
 * @returns
 */

export function parseWriteAccess(blob: CustomCFB$Blob, length: number, options?: any) {
  // if(options.enc) { blob.l += length; return ""; } //TODO:
  const position = blob.l;
  const userName = parseXLUnicodeString2(blob, 0, options);
  blob.read_shift(position + length - blob.l); // skip unused (variable)
  return { userName: userName };
}

// export function writeWriteAccess(content: string, options?: any) {
//   const size = 112;
//   const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
//   CFB.utils.prep_blob(newBlob, 0);
//   newBlob.write_shift(2, content.length);
//   newBlob.write_shift(1, 0); // fHighByte 0x0
//   newBlob.write_shift(4, 0x33336853);
//   newBlob.write_shift(4, (0x00534A74 | 0));
//   while (newBlob.l < newBlob.length) {
//     newBlob.write_shift(1, 0);
//     // newBlob.write_shift(1, 32); // TODO: 我看WPS写的都是0x20 啊
//   }
//   return newBlob;
// }

// 字符串 "otherExcelJS" 的 ASCII 码:

// o = 0x6F
// t = 0x74
// h = 0x68
// e = 0x65
// r = 0x72
// E = 0x45
// x = 0x78
// c = 0x63
// e = 0x65
// l = 0x6C
// J = 0x4A
// S = 0x53
export function writeWriteAccess(content: string, options?: any) {
  const size = 112;
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  CFB.utils.prep_blob(newBlob, 0);
  newBlob.write_shift(2, content.length);
  newBlob.write_shift(1, 0); // fHighByte 0x0
  newBlob.write_shift(4, 0x6568746F);
  newBlob.write_shift(4, 0x63784572);
  newBlob.write_shift(4, 0x534A6C65);
  while (newBlob.l < newBlob.length) {
    newBlob.write_shift(1, 32); // TODO: 我看WPS写的都是0x20 啊
  }
  return newBlob;
}
