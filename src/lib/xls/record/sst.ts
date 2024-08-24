
import { CustomCFB$Blob } from '../../../util/type';
import { parseXLUnicodeRichExtendedString } from '../../../util/charsetParseUtil';


/**
 * @desc [MS-XLS] 2.4.265  SST
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
 * @param blob
 * @param length
 * @returns
 */
export function parseSST(blob: CustomCFB$Blob, length: number) {
  const end = blob.l + length;
  const cstTotal = blob.read_shift(4);
  const cstUnique = blob.read_shift(4);

  const strs : any = [];
  for (let i = 0; i !== cstUnique && blob.l < end; ++i) {
    strs.push(parseXLUnicodeRichExtendedString(blob));
  }
  const output = {
    strs: [],
    count: 0,
    uniqueCount: 0,
  };
  output.strs = strs;
  output.count = cstTotal;
  output.uniqueCount = cstUnique;
  return output;
}
