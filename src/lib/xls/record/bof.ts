import XLSX from 'xlsx';
import { CustomCFB$Blob } from '../../../util/type';

const { CFB } = XLSX;

type BIFFType = {
  [key: number]: number
}

const BIFF: BIFFType = {
  1536: 8,
  1280: 5,
  1024: 4,
  768: 3,
  512: 2,
  2: 2,
  7: 2,
};

/**
 * @desc [MS-XLS] 2.4.21 BOF
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/4d6a3d1e-d7c5-405f-bbae-d01e9cb79366
 *
 * [2057, 16, record]  0x0809->2057
 *
 * vers 2Byte BIFF version
 * dt  2Byte
 * rupBuild  2Byte
 * rupYear  2Byte
 *
 * fWin 1bit
 * fRisc 1bit
 * fBeta 1bit
 * fWinAny 1bit
 * fMacAny 1bit
 * fBetaAny 1bit
 * unused1 2bit
 * fRiscAny 1bit
 * fOOM  1bit
 * fGlJmp 1bit
 * unused2 2bit
 * fFontLimit  1bit
 * verXLHigh 4bit
 * unused3  1bit
 * reserved1 13bit
 * verLowestBiff  8bit  The value MUST be 6.
 * verLastXLSaved  4 bits
 * reserved2 20 bits
 *
 * @param blob
 * @param length 16 Byte
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

  output.BIFFVer = BIFF[output.BIFFVer];
  blob.read_shift(length);
  return output;
}

export function writeBOF(wb: any, t: number, o: any) {
  let header = 0x0600;
  let size = 16;
  switch (o.type) {
    case 'biff8': break;
    case 'biff5': header = 0x0500; size = 8; break;
    case 'biff4': header = 0x0004; size = 6; break;
    case 'biff3': header = 0x0003; size = 6; break;
    case 'biff2': header = 0x0002; size = 4; break;
    case 'xla': break;
    default: throw new Error('unsupported BIFF version');
  }
  const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  CFB.utils.prep_blob(newBlob, 0);
  newBlob.write_shift(2, header);
  newBlob.write_shift(2, t);
  if (size > 4) newBlob.write_shift(2, 0x7262); // rupBuild TODO:
  if (size > 6) newBlob.write_shift(2, 0x07CD); // rupYear
  if (size > 8) {
    newBlob.write_shift(2, 0xC009);
    newBlob.write_shift(2, 0x0001);
    newBlob.write_shift(2, 0x0706);
    newBlob.write_shift(2, 0x0000); // reserved2
  }
  return newBlob;
}
