import { CustomCFB$Blob, SSTValueType, StrsType } from '../../../util/type';
import { parseXLUnicodeRichExtendedString } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.4.265  SST Shared String Table
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/b6231b92-d32e-4626-badd-c3310a672bab
 *
 * Strings: [ { t: '阿萨德', raw: '<t>阿萨德</t>', r: '阿萨德' }, Count: 1, Unique: 1 ],
 *
 * SST 记录指定字符串常量 只有1个
 * sst -> shared string table(共享字符串表) 就是excel里字符不是每一个都是直接存，而同一个字符只存一次，其他通过引用的方法去关联，
 * SST 包括中文字符和英文字符， 数字除外，数字有专门的表示 RK
 *
 * cstTotal -> count of shared string table SST出现的总数量（包括所有的sheet）
 * cstUnique -> 去重以后的SST出现的总数量
 *
 * Record Data — BIFF8
    Offset		Name		Size		Contents
    --------------------------------------------
    4 			  cstTotal 	4 			Total number of strings in the shared string table and
                                extended string table ( EXTSST record)
    8 			  cstUnique 	4 		Number of unique strings in the shared string table
    12 			  rgb 		var 		  Array of unique unicode strings (XLUnicodeRichExtendedString).
 *
 * @param blob
 * @param length
 * @returns
 */
export function parseSST(blob: CustomCFB$Blob, length: number) {
  const end = blob.l + length;
  const cstTotal = blob.read_shift(4);
  const cstUnique = blob.read_shift(4);

  const strs : StrsType[] = [];
  for (let i = 0; i !== cstUnique && blob.l < end; ++i) {
    strs.push(parseXLUnicodeRichExtendedString(blob));
  }
  const output: SSTValueType = {
    strs: [],
    count: 0,
    uniqueCount: 0,
  };
  output.strs = strs;
  output.count = cstTotal;
  output.uniqueCount = cstUnique;
  return output;
}

export function writeSST(data: any) {
  const size = 8;
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  newBlob.write_shift(4, data.count);
  newBlob.write_shift(4, data.uniqueCount);
  const strs = [];
  for (let j = 0; j < data.length; ++j) {
    strs[j] = writeXLUnicodeRichExtendedString(data[j]);
  }
  return Buffer.concat([newBlob as Buffer, ...strs]);
}

function writeXLUnicodeRichExtendedString(xlstr: any) {
  const str = (xlstr.t || '');
  const nfmts = 1;

  const hdr = Buffer.alloc(3 + (nfmts > 1 ? 2 : 0)) as CustomCFB$Blob;
  hdr.write_shift(2, str.length);
  hdr.write_shift(1, (nfmts > 1 ? 0x08 : 0x00) | 0x01);
  if (nfmts > 1) hdr.write_shift(2, nfmts);

  const otext = Buffer.alloc(2 * str.length) as CustomCFB$Blob;
  otext.write_shift(2 * str.length, str, 'utf16le');

  const out = Buffer.concat([hdr as Buffer, otext as Buffer]);
  return out;
}
