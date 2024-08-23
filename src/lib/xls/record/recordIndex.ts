
import { CustomCFB$Blob } from '../../../util/type';

/**
 * @desc [MS-XLS] 2.4.144 Index
 * 
 * @link  https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/67c20922-0427-4c2d-96cc-2267d3f09e8c
 * @returns 
 */
export function parseIndex(blob: CustomCFB$Blob, length: number) {

    const total = blob.l + length;

    const reserved = blob.read_shift(4);
    const rowMic = blob.read_shift(4);
    const rowMac = blob.read_shift(4);
    const ibXF = blob.read_shift(4);
    const rgibRw = blob.read_shift(total - blob.l);

	return {rowMic, rowMac, ibXF, rgibRw};
}