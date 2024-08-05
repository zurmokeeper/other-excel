
import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc labelSst LabelSst 记录指定一个包含字符串的单元格。用于指向sst的
 * 
 * SST常量总数cstTotal 有几个，这里就有几个 ，这个是出现在对应的sheet里的
 * 
 * 大小是10个字节
 * 前6个是 cell 后4个是 isst
 * @param blob 
 * @param length 
 */
export function parseLabelSST(blob: CustomCFB$Blob, length: number) {
    const cell = parseCell(blob);
	const isst = blob.read_shift(4);
    return {cell: cell, isst: isst}
}

/**
 * @desc  Cell 结构指定当前工作表中的单元格。一共6个字节 {row: 1, col:1} 表示第二行第二列那个
 * 这个row 和 col 的索引都是从0 开始的，所以对应到界面上要 +1
 * rw (2 bytes): col (2 bytes): ixfe (2 bytes): 指定 XF 记录的 IXFCell。
 * 
 * ixfe (2 bytes): An unsigned integer that specifies a zero-based index of a cell XF record 
 * in the collection of XF records in the Globals Substream. Cell XF records are the subset of 
 * XF records with an fStyle field equal to 0. This value MUST be greater than or equal to 15, 
 * or equal to 0. The value 0 indicates that this value MUST be ignored. 
 * See XFIndex for more information about the organization of XF records in the file.
 * 
 * ixfe （2 字节）： 一个无符号整数，指定 Globals 子流中 XF 记录集合中单元格 XF 记录的从零开始的索引。
 * 单元格 XF 记录是 fStyle 字段等于 0 的 XF 记录的子集。此值必须大于或等于 15，或等于 0。值 0 表示必须忽略此值。
 * 有关文件中 XF 记录组织的更多信息，请参见 XFIndex。
 */
function parseCell(blob: CustomCFB$Blob){
    const rw = blob.read_shift(2);
	const col = blob.read_shift(2);
    const ixfe = blob.read_shift(2);
    return {row: rw, col: col, indexOfXFCell: ixfe}
}