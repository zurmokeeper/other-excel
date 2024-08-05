
import { CustomCFB$Blob } from '../../../util/type';
import { getBit, getBitSlice} from '../../../util/index';

/**
 * @desc The XF record specifies formatting properties for a cell or a cell style.
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
 * @param blob 
 * @param length 
 * @returns 
 */
export function parseXF(blob: CustomCFB$Blob, length: number) {
	const ifnt = blob.read_shift(2);
    const ifmt = blob.read_shift(2);

    const buffer = blob.read_shift(2);
    const fLocked = getBit(buffer, 0);
    const fHidden = getBit(buffer, 1);
    const fStyle = getBit(buffer, 2);
    const f123Prefix = getBit(buffer, 3);
    const ixfParent = getBitSlice(buffer, 4, 12);
    // 剩余 14个字节
    const data = blob.read_shift(14);
    if(fStyle === 0) {  // 等于 0，则此字段包含一个 CellXF 用于指定单元格 XF 的其他属性

    } else {  // 如果 fStyle 的值等于 1，则此字段包含一个 StyleXF  用于指定StyleXF样式 XF 的其他属性。

    }
    return { fontIndex: ifnt, ifmt, fLocked, fHidden, fStyle, f123Prefix, ixfParent}
}