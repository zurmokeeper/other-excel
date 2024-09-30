import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.354 XFCRC
 * The XFCRC record specifies the number of XF records contained in this file and  that contains a checksum of the data in those records. This record MUST exist if and only if there are XFExt records in the file.
 * XFCRC 记录指定此文件中包含的 XF 记录数，其中包含这些记录中数据的校验和。当且仅当文件中有 XFExt 记录时，此记录必须存在。
 *
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/781bc274-3540-4f56-af6e-f193efb3f6be
 * @param length 20
 * @returns
 */

export function parseXFCRC(blob: CustomCFB$Blob, length: number) {
  const frtHeader = blob.read_shift(12);
  blob.read_shift(2); // reserved
  const cxfs = blob.read_shift(2);
  const crc = blob.read_shift(4);
  return { cxfs, crc };
}
