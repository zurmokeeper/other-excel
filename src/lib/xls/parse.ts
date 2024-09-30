import XLSX from 'xlsx';
import { CustomCFB$Blob, Options, ParseFuncOptions } from '../../util/type';
import {
  parseBoundSheet8, parseBOF, parseSST, parseLabelSST, parseCountry,
  parseDimensions, parseRow, parseXF, parseFont, parseNoop2, parseRK,
  parseExtSST, parseWriteAccess, parseUInt16a, parseBool, parseUInt16,
  parseDBCell, parseFormat, parseDefaultRowHeight, parseMergeCells, parseBlank,
  parseHLink, parseNote, parseObj, parseTxO, parseColInfo, parseMulBlank,
  parseXnum, parseIndex, parseXFExt, parseWindow1, writeBOF,
} from './record/entry';
import WorkBook from '../../workbook';
import { buildCell, writeRecord } from '../../util/index';

const { CFB } = XLSX;

interface XLSRecord {
	func?: (blob: CustomCFB$Blob, length: number, options?: ParseFuncOptions) => any;
  name: string;
}

interface XLSRecordEnum {
	[key: number]: XLSRecord
}

const XLSRECORDNAME = {
  BoundSheet8: 'BoundSheet8',
  BOF: 'BOF',
  SST: 'SST',
  LabelSST: 'LabelSST',
  Country: 'Country',
  Dimensions: 'Dimensions',
  Row: 'Row',
  RRTabId: 'RRTabId',
  Index: 'Index',
  XF: 'XF',
  Font: 'Font',
  WriteProtect: 'WriteProtect',
  EOF: 'EOF',
  Date1904: 'date1904',
  RK: 'RK',
  ExtSST: 'ExtSST',
  WriteAccess: 'WriteAccess',
  Protect: 'Protect',
  Password: 'Password',
  WinProtect: 'WinProtect',
  DBCell: 'DBCell',
  Format: 'Format',
  DefaultRowHeight: 'DefaultRowHeight',
  DefColWidth: 'DefColWidth',
  MergeCells: 'MergeCells',
  Blank: 'Blank',
  HLink: 'HLink',
  Note: 'Note',
  Obj: 'Obj',
  TxO: 'TxO',
  Continue: 'Continue',
  ColInfo: 'ColInfo',
  MulBlank: 'MulBlank',
  CalcPrecision: 'CalcPrecision',
  RefreshAll: 'RefreshAll',
  CalcMode: 'CalcMode',
  CalcCount: 'CalcCount',
  CalcIter: 'CalcIter',
  CalcDelta: 'CalcDelta',
  CalcSaveRecalc: 'CalcSaveRecalc',
  CalcRefMode: 'CalcRefMode',
  XFExt: 'XFExt',
  Window1: 'Window1',
};

