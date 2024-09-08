import XLSX from 'xlsx';
import { CustomCFB$Blob } from '../../../util/type';
import { getBit, getBitSlice } from '../../../util/index';

const { CFB } = XLSX;

/**
 * @desc [MS-XLS] 2.4.353 XF
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/993d15c4-ec04-43e9-ba36-594dfb336c6d
 *
 * The XF record specifies formatting properties for a cell or a cell style.
 * XF 记录指定单元格或单元格样式的格式属性。
 *
 * 单元格 XF 由 XF 记录（第 2.4.353 节）（和可选的 XFExt 记录（第 2.4.355 节））指定，其中 XF 记录（第 2.4.353 节）的 fStyle 字段等于 0。
 * 每个单元格必须引用一个单元格 XF。这些记录为引用它们的单元格指定了完整的格式属性集。
 *
 * ifnt (2 bytes): A FontIndex structure that specifies a Font record.
 * IFNT（2 字节）： 一个 FontIndex 结构，该结构指定 Font 记录。
 *
 * ifmt (2 bytes): An IFmt structure that specifies a number format identifier.
 * ifmt（2 字节）： 一个 IFmt 结构，该结构指定数字格式标识符。
 *
 * A - fLocked (1 bit): A bit that specifies whether the locked protection property is set to true.
 * A - fLocked（1 位）： 指定是否将锁定的保护属性设置为 true 的位。
 *
 * B - fHidden (1 bit): A bit that specifies whether the hidden protection property is set to true.
 * B - fHidden（1 位）： 指定是否将隐藏的保护属性设置为 true 的位。
 *
 * C - fStyle (1 bit): A bit that specifies whether this record specifies a cell XF or a cell style XF. If the value is 1, this record specifies a cell style XF.
 * C - fStyle（1 位）： 指定此记录是指定单元格 XF 还是单元格样式 XF 的位。如果值为 1，则此记录指定单元格样式 XF。
 *
 * D - f123Prefix (1 bit): A bit that specifies whether prefix characters are present in the cell.
 * The possible prefix characters are single quote (0x27), double quote (0x22), caret (0x5E),
 * and backslash (0x5C).<146> If fStyle equals 1, this field MUST equal 0.
 *
 * D - f123前缀（1 位）： 指定单元格中是否存在前缀字符的位。可能的前缀字符为单引号 （0x27）、
 * 双引号 （0x22）、插入符号 （0x5E） 和反斜杠 （0x5C）。<146> 如果 fStyle 等于 1，则此字段必须等于 0。
 *
 *
 * ixfParent (12 bits): An unsigned integer that specifies the zero-based index of a cell style XF record
 * in the collection of XF records in the Globals Substream that this cell format inherits properties from.
 * Cell style XF records are the subset of XF records with an fStyle field equal to 1.
 * See XFIndex for more information about the organization of XF records in the file.
 *
 * ixfParent（12 位）： 一个无符号整数，指定此单元格格式从中继承属性的 Globals 子流中的 XF 记录集合中单元格样式
 * XF 记录的从零开始的索引。单元格样式 XF 记录是 fStyle 字段等于 1 的 XF 记录的子集。
 * 有关文件中 XF 记录组织的更多信息，请参见 XFIndex。
 *
 * If fStyle equals 1, this field SHOULD equal 0xFFF, indicating there is no inheritance from a cell style XF. <147>
 * 如果 fStyle 等于 1，则此字段应等于 0xFFF，表示没有继承自单元格样式 XF。<147>
 *
 * Data (variable):  If the value of fStyle equals 0, this field contains a CellXF that specifies additional properties of the cell XF.
 * If the value of fStyle equals 1, this field contains a StyleXF that specifies additional properties of the cell style XF.
 *
 *
 * 数据（变量）： 如果 fStyle 的值等于 0，则此字段包含一个 CellXF，用于指定单元格 XF 的其他属性。如果 fStyle 的值等于 1，
 * 则此字段包含一个 StyleXF，用于指定单元格样式 XF 的其他属性。
 *
 * 一个XF 是20个字节
 *
 * @param blob
 * @param length
 * @returns
 */
export function parseXF(blob: CustomCFB$Blob, length: number) {
  let ifnt = blob.read_shift(2);
  const ifmt = blob.read_shift(2);

  const buffer = blob.read_shift(2);
  const fLocked = getBit(buffer, 0);
  const fHidden = getBit(buffer, 1);
  const fStyle = getBit(buffer, 2);
  const f123Prefix = getBit(buffer, 3);
  const ixfParent = getBitSlice(buffer, 4, 12);
  // 剩余 14个字节
  // const data = blob.read_shift(14);
  let data;
  if (fStyle === 0) { // 等于 0，则此字段包含一个 CellXF 用于指定单元格 XF 的其他属性
    data = parseCellStyleXF(blob, length, fStyle);
  } else { // 如果 fStyle 的值等于 1，则此字段包含一个 StyleXF  用于指定StyleXF样式 XF 的其他属性。
    data = parseCellStyleXF(blob, length, fStyle);
  }
  if (ifnt > 4) ifnt = ifnt - 1;
  return {
    fontIndex: ifnt, ifmt, fLocked, fHidden, fStyle, f123Prefix, ixfParent, data: data,
  };
}

const horizontalMap: Record<number, string> = {
  0x00: 'general',
  0x01: 'left',
  0x02: 'center',
  0x03: 'right',
  0x04: 'fill',
  0x05: 'justify',
  0x06: 'centerContinuous',
  0x07: 'distributed',
  // 0xFF
};

