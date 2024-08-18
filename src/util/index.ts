
// 获取某一个bit 位的值
export const getBit = (bits: number, i: number) => (bits & (1 << i)) >> i;
export const getBitSlice = (bits: number, i: number, w: number) => (bits & ((2 ** w - 1) << i)) >> i;

export function decodeCell(str: string) {
	let row = 0, col = 0;
	for(let i = 0; i < str.length; ++i) {
		const code = str.charCodeAt(i);
		if(code >= 48 && code <= 57) {
            row = 10 * row + (code - 48);
        }else if(code >= 65 && code <= 90) {
            col = 26 * col + (code - 64);
        }
	}
    if(row < 0 || col < 0) throw new Error('str 格式异常，请输入正确的格式')
	return { col: col - 1, row: row - 1 };
}