const XLSRECORDENUM: XLSRecordEnum = {
  0x0085: { func: parseBoundSheet8, name: XLSRECORDNAME.BoundSheet8 },
  0x0809: { func: parseBOF, name: XLSRECORDNAME.BOF },
  // 0x0086: {name: XLSRECORDNAME.WriteProtect },
  0x00fc: { func: parseSST, name: XLSRECORDNAME.SST },
  0x00fd: { func: parseLabelSST, name: XLSRECORDNAME.LabelSST },
  0x008c: { func: parseCountry, name: XLSRECORDNAME.Country },
  0x0200: { func: parseDimensions, name: XLSRECORDNAME.Dimensions },
  0x0208: { func: parseRow, name: XLSRECORDNAME.Row },
  0x013d: { func: parseUInt16a, name: XLSRECORDNAME.RRTabId },
  0x020b: { func: parseIndex, name: XLSRECORDNAME.Index },
  0x00e0: { func: parseXF, name: XLSRECORDNAME.XF },
  0x0031: { func: parseFont, name: XLSRECORDNAME.Font },
  0x000a: { func: parseNoop2, name: XLSRECORDNAME.EOF },
  0x0022: { func: parseBool, name: XLSRECORDNAME.Date1904 },
  0x027e: { func: parseRK, name: XLSRECORDNAME.RK },
  0x00ff: { func: parseExtSST, name: XLSRECORDNAME.ExtSST },
  0x005c: { func: parseWriteAccess, name: XLSRECORDNAME.WriteAccess },
  0x0012: { func: parseBool, name: XLSRECORDNAME.Protect },
  0x0013: { func: parseUInt16, name: XLSRECORDNAME.Password },
  0x0019: { func: parseBool, name: XLSRECORDNAME.WinProtect },
  0x00d7: { func: parseDBCell, name: XLSRECORDNAME.DBCell },
  0x041e: { func: parseFormat, name: XLSRECORDNAME.Format },
  0x0225: { func: parseDefaultRowHeight, name: XLSRECORDNAME.DefaultRowHeight },
  0x0055: { func: parseUInt16, name: XLSRECORDNAME.DefColWidth },
  0x00e5: { func: parseMergeCells, name: XLSRECORDNAME.MergeCells },
  0x0201: { func: parseBlank, name: XLSRECORDNAME.Blank },
  0x01b8: { func: parseHLink, name: XLSRECORDNAME.HLink },
  0x001c: { func: parseNote, name: XLSRECORDNAME.Note },
  0x005d: { func: parseObj, name: XLSRECORDNAME.Obj },
  0x01b6: { func: parseTxO, name: XLSRECORDNAME.TxO },
  0x003c: { name: XLSRECORDNAME.Continue },
  0x007d: { func: parseColInfo, name: XLSRECORDNAME.ColInfo },
  0x00be: { func: parseMulBlank, name: XLSRECORDNAME.MulBlank },
  0x000e: { func: parseBool, name: XLSRECORDNAME.CalcPrecision },
  0x01b7: { func: parseBool, name: XLSRECORDNAME.RefreshAll },
  0x000d: { func: parseUInt16, name: XLSRECORDNAME.CalcMode },
  0x000c: { func: parseUInt16, name: XLSRECORDNAME.CalcCount },
  0x0011: { func: parseBool, name: XLSRECORDNAME.CalcIter },
  0x0010: { func: parseXnum, name: XLSRECORDNAME.CalcDelta },
  0x005f: { func: parseBool, name: XLSRECORDNAME.CalcSaveRecalc },
  0x000f: { func: parseBool, name: XLSRECORDNAME.CalcRefMode },
  0x087d: { func: parseXFExt, name: XLSRECORDNAME.XFExt },
  0x003d: { func: parseWindow1, name: XLSRECORDNAME.Window1 },
};

const BOFList = [0x0009, 0x0209, 0x0409, 0x0809];

/*
	Continue logic for:
	- 2.4.58 Continue          0x003c
	- 2.4.59 ContinueBigName   0x043c
	- 2.4.60 ContinueFrt       0x0812
	- 2.4.61 ContinueFrt11     0x0875
	- 2.4.62 ContinueFrt12     0x087f
*/
const CONTINUERT = [0x003c, 0x043c, 0x0812, 0x0875, 0x087f];

// blob.l 是正式内容的偏移量开头了，已经读了 num 和 size 了
function slurp(blob: CustomCFB$Blob, length: number, record: XLSRecord, options: ParseFuncOptions) {
  const data = blob.slice(blob.l, blob.l + length);
  blob.l += length;
  if (!record || !record.func) {
    return {};
  }
  const buf = [];
  buf.push(data);

  let nextRecordType = (blob as Buffer).readUInt16LE(blob.l);
  let nextFunc = XLSRECORDENUM[nextRecordType];
  while (nextFunc != null && CONTINUERT.includes(nextRecordType)) {
    blob.l += 2; // skip num
    const continueSize = blob.read_shift(2);
    let start = blob.l;
    if (nextRecordType === 0x0812 /* ContinueFrt */) {
      start += 4;
    } else if (nextRecordType === 0x0875 || nextRecordType === 0x087f) {
      start += 12;
    }
    const continueData = blob.slice(start, blob.l + continueSize);
    blob.l += continueSize;

    buf.push(continueData);
    nextFunc = XLSRECORDENUM[nextRecordType = (blob as Buffer).readUInt16LE(blob.l)];
  }
  const totalData = Buffer.concat((buf as Buffer[])) as CustomCFB$Blob;
  CFB.utils.prep_blob(totalData, 0);

  let len = 0; //  continue 前一个记录的数据部分长度
  totalData.continuePartDataLens = [];
  for (let j = 0; j < buf.length; j++) {
    totalData.continuePartDataLens.push(len);
    len += buf[j].length;
  }
  // totalData.lens 是一个数组,
  // 第1个元素是 0
  // 第2个元素 continue 前一个记录的数据部分长度
  // ...第3个元素 前2个元素数据部分长度的总和
  // ...第4个元素 前3个元素数据部分长度的总和
  if (totalData.length < length) throw new Error('XLS Record 0x');

  const result = record.func(totalData, length, options);
  return result;
}

export class Parse {
  workbook: WorkBook;

