import { CustomCFB$Blob, ParseFuncOptions } from '../../../util/type';
import { parseUInt16, parseXLUnicodeStringNoCch } from '../../../util/charsetParseUtil';

/**
 * @desc [MS-XLS] 2.5.61 ControlInfo
 *
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/20019365-5759-4b79-bd44-a8a493b79f3b
 * @param blob
 * @param length
 * @returns
 */
function parseControlInfo(blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) {
  const flags = blob.read_shift(1);
  blob.l++;
  const accel = blob.read_shift(2);
  blob.l += 2; // skip reserved2 (2 bytes)
  return { flags, accel };
}

/**
 * @desc [MS-XLS] 2.4.329 TxO
 * The TxO record specifies the text in a text box or a form control. This record can be followed by a collection of Continue records that specifies additional feature data to complete this record, as follows:
 * TxO 记录指定文本框或表单控件中的文本。此记录后面可以跟一个 Continue 记录集合，该集合指定其他要素数据以完成此记录，如下所示：
 *
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/638c08e6-2942-4783-b71b-144ccf758fc7
 * @param blob
 * @param length
 * @returns
 */
export function parseTxO(blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) {
  const position = blob.l;
  let texts = '';
  try {
    blob.l += 4;
    // const objectType = (options.lastobj||{cmo:[0,0]}).cmo[1]; TODO:
    const objectType = 25;
    let controlInfo;
    if (![0, 5, 7, 11, 12, 14].includes(objectType)) {
      blob.l += 6; // skip reserved4 (2 bytes) + reserved5 (4 bytes)
    } else {
      controlInfo = parseControlInfo(blob, 6, options);
    }
    const cchText = blob.read_shift(2);
    const cbRuns = blob.read_shift(2);
    const ifntEmpty = parseUInt16(blob, 2);
    const objFmlaLength = blob.read_shift(2);
    blob.l += objFmlaLength; // skip objFmla
    // const fmla = parseObjFmla(blob, position + length - blob.l);

    for (let i = 1; i < blob.continuePartDataLens.length - 1; ++i) {
      if (blob.l - position !== blob.continuePartDataLens[i]) throw new Error('TxO: bad continue record');
      const hdr = blob[blob.l];
      const text = parseXLUnicodeStringNoCch(blob, blob.continuePartDataLens[i + 1] - blob.continuePartDataLens[i] - 1);
      texts += text;
      if (texts.length >= (hdr ? cchText : 2 * cchText)) break;
    }
    if (texts.length !== cchText && texts.length !== cchText * 2) {
      throw new Error(`cchText: ${cchText} != ${texts.length}`);
    }

    blob.l = position + length;
    return { text: texts };
  } catch (e) {
    blob.l = position + length;
    return { text: texts };
  }
}
