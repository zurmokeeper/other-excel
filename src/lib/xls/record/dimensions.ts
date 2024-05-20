
import { CustomCFB$Blob } from '../parse';

/* [MS-XLS] 2.4.90 */

// TODO:左上的问题还有问题，要+1吗

export function parseDimensions(blob: CustomCFB$Blob, length: number, opts: any) {
	const end = blob.l + length;
	// const size = opts?.biff == 8 || !opts.biff ? 4 : 2;
    const size = 4;
    // rwMic  // 包含单元格的第一行
    // rwMac 
    // colMic  // 包含单元格的第一列
    // colMac 

	const rwMic = blob.read_shift(size);
    const rwMac = blob.read_shift(size);
	const colMic = blob.read_shift(2);
    const colMac = blob.read_shift(2);
	blob.l = end;
	return {start: {row: rwMic, col: colMic}, end: {row: rwMac, col: colMac}};
}