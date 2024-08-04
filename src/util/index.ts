
// 获取某一个bit 位的值
export const getBit = (bits: number, i: number) => (bits & (1 << i)) >> i;
export const getBitSlice = (bits: number, i: number, w: number) => (bits & ((2 ** w - 1) << i)) >> i;
