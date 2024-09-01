import { CustomCFB$Blob } from '../../../util/type';
import { parseRef8U } from '../../../util/charsetParseUtil';
import { getBit } from '../../../util/index';

const chr0 = /\u0000/g;

/* [MS-OSHARED] 2.3.7.9 HyperlinkString */
function parseHyperlinkString(blob: CustomCFB$Blob, length?: number) {
  const len = blob.read_shift(4);
  const output = len > 0 ? blob.read_shift(len, 'utf16le').replace(chr0, '') : '';
  return output;
}

/* [MS-OSHARED] 2.3.7.6 URLMoniker TODO: flags */
function parseURLMoniker(blob: CustomCFB$Blob, length?: number) {
  const len = blob.read_shift(4);
  const start = blob.l;
  let extra = false;
  if (len > 24) {
    /* look ahead */
    blob.l += len - 24;
    if (blob.read_shift(16) === '795881f43b1d7f48af2c825dc4852763') extra = true;
    blob.l = start;
  }
  const url = blob.read_shift((extra ? len - 24 : len) >> 1, 'utf16le').replace(chr0, '');
  if (extra) blob.l += 24;
  return url;
}

/* [MS-OSHARED] 2.3.7.8 FileMoniker TODO: all fields */
function parseFileMoniker(blob: CustomCFB$Blob, length?: number) {
  let cAnti = blob.read_shift(2);
  let preamble = '';
  while (cAnti-- > 0) {
    preamble += '../';
  }
  const ansiPath = blob.read_shift(0, 'lpstr-ansi');
  blob.l += 2; // var endServer = blob.read_shift(2);
  if (blob.read_shift(2) !== 0xDEAD) throw new Error('Bad FileMoniker');
  const sz = blob.read_shift(4);
  if (sz === 0) {
    return preamble + ansiPath.replace(/\\/g, '/');
  }
  const bytes = blob.read_shift(4);
  if (blob.read_shift(2) !== 3) throw new Error('Bad FileMoniker');
  const unicodePath = blob.read_shift(bytes >> 1, 'utf16le').replace(chr0, '');
  return preamble + unicodePath;
}

/* [MS-OSHARED] 2.3.7.2 HyperlinkMoniker TODO: all the monikers */
function parseHyperlinkMoniker(blob: CustomCFB$Blob, length: number) {
  const clsid = blob.read_shift(16);
  length -= 16;
  switch (clsid) {
    case 'e0c9ea79f9bace118c8200aa004ba90b': return parseURLMoniker(blob, length);
    case '0303000000000000c000000000000046': return parseFileMoniker(blob, length);
    default: throw new Error(`Unsupported Moniker ${clsid}`);
  }
}

/* [MS-OLEPS] 2.8 FILETIME (Packet Version) */
function parseFILETIME(blob: CustomCFB$Blob) {
  const dwLowDateTime = blob.read_shift(4);
  const dwHighDateTime = blob.read_shift(4);
  return new Date(((dwHighDateTime / 1e7 * 2 ** 32 + dwLowDateTime / 1e7) - 11644473600) * 1000).toISOString().replace(/\.000/, '');
}

/* [MS-OSHARED] 2.3.7.1 Hyperlink Object */
// 000 11100  buffer & 0x0010
function parseHyperlink(blob: CustomCFB$Blob, length: number) {
  const end = blob.l + length;
  const streamVersion = blob.read_shift(4);
  if (streamVersion !== 2) {
    throw new Error(`Unrecognized streamVersion: ${streamVersion}`);
  }
  const buffer = blob.read_shift(2);
  const hlstmfHasMoniker = getBit(buffer, 0);
  const hlstmfIsAbsolute = getBit(buffer, 1);
  const hlstmfSiteGaveDisplayName = getBit(buffer, 2);
  const hlstmfHasLocationStr = getBit(buffer, 3);
  const hlstmfHasDisplayName = getBit(buffer, 4);
  const hlstmfHasGUID = getBit(buffer, 5);
  const hlstmfHasCreationTime = getBit(buffer, 6);
  const hlstmfHasFrameName = getBit(buffer, 7);
  const hlstmfMonikerSavedAsStr = getBit(buffer, 8);
  const hlstmfAbsFromGetdataRel = getBit(buffer, 9);
  // reserved (22 bits) 6bit + 2bytes
  blob.l += 2;

  let displayName;
  let targetFrameName;
  let moniker;
  let oleMoniker;
  let guid;
  let fileTime;
  let location = '';
  if (hlstmfHasDisplayName) {
    displayName = parseHyperlinkString(blob, end - blob.l);
  }
  if (hlstmfHasFrameName) {
    targetFrameName = parseHyperlinkString(blob, end - blob.l);
  }
  if (hlstmfHasMoniker && hlstmfMonikerSavedAsStr) {
    moniker = parseHyperlinkString(blob, end - blob.l);
  }
  if (hlstmfHasMoniker && !hlstmfMonikerSavedAsStr) {
    oleMoniker = parseHyperlinkMoniker(blob, end - blob.l);
  }
  if (hlstmfHasLocationStr) {
    location = parseHyperlinkString(blob, end - blob.l);
  }
  if (hlstmfHasGUID) {
    guid = blob.read_shift(16);
  }
  if (hlstmfHasCreationTime) {
    fileTime = parseFILETIME(blob/* , 8 */);
  }
  let target = targetFrameName || moniker || oleMoniker || '';
  if (target && location) target += `#${location}`;
  if (!target) target = `#${location}`;
  if (hlstmfIsAbsolute && target.charAt(0) === '/' && target.charAt(1) !== '/') target = `file://${target}`;

  return {
    Target: target,
    guid,
    time: fileTime,
    Tooltip: displayName,
  };
}

/**
 * @desc [MS-XLS] 2.4.140
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/f0b9de34-b147-4f96-a1a3-ac21f6fd48fa
 * @param blob
 * @param length
 * @returns
 */

export function parseHLink(blob: CustomCFB$Blob, length: number) {
  const ref8 = parseRef8U(blob, 8);
  blob.l += 16; /* CLSID hlinkClsid  */
  const hyperlink = parseHyperlink(blob, length - 24);
  return { ref: ref8, hyperlink: hyperlink };
}
