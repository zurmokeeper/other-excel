

import { CountryCodeEnum } from '../../../util/enum';
import { CustomCFB$Blob } from '../../../util/type';


/** 
 * @desc  [MS-XLS] 2.4.63 
 * @param blob 
 * @returns 
 */
export function parseCountry(blob: CustomCFB$Blob) {
	let o: string[] = [], countryCode: number = 1;
	countryCode = blob.read_shift(2); // iCountryDef
	o[0] = CountryCodeEnum[countryCode];
	countryCode = blob.read_shift(2);  // iCountryWinIni
	o[1] = CountryCodeEnum[countryCode];
	return o;
}