  constructor(workbook: WorkBook) {
    this.workbook = workbook;
  }

  parse(blob: CustomCFB$Blob, options?: Options) {
    let fileDepth = 0;
    const currWorksheet: Record<number, any> = {};
    let currSheetName;
    let currWorksheetInst;
    let tempCell;
    let sheetIndex = -1;
    const parseFuncOptions: ParseFuncOptions = {};
    while (blob.l < blob.length - 1) {
      const position = blob.l; // 每个record 第一个数据的偏移量
      const recordType = blob.read_shift(2) as number;
      const size = blob.read_shift(2) as number;
      const record = XLSRECORDENUM[recordType];
      const recordName = record?.name;
      let value;

      if (recordName === XLSRECORDNAME.EOF) { // 假如开头就是一个EOF
        if (record?.func) {
          value = record.func(blob, size);
        }
      } else {
        value = slurp(blob, size, record, parseFuncOptions);
      }

      // if(fileDepth == 0 && BOFList.indexOf(last_RT) === -1 /* 'BOF' */) continue;
      if (fileDepth === 0 && BOFList.includes(recordType)) continue;
      if (record?.func) {
        // eslint-disable-next-line default-case
        switch (recordName) {
          case XLSRECORDNAME.WriteAccess:
            // console.log('lastUserName-->', value)
            this.workbook.lastUserName = value;
            break;
          case XLSRECORDNAME.RRTabId:
            this.workbook.rrTabid = value;
            break;
          case XLSRECORDNAME.WinProtect:
            this.workbook.winProtect = value;
            break;
          case XLSRECORDNAME.Protect:
            this.workbook.protect = value;
            break;
          case XLSRECORDNAME.Password:
            this.workbook.password = value;
            break;
          case XLSRECORDNAME.Window1:
            console.log('Window1-->', JSON.stringify(value));
            break;
          case XLSRECORDNAME.Date1904:
            this.workbook.date1904 = value;
            break;
          case XLSRECORDNAME.CalcPrecision:
            this.workbook.calcPrecision = value;
            break;
          case XLSRECORDNAME.RefreshAll:
            this.workbook.refreshAll = value;
            break;
          case XLSRECORDNAME.Font:
            this.workbook.fonts.push(value);
            break;
          case XLSRECORDNAME.Format:
            // console.log('Format-->', value)
            this.workbook.formats.push(value);
            break;
          case XLSRECORDNAME.XF:
            // console.log('XF-->', JSON.stringify(value));
            this.workbook.xfs.push(value);
            break;
          case XLSRECORDNAME.XFExt:
            // console.log('XFExt-->', JSON.stringify(value));
            break;
          case XLSRECORDNAME.BoundSheet8:
            currWorksheet[value.pos] = value;
            this.workbook.sheetNames.push(value.sheetName);
            break;
          case XLSRECORDNAME.Country:
            this.workbook.country = value;
            break;
          case XLSRECORDNAME.SST:
            this.workbook.sst = value;
            break;
          case XLSRECORDNAME.ExtSST:
            // console.log('ExtSST-->', value);
            break;
          case XLSRECORDNAME.BOF:
            fileDepth++;
            if (fileDepth) break;

            currSheetName = currWorksheet[position].sheetName;

            currWorksheetInst = this.workbook.setWorksheet({ sheetName: currSheetName });
            sheetIndex++;
            currWorksheetInst.index = sheetIndex;
            currWorksheetInst.actualRowCount = 0;

            parseFuncOptions.biffVer = value.BIFFVer;

            break;
          case XLSRECORDNAME.Index:
            // console.log('Index-->', JSON.stringify(value));
            if (currWorksheetInst) {
              // currWorksheetInst.index = value;
            }
            break;
          case XLSRECORDNAME.CalcMode:
            if (currWorksheetInst) {
              currWorksheetInst.calcMode = value;
            }
            break;
          case XLSRECORDNAME.CalcCount:
            if (currWorksheetInst) {
              currWorksheetInst.calcCount = value;
            }
            break;
          case XLSRECORDNAME.CalcRefMode:
            if (currWorksheetInst) {
              currWorksheetInst.calcRefMode = value;
            }
            break;
          case XLSRECORDNAME.CalcIter:
            if (currWorksheetInst) {
              currWorksheetInst.calcIter = value;
            }
            break;
          case XLSRECORDNAME.CalcDelta:
            if (currWorksheetInst) {
              currWorksheetInst.calcDelta = value;
            }
            break;
          case XLSRECORDNAME.CalcSaveRecalc:
            if (currWorksheetInst) {
              currWorksheetInst.calcSaveRecalc = value;
            }
            break;
            // case XLSRECORDNAME.DefaultRowHeight:
            //     if(currWorksheetInst) {
            //         currWorksheetInst.defaultRowHeight = value;
            //     }
            //     break;
          case XLSRECORDNAME.DefColWidth:
            if (currWorksheetInst) {
              currWorksheetInst.defaultColWidth = value;
            }
            break;
          case XLSRECORDNAME.ColInfo:
            console.log('ColInfo-->', JSON.stringify(value));
            // this.workbook.sst = value
            break;
          case XLSRECORDNAME.Dimensions:
            if (currWorksheetInst) {
              currWorksheetInst.dimensions = value;
            }
            break;
          case XLSRECORDNAME.Row:
            // console.log('Row-->', JSON.stringify(value));
            if (currWorksheetInst) {
              currWorksheetInst.actualRowCount++;
            }
            break;
          case XLSRECORDNAME.LabelSST:
            value.value = this.workbook.sst.strs[value.isst];
            value.xf = this.workbook.xfs[value.ixfe];

            currWorksheetInst?.labelSsts.push(value);

            tempCell = buildCell({
              col: value.col, row: value.row, type: value.type, text: value.value.text,
            });
            currWorksheetInst?.cells.push(tempCell);
            break;
          case XLSRECORDNAME.RK:

            value.xf = this.workbook.xfs[value.ixfe];
            tempCell = buildCell({
              col: value.col, row: value.row, type: value.type, text: value.rknum,
            });

            currWorksheetInst?.rks.push(value);
            currWorksheetInst?.cells.push(tempCell);
            break;
          case XLSRECORDNAME.MulBlank:
            // console.log('MulBlank-->', value);
            break;
          case XLSRECORDNAME.Blank:
            // console.log('Blank-->', value);
            // this.workbook.sst = value
            break;
          case XLSRECORDNAME.DBCell:
            // console.log('DBCell-->', value);
            break;
          case XLSRECORDNAME.Obj:
            // console.log('Obj-->', JSON.stringify(value));
            break;
          case XLSRECORDNAME.TxO:
            // console.log('TxO-->', value);
            break;
          case XLSRECORDNAME.Note:
            // console.log('Note-->', JSON.stringify(value));
            // this.workbook.sst = value
            break;
          case XLSRECORDNAME.MergeCells:
            if (currWorksheetInst) {
              currWorksheetInst.mergeCells = currWorksheetInst.mergeCells.concat(value.merges);
            }
            break;
          case XLSRECORDNAME.HLink:
            // console.log('HLink-->', JSON.stringify(value));
            break;
          case XLSRECORDNAME.EOF:
            if (currWorksheetInst) {
              const columns = new Set();
              // 遍历数据数组，并将每个列索引添加到 Set 中
              currWorksheetInst.cells.forEach((cell) => {
                columns.add(cell.col);
              });
              console.log('actualColumnCount-->', columns.size);
              currWorksheetInst.actualColumnCount = columns.size;
            }
            if (--fileDepth) break; // 出栈，第一对 BOF EOF 读完了
            // TODO: 第一次是处理其他的workbook 内容  后面则是worksheet的结束

            // TODO: 为什么下面的不执行呢，是哪里有问题了
            // if (currWorksheetInst) {
            //   const columns = new Set();
            //   // 遍历数据数组，并将每个列索引添加到 Set 中
            //   currWorksheetInst.cells.forEach((cell) => {
            //     columns.add(cell.col);
            //   });
            //   console.log('actualColumnCount-->', columns.size);
            //   currWorksheetInst.actualColumnCount = columns.size;
            // }

            break;
        }
      }
    }

    return this.workbook;
  }

