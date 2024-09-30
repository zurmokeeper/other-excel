import { parseBoundSheet8, writeBoundSheet8 } from './boundSheet';
import { parseBOF, writeBOF } from './bof';
import { parseSST } from './sst';
import { parseCountry, writeCountry } from './country';
import { parseDimensions, writeDimensions } from './dimensions';
import { parseRow } from './row';
import { parseIndex } from './recordIndex';
import { parseLabelSST } from './labelSst';
import { parseXF } from './xf';
import { parseFont, writeFont } from './font';
import { parseRK } from './rk';
import { parseExtSST } from './extSst';
import { parseWriteAccess, writeWriteAccess } from './writeAccess';
import { parseDBCell } from './dbCell';
import { parseFormat } from './format';
import { parseDefaultRowHeight } from './defaultRowHeight';
import { parseMergeCells } from './mergeCells';
import { parseBlank } from './blank';
import { parseHLink } from './hLink';
import { parseNote } from './note';
import { parseObj } from './obj';
import { parseTxO } from './txO';
import { parseColInfo, writeColInfo } from './colInfo';
import { parseMulBlank } from './mulBlank';
import { parseXFExt } from './xfExt';
import { parseWindow1, writeWindow1 } from './window1';
import { writeRRTabId } from './rrTabId';
import { parseGuts, writeGuts } from './guts';
import { parseWindow2, writeWindow2 } from './window2';

import { CustomCFB$Blob } from '../../../util/type';

function parseNoop2(blob: CustomCFB$Blob, length: number) {
  blob.read_shift(length);
  return null;
}

function parseSlurp(blob: CustomCFB$Blob, length: number, cb: any) {
  const arr = [];
  const target = blob.l + length;
  while (blob.l < target) {
    arr.push(cb(blob, target - blob.l));
  }
  if (target !== blob.l) throw new Error('Slurp error');
  return arr;
}

function parseUInt16(blob: CustomCFB$Blob) {
  return blob.read_shift(2, 'u');
}

function parseUInt16a(blob: CustomCFB$Blob, length: number) {
  return parseSlurp(blob, length, parseUInt16);
}
function parseBool(blob: CustomCFB$Blob, length: number) {
  return blob.read_shift(length) === 0x1;
}

function parseXnum(blob: CustomCFB$Blob, length: number) {
  if (blob.length - blob.l < 8) {
    throw new Error('XLS Xnum Buffer underflow');
  }
  return blob.read_shift(8, 'f');
}

export {
  parseBoundSheet8,
  parseBOF,
  parseSST,
  parseCountry,
  parseDimensions,
  parseRow,
  parseLabelSST,
  parseXF,
  parseFont,
  parseNoop2,
  parseRK,
  parseExtSST,
  parseWriteAccess,
  parseUInt16a,
  parseBool,
  parseUInt16,
  parseDBCell,
  parseFormat,
  parseDefaultRowHeight,
  parseMergeCells,
  parseBlank,
  parseHLink,
  parseNote,
  parseObj,
  parseTxO,
  parseColInfo,
  parseMulBlank,
  parseXnum,
  parseIndex,
  parseXFExt,
  parseWindow1,
  parseGuts,
  parseWindow2,

  writeBOF,
  writeWriteAccess,
  writeRRTabId,
  writeWindow1,
  writeFont,
  writeBoundSheet8,
  writeCountry,
  writeGuts,
  writeDimensions,
  writeColInfo,
  writeWindow2,
};
