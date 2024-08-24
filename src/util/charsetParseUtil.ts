import { CustomCFB$Blob } from './type';

let currentCodepage = 1200;

/**
 * @desc [MS-XLS] 2.5.240 ShortXLUnicodeString
 *
 * 'sbcs-cont': 这表示单字节字符集 (SBCS) 连续字符串。在这种编码中，每个字符由一个字节表示，字符集通常是 ASCII 或类似的编码。

	'cpstr': 这表示代码页字符串 (Code Page String)。在早期的 Excel 文件格式中，字符串可能使用不同的代码页来编码。'cpstr' 会根据当前的代码页来解析字符串。

	'wstr': 这表示宽字符 (Wide String)，即 Unicode 字符串。在 Excel 中，这种编码通常用于支持国际化和多语言文本。
 * @param blob
 * @param length
 * @returns
 */
export function parseShortXLUnicodeString(blob: CustomCFB$Blob, length: number, options?: any) {
  const cch = blob.read_shift(options && options.biff >= 12 ? 2 : 1); // cch -> count of characters
  let encoding = 'sbcs-cont';
  const codepage = currentCodepage;
  if (options && options.biff >= 8) currentCodepage = 1200;
  if (!options || options.biff === 8) {
    const fHighByte = blob.read_shift(1);
    if (fHighByte) {
      encoding = 'dbcs-cont';
    }
  } else if (options.biff === 12) {
    encoding = 'wstr';
  }
  if (options && options.biff >= 2 && options.biff <= 5) encoding = 'cpstr';

  let str = '';
  if (cch) {
    str = blob.read_shift(cch, encoding);
    blob.l = blob.l + cch;
  }
  currentCodepage = codepage;
  return str;
}

/**
 * @desc 2.5.293 XLUnicodeRichExtendedString
 * @param blob
 * @returns
 */
export function parseXLUnicodeRichExtendedString(blob: CustomCFB$Blob) {
  const codepage = currentCodepage;
  currentCodepage = 1200;
  const cch = blob.read_shift(2);
  const flags = blob.read_shift(1);
  const fHighByte = flags & 0x1;
  const fExtSt = flags & 0x4;
  const fRichSt = flags & 0x8;
  const width = 1 + (flags & 0x1); // 0x0 -> utf8, 0x1 -> dbcs   // 拿第1位的数据  fHighByte
  let cRun = 0;
  let cbExtRst;
  const output = {
    t: '',
    raw: '',
    r: '',
  };
  if (fRichSt) cRun = blob.read_shift(2);
  if (fExtSt) cbExtRst = blob.read_shift(4);
  const encoding = width === 2 ? 'dbcs-cont' : 'sbcs-cont';
  const msg = cch === 0 ? '' : blob.read_shift(cch, encoding);
  if (fRichSt) blob.l += 4 * cRun;
  if (fExtSt) blob.l += cbExtRst;
  output.t = msg;
  if (!fRichSt) {
    output.raw = `<t>${output.t}</t>`;
    output.r = output.t;
  }
  currentCodepage = codepage;
  return output;
}

/**
 * @desc 2.5.296 XLUnicodeStringNoCch
 * @param blob
 * @param cch
 * @param options
 * @returns
 */
export function parseXLUnicodeStringNoCch(blob: CustomCFB$Blob, cch: number, options?: any) {
  let retval;
  if (options) {
    if (options.biff >= 2 && options.biff <= 5) return blob.read_shift(cch, 'cpstr');
    if (options.biff >= 12) return blob.read_shift(cch, 'dbcs-cont');
  }
  const fHighByte = blob.read_shift(1);
  if (fHighByte === 0) {
    retval = blob.read_shift(cch, 'sbcs-cont');
  } else {
    retval = blob.read_shift(cch, 'dbcs-cont');
  }
  return retval;
}

/**
 * @desc 2.5.294 XLUnicodeString
 * @param blob
 * @param length
 * @param options
 * @returns
 */
function parseXLUnicodeString(blob: CustomCFB$Blob, length: number, options?: any) {
  // const cch = blob.read_shift(2);
  const cch = blob.read_shift(options && options.biff === 2 ? 1 : 2);
  if (cch === 0) {
    blob.l++;
    return '';
  }
  return parseXLUnicodeStringNoCch(blob, cch, options);
}
/* BIFF5 override */
export function parseXLUnicodeString2(blob: CustomCFB$Blob, length: number, options?: any) {
  return parseXLUnicodeString(blob, length);
  // if(options.biff > 5) return parseXLUnicodeString(blob, length, options);
  // const cch = blob.read_shift(1);
  // if(cch === 0) {
  //     blob.l++;
  //     return "";
  // }
  // return blob.read_shift(cch, (options.biff <= 4 || !blob.lens ) ? 'cpstr' : 'sbcs-cont');
}

export function parseRef8U(blob: CustomCFB$Blob, length: number) {
  const rwFirst = blob.read_shift(2);
  const rwLast = blob.read_shift(2);
  const colFirst = blob.read_shift(2);
  const colLast = blob.read_shift(2);
  return { start: { col: colFirst, row: rwFirst }, end: { col: colLast, row: rwLast } };
}

export function parseUInt16(blob: CustomCFB$Blob, length?: number) {
  return blob.read_shift(2, 'u');
}

export function parseNoop(blob: CustomCFB$Blob, length: number) {
  blob.l += length;
}

// export function parseXnum(blob: CustomCFB$Blob, length: number) {
//   if (blob.length - blob.l < 8) throw 'XLS Xnum Buffer underflow';
//   return blob.read_shift(8, 'f');
// }