  write() {
    let output = CFB.utils.cfb_new();
    const path = '/Workbook';
    const workSheetContent = [];
    const sheetNames = this.workbook.sheetNames;
    for (let index = 0; index < sheetNames.length; index++) {
      const sheetName = sheetNames[index];
      const currWorksheet = this.workbook.worksheet[sheetName];
      // if (currWorksheet.columns.length > 0) {
      //   writeWorkSheetContent()
      // }
      const content = this.writeWorkSheetContent();
      workSheetContent.push(content);
    }

    const workBookContent = this.writeWorkBookContent();
    // const content = Buffer.concat([workBookContent, ...workSheetContent]);
    const content = Buffer.concat([]);

    CFB.utils.cfb_add(output, path, content);
    output = CFB.write(output);
    if (!Buffer.isBuffer(output)) output = Buffer.from(output);
    return output;
  }

  protected writeWorkBookContent() {
    const options = {
      type: 'biff8',
    };

    const buf: Buffer[] = [];
    // writeRecord(buf, 0x00c1, this.writeZeroes(2));
    // writeRecord(buf, 0x0809, writeBOF(wb, 0x05, options));

    // // write_biff_rec(A, 0x0809, write_BOF(wb, 0x05, opts));
    // write_biff_rec(A, 0x00e1 /* InterfaceHdr */, b8 ? this.writeUInt16(0x04b0) : null);
    // write_biff_rec(A, 0x00c1 /* Mms */, this.writeZeroes(2));
    // write_biff_rec(A, 0x00e2 /* InterfaceEnd */); // 没内容的
    // write_biff_rec(A, 0x005c /* WriteAccess */, write_WriteAccess('SheetJS', options));
    // write_biff_rec(A, 0x0042 /* CodePage */, this.writeUInt16(b8 ? 0x04b0 : 0x04E4));
    // if(b8) write_biff_rec(A, 0x0161 /* DSF */, this.writeUInt16(0));
    // if(b8) write_biff_rec(A, 0x01c0 /* Excel9File */);
    // write_biff_rec(A, 0x013d /* RRTabId */, write_RRTabId(wb.SheetNames.length));
    // write_biff_rec(A, 0x009c /* BuiltInFnGroupCount */, writeuint16(0x11));  // 这个不是必填吧

    // write_biff_rec(A, 0x0019 /* WinProtect */, writeBool(false));
    // write_biff_rec(A, 0x0012 /* Protect */, writeBool(false));
    // write_biff_rec(A, 0x0013 /* Password */, writeUInt16(0));
    // write_biff_rec(A, 0x01af /* Prot4Rev */, writeBool(false));
    // write_biff_rec(A, 0x01bc /* Prot4RevPass */, writeUInt16(0));
    // write_biff_rec(A, 0x003d /* Window1 */, write_Window1(opts));
    // write_biff_rec(A, 0x0040 /* Backup */, writeBool(false));
    // write_biff_rec(A, 0x008d /* HideObj */, writeUInt16(0));
    // write_biff_rec(A, 0x0022 /* Date1904 */, writeBool(safe1904(wb)=="true"));
    // write_biff_rec(A, 0x000e /* CalcPrecision */, writeBool(true));
    // write_biff_rec(A, 0x01b7 /* RefreshAll */, writeBool(false));
    // write_biff_rec(A, 0x00DA /* BookBool */, writeUInt16(0));

    // write_FONTS_biff8(A, wb, opts);

    // write_biff_rec(A, 0x0031 /* Font */, writeFont({
    //   sz:12,
    //   color: {theme:1},
    //   name: "Arial",
    //   family: 2,
    //   scheme: "minor"
    // }, opts));

    // write_FMTS_biff8(A, wb.SSF, opts);
    // write_CELLXFS_biff8(A, opts);
    // write_biff_rec(A, 0x0160 /* UsesELFs */, writeBool(false));


    // for (let j = 0; j < this.workbook.sheetNames.length; ++j) {
    //   var _sheet = _sheets[j] || ({});
    //   write_biff_rec(B, 0x0085 /* BoundSheet8 */, write_BoundSheet8({pos:start, hsState:_sheet.Hidden||0, dt:0, name:wb.SheetNames[j]}, opts));
    //   start += bufs[j].length;
    // }

    // write_biff_rec(C, 0x008C, write_Country())
    // write_biff_rec(C, 0x000A /* EOF */);

    // writeBOF(wb, 0x05, options);
    // writeWriteAccess('otherExcelJS', options);
    // writeRRTabId(this.workbook.sheetNames.length);
    // writeWindow1()

  }

  protected writeWorkSheetContent() {

  }

  writeUInt16(content: number) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(content, 0);
    return buf;
  }

  writeZeroes(length: number) {
    const buf = Buffer.alloc(length);
    return buf;
  }

  writeBool(content: boolean) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(+!!content, 0);
    return buf;
  }

  writeCELLXFSBiff8(content: boolean) {
    for (let i = 0; i < 16; ++i) {
      write_biff_rec(ba, 0x00e0 /* XF */, writeXF({numFmtId:0, style:true}, 0, opts));
    }
    // opts.cellXfs.forEach(function(c) {
    //   write_biff_rec(ba, 0x00e0 /* XF */, write_XF(c, 0, opts));
    // });
  }
}
