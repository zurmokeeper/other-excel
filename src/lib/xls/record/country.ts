import { CountryCodeEnum } from '../../../util/enum';
import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc  [MS-XLS] 2.4.63 Country
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/440b4cc6-215f-439a-af5b-f1b666c1af78
 * @param blob
 * @returns
 */
export function parseCountry(blob: CustomCFB$Blob) {
  const output: string[] = [];
  let countryCode = 1;
  countryCode = blob.read_shift(2); // iCountryDef
  output[0] = CountryCodeEnum[countryCode];
  countryCode = blob.read_shift(2); // iCountryWinIni
  output[1] = CountryCodeEnum[countryCode];
  return output;
}

export function writeCountry() {
  const size = 4;
  // const newBlob = Buffer.alloc(size) as CustomCFB$Blob;
  // CFB.utils.prep_blob(newBlob, 0);
  // newBlob.write_shift(2, 0x0056);
  // newBlob.write_shift(2, 0x0056);

  const newBlob = Buffer.alloc(size);
  newBlob.writeUInt16LE(0x0056, 0);
  newBlob.writeUInt16LE(0x0056, 2);
  return newBlob;
}
