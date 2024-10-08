import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc  [MS-XLS] 2.4.90 Dimensions
 * @link  https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/5fd3837c-9f3d-4952-8a85-ad93ddb37ced
 * @param blob
 * @param length
 * @param options
 * @returns
 */
export function parseDimensions(blob: CustomCFB$Blob, length: number, options: any) {
  const end = blob.l + length;
  // const size = options?.biffVer == 8 || !options.biffVer ? 4 : 2;
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
  return { start: { row: rwMic, col: colMic }, end: { row: rwMac, col: colMac } };
}
