import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.21 BOF
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/4d6a3d1e-d7c5-405f-bbae-d01e9cb79366
 * @param blob
 * @param length
 * @returns
 */
export function parseBOF(blob: CustomCFB$Blob, length: number) {
  const output = { BIFFVer: 0, dt: 0 };
  output.BIFFVer = blob.read_shift(2);
  length -= 2;
  if (length >= 2) {
    // 0x0005  Specifies the workbook substream.
    // 0x0010  Specifies the dialog sheet substream or the worksheet substream.
    // 0x0020  Specifies the chart sheet substream.
    // 0x0040  Specifies the macro sheet substream.
    output.dt = blob.read_shift(2);
    blob.l -= 2;
  }
  switch (output.BIFFVer) {
    case 0x0600: /* BIFF8 */
    case 0x0500: /* BIFF5 */
    case 0x0400: /* BIFF4 */
    case 0x0300: /* BIFF3 */
    case 0x0200: /* BIFF2 */
    case 0x0002:
    case 0x0007: /* BIFF2 */
      break;
    default: if (length > 6) throw new Error(`Unexpected BIFF Ver ${output.BIFFVer}`);
  }

  blob.read_shift(length);
  return output;
}