const verticalMap: Record<number, string> = {
  0x00: 'top',
  0x01: 'center',
  0x02: 'bottom',
  0x03: 'justify',
  0x04: 'distributed',
};

const readingOrderMap: Record<number, string> = {
  0x00: 'context',
  0x01: 'ltr',
  0x02: 'rtl',
};

const borderStyleMap: Record<number, string> = {
  0x0000: 'no',
  0x0001: 'thin',
  0x0002: 'medium',
  0x0003: 'dashed',
  0x0004: 'dotted',
  0x0005: 'thick',
  0x0006: 'double',
  0x0007: 'hair',
  0x0008: 'mediumDashed',
  0x0009: 'dashDot',
  0x000A: 'mediumDashDot',
  0x000B: 'dashDotDot',
  0x000C: 'mediumDashDotDot',
  0x000D: 'slantDashDot',
};

const borderDiagonalMap: Record<number, string> = {
  0x0: 'no',
  0x1: 'down',
  0x2: 'up',
  0x3: 'both',
};

// https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/10767248-ab46-4581-ae08-310ffcbf026b
const fillPatternMap: Record<number, string> = {
  0x00: 'none',
  0x01: 'solid',
  0x02: 'gray50',
  0x03: 'gray75',
  0x04: 'gray25',
  0x05: 'Horizontal stripe',
  0x06: 'Vertical stripe',
  0x07: 'Reverse diagonal stripe',
  0x08: 'Diagonal stripe',
  0x09: 'Diagonal crosshatch',
  0x0A: 'Thick Diagonal crosshatch',
  0x0B: 'Thin horizontal stripe',
  0x0C: 'Thin vertical stripe',
  0x0D: 'Thin reverse diagonal stripe',
  0x0E: 'Thin diagonal stripe',
  0x0F: 'Thin horizontal crosshatch',
  0x10: 'Thin diagonal crosshatch',
  0x11: 'gray125',
  0x12: 'gray0625',
};

function parseCellStyleXF(blob: CustomCFB$Blob, length: number, style: number, options?: any) {
  const a = blob.read_shift(1);
  const alc = getBitSlice(a, 0, 3);
  const fWrap = getBit(a, 3);
  const alcV = getBitSlice(a, 4, 3);
  const fJustLast = getBit(a, 7);

  const horizontal = horizontalMap[alc];
  const wrapText = !!fWrap;
  const vertical = verticalMap[alcV];

  const trot = blob.read_shift(1);
  const textRotation = trot;

  const b = blob.read_shift(2);

  const cIndent = getBitSlice(b, 0, 4); // 4bit
  const fShrinkToFit = getBit(b, 4);
  const reserved1 = getBit(b, 5);
  const iReadOrder = getBitSlice(b, 6, 2); // 2bit

  const shrinkToFit = !!fShrinkToFit;
  const readingOrder = readingOrderMap[iReadOrder];

  const alignment = {
    horizontal, vertical, wrapText, textRotation, indent: cIndent, shrinkToFit, readingOrder,
  };

  // 下面这个1byte 在styleXF 里忽略的,cellXF 才需要的
  const reserved2 = getBitSlice(b, 8, 2);
  const fAtrNum = getBit(b, 10);
  const fAtrFnt = getBit(b, 11);
  const fAtrAlc = getBit(b, 12);
  const fAtrBdr = getBit(b, 13);
  const fAtrPat = getBit(b, 14);
  const fAtrProt = getBit(b, 15);

  const c = blob.read_shift(4);

  // 这个是border 部分
  const dgLeft = getBitSlice(c, 0, 3);
  const dgRight = getBitSlice(c, 4, 3);
  const dgTop = getBitSlice(c, 8, 3);
  const dgBottom = getBitSlice(c, 12, 3);

  const left = borderStyleMap[dgLeft];
  const right = borderStyleMap[dgRight];
  const top = borderStyleMap[dgTop];
  const bottom = borderStyleMap[dgBottom];

  const border = {
    left, right, top, bottom,
  };

  const icvLeft = getBitSlice(c, 16, 7); // 7bit
  const icvRight = getBitSlice(c, 23, 7); // 7bit
  const grbitDiag = getBitSlice(c, 30, 2); // 2bit

  const d = blob.read_shift(4);
  const icvTop = getBitSlice(d, 0, 7); // 7bit
  const icvBottom = getBitSlice(d, 7, 7); // 7bit
  const icvDiag = getBitSlice(d, 14, 7); // 7bit
  const dgDiag = getBitSlice(d, 21, 4);// 4bit
  const fHasXFExt = getBit(d, 25); // 1bit
  const fls = getBitSlice(d, 26, 6); // 6bit

  const diagonal = borderDiagonalMap[dgDiag];
  const fillPattern = fillPatternMap[fls];

  const e = blob.read_shift(2);
  // 2个byte
  const icvFore = getBitSlice(e, 0, 7);// 7biy
  const icvBack = getBitSlice(e, 7, 7);// 7bit
  const fsxButton = getBit(e, 14);// 1bit
  const reserved3 = getBit(e, 15);// 1bit

  return {
    alignment, border,
  };
}

export function writeXF(data: any, options?: any) {
  const size = 20;
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  CFB.utils.prep_blob(newBlob, 0);
  newBlob.write_shift(2, 0);
  newBlob.write_shift(2, (data.numFmtId || 0));
  newBlob.write_shift(2, (ixfeP<<4));

  newBlob.write_shift(4, 0);
  newBlob.write_shift(4, 0);
  newBlob.write_shift(4, 0);
  newBlob.write_shift(2, 0);
  return newBlob;
}
