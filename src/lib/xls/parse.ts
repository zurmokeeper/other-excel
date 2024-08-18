
import XLSX from 'xlsx';
import {CustomCFB$Blob} from '../../util/type';
import {parseBoundSheet8, parseBOF, parseSST, parseLabelSST, parseCountry,
    parseDimensions, parseRow, parseXF, parseFont, parsenoop2, parseRK,
    parseExtSST, parseWriteAccess, parseUInt16a, parseBool, parseUInt16,
    parseDBCell, parseFormat, parseDefaultRowHeight, parseMergeCells,parseBlank,
    parseHLink, parseNote, parseObj, parseTxO, parseColInfo, parseMulBlank,
    parseXnum
} from './record/entry';
import WorkBook from '../../workbook';
import {buildCell} from '../../util/index';

const CFB = XLSX.CFB

interface XLSRecord {
	func?: (blob: CustomCFB$Blob, length: number, options?: any) => any;
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
    CalcRefMode: 'CalcRefMode'
}

const XLSRECORDENUM: XLSRecordEnum = {
    0x0085: {func: parseBoundSheet8, name: XLSRECORDNAME.BoundSheet8},
    0x0809: {func: parseBOF, name: XLSRECORDNAME.BOF},
	// 0x0086: {name: XLSRECORDNAME.WriteProtect },
	0x00fc: {func: parseSST, name: XLSRECORDNAME.SST},
	0x00fd: {func: parseLabelSST, name: XLSRECORDNAME.LabelSST},
	0x008c: {func: parseCountry , name: XLSRECORDNAME.Country},
	0x0200: {func: parseDimensions , name: XLSRECORDNAME.Dimensions},
	0x0208: {func: parseRow , name: XLSRECORDNAME.Row},
	0x013d: {func: parseUInt16a , name: XLSRECORDNAME.RRTabId},
	// 0x020b: { /* n:"Index", */ func: parseIndex, name: XLSRECORDNAME.Index },
	0x00e0: {func: parseXF , name: XLSRECORDNAME.XF},
	0x0031: {func: parseFont , name: XLSRECORDNAME.Font},
    0x000a: {func: parsenoop2 , name: XLSRECORDNAME.EOF},
    0x0022: {func: parseBool, name: XLSRECORDNAME.Date1904},
    0x027e: {func: parseRK, name: XLSRECORDNAME.RK},
    0x00ff: {func: parseExtSST, name: XLSRECORDNAME.ExtSST},
    0x005c: {func: parseWriteAccess, name: XLSRECORDNAME.WriteAccess },
    0x0012: {func: parseBool, name: XLSRECORDNAME.Protect },
    0x0013: {func: parseUInt16, name: XLSRECORDNAME.Password },
    0x0019: {func: parseBool, name: XLSRECORDNAME.WinProtect },
    0x00d7: {func: parseDBCell, name: XLSRECORDNAME.DBCell },
    0x041e: {func: parseFormat, name: XLSRECORDNAME.Format },
    0x0225: {func: parseDefaultRowHeight, name: XLSRECORDNAME.DefaultRowHeight },
    0x0055: {func: parseUInt16, name: XLSRECORDNAME.DefColWidth },
    0x00e5: {func: parseMergeCells, name: XLSRECORDNAME.MergeCells },
    0x0201: {func: parseBlank, name: XLSRECORDNAME.Blank },
    0x01b8: {func: parseHLink, name: XLSRECORDNAME.HLink },
    0x001c: {func: parseNote, name: XLSRECORDNAME.Note },
    0x005d: {func: parseObj, name: XLSRECORDNAME.Obj },
    0x01b6: {func: parseTxO, name: XLSRECORDNAME.TxO },
    0x003c: {name: XLSRECORDNAME.Continue},
    0x007d: {func: parseColInfo, name: XLSRECORDNAME.ColInfo },
    0x00be: {func: parseMulBlank, name: XLSRECORDNAME.MulBlank },
    0x000e: {func: parseBool, name: XLSRECORDNAME.CalcPrecision },
    0x01b7: {func: parseBool, name: XLSRECORDNAME.RefreshAll },
    0x000d: {func: parseUInt16, name: XLSRECORDNAME.CalcMode },
    0x000c: {func: parseUInt16, name: XLSRECORDNAME.CalcCount },
    0x0011: {func: parseBool, name: XLSRECORDNAME.CalcIter },
    0x0010: {func: parseXnum, name: XLSRECORDNAME.CalcDelta },
    0x005f: {func: parseBool, name: XLSRECORDNAME.CalcSaveRecalc },
    0x000f: {func: parseBool, name: XLSRECORDNAME.CalcRefMode },
}

const BOFList = [0x0009, 0x0209, 0x0409, 0x0809];

/*
	Continue logic for:
	- 2.4.58 Continue          0x003c
	- 2.4.59 ContinueBigName   0x043c
	- 2.4.60 ContinueFrt       0x0812
	- 2.4.61 ContinueFrt11     0x0875
	- 2.4.62 ContinueFrt12     0x087f
*/
const CONTINUERT = [ 0x003c, 0x043c, 0x0812, 0x0875, 0x087f ];

// blob.l 是正式内容的偏移量开头了，已经读了 num 和 size 了
function slurp(blob: any, length: number, record: XLSRecord){
	const data = blob.slice(blob.l, blob.l + length);
	blob.l += length;
	// CFB.utils.prep_blob(data, 0);
	if(!record || !record.func) {  // TODO: 想想这些没有func的要怎么处理
		return {};
	}
    const buf = [];
    buf.push(data)

    let nextRecordType = blob.readUInt16LE(blob.l);
    let nextFunc = XLSRECORDENUM[nextRecordType];
    while(nextFunc != null && CONTINUERT.includes(nextRecordType)) {

        blob.l += 2; // skip num
        const continueSize = blob.read_shift(2);
        let start = blob.l;
        if(nextRecordType == 0x0812 /* ContinueFrt */) {
            start += 4;
        } else if(nextRecordType == 0x0875 || nextRecordType == 0x087f) {
			start += 12;
		}
        const continueData = blob.slice(start, blob.l + continueSize);
        blob.l += continueSize;

		buf.push(continueData);
		nextFunc = XLSRECORDENUM[nextRecordType = blob.readUInt16LE(blob.l)];
	}
    const totalData = Buffer.concat(buf) as CustomCFB$Blob;
    CFB.utils.prep_blob(totalData, 0);

    let len = 0;  //  continue 前一个记录的数据部分长度
    totalData.continuePartDataLens = []
	for(let j = 0; j < buf.length; j++) { 
        totalData.continuePartDataLens.push(len); 
        len += buf[j].length;
    }
    // totalData.lens 是一个数组, 
    // 第1个元素是 0
    // 第2个元素 continue 前一个记录的数据部分长度
    // ...第3个元素 前2个元素数据部分长度的总和
    // ...第4个元素 前3个元素数据部分长度的总和
    if(totalData.length < length) throw "XLS Record 0x";

	const result = record.func(totalData, length);
	return result;
}

export class Parse {
    workbook:  WorkBook;

    constructor(workbook: WorkBook){
        this.workbook = workbook;
    }

    parse(blob: any, options?: any){

        let file_depth = 0;
        let merges = [];
        const currWorksheet: Record<number, any> = {};
        let currSheetName;
        let currWorksheetInst;
        let tempCell;
        let sheetIndex = -1;
    
        while (blob.l < blob.length - 1) {
            const position = blob.l;   // 每个record 第一个数据的偏移量
            const recordType = blob.read_shift(2);
            const size = blob.read_shift(2);
            const record = XLSRECORDENUM[recordType];
            const recordName = record?.name;
            let value;

    
            if(recordName === XLSRECORDNAME.EOF) {  // 假如开头就是一个EOF
                if(record?.func) {
                    value = record.func(blob, size);
                }
            } else {
                value = slurp(blob, size, record);
            }
    
            // if(file_depth == 0 && BOFList.indexOf(last_RT) === -1 /* 'BOF' */) continue;
            if(file_depth == 0 && BOFList.includes(recordType)) continue;
    
            if(record?.func) {
                switch (recordName) {
                    case XLSRECORDNAME.Date1904:
                        this.workbook.date1904 = value;
                        break;
                    case XLSRECORDNAME.CalcPrecision:
                        this.workbook.calcPrecision = value;
                        break;
                    case XLSRECORDNAME.RefreshAll:
                        this.workbook.refreshAll = value;
                        break;
                    case XLSRECORDNAME.CalcMode:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcMode = value;
                        }
                        break;
                    case XLSRECORDNAME.CalcCount:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcCount = value;
                        }
                        break;
                    case XLSRECORDNAME.CalcIter:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcIter = value;
                        }
                        break;
                    case XLSRECORDNAME.CalcDelta:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcDelta = value;
                        }
                        break;
                    case XLSRECORDNAME.CalcSaveRecalc:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcSaveRecalc = value;
                        }
                        break;
                    case XLSRECORDNAME.CalcRefMode:
                        if(currWorksheetInst) {
                            currWorksheetInst.calcRefMode = value;
                        }
                        break;
                    case XLSRECORDNAME.WriteAccess:
                        console.log('lastUserName-->', value)
                        this.workbook.lastUserName = value;
                        break;
                    case XLSRECORDNAME.RRTabId:
                        this.workbook.rrTabid = value;
                        break;
                    case XLSRECORDNAME.Protect:
                        this.workbook.protect = value;
                        break;
                    case XLSRECORDNAME.Password:
                        this.workbook.password = value;
                        break;
                    case XLSRECORDNAME.WinProtect:
                        this.workbook.winProtect = value;
                        break;
                    case XLSRECORDNAME.BoundSheet8:
                        currWorksheet[value.pos] = value;
                        this.workbook.sheetNames.push(value.sheetName)
                        break;
                    case XLSRECORDNAME.BOF:
                        file_depth++;
                        if(file_depth) break;
                        // TODO: 处理当前wordsheet 的内容
    
                        currSheetName = currWorksheet[position].sheetName;
                         
                        currWorksheetInst = this.workbook.setWorksheet({sheetName: currSheetName})
                        sheetIndex++;
                        currWorksheetInst.index = sheetIndex;
                        currWorksheetInst.actualRowCount = 0;

                        merges = [];
    
                        break;
                    case XLSRECORDNAME.LabelSST:
                        value.value = this.workbook.sst.strs[value.isst]
                        value.xf = this.workbook.xfs[value.ixfe];

                        currWorksheetInst?.labelSsts.push(value)

                        tempCell = buildCell({col: value.col, row: value.row, type: value.type, text: value.value.t})
                        currWorksheetInst?.cells.push(tempCell)
                        break;
                    // case XLSRECORDNAME.DefaultRowHeight:
                    //     if(currWorksheetInst) {
                    //         currWorksheetInst.defaultRowHeight = value;
                    //     }
                    //     break;
                    case XLSRECORDNAME.DefColWidth:
                        if(currWorksheetInst) {
                            currWorksheetInst.defaultColWidth = value;
                        }
                        break;
                    case XLSRECORDNAME.MergeCells:
                        currWorksheetInst?.mergeCells.push(value)
                        break;
                    case XLSRECORDNAME.SST:
                        this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.XF:
                        // console.log('XF-->', value)
                        this.workbook.xfs.push(value)
                        break;
                    case XLSRECORDNAME.Font:
                        // console.log('XF-->', value)
                        this.workbook.fonts.push(value)
                        break;
                    case XLSRECORDNAME.ExtSST:
                        console.log('ExtSST-->', value)
                        // this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.Blank:
                        console.log('Blank-->', value)
                        // this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.Row:
                        console.log('Row-->', JSON.stringify(value) )
                        if(currWorksheetInst) {
                            currWorksheetInst.actualRowCount++;
                        }
                        break;
                    case XLSRECORDNAME.ColInfo:
                        console.log('ColInfo-->', JSON.stringify(value) )
                        // this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.HLink:
                        console.log('HLink-->', JSON.stringify(value) )
                        // this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.Note:
                        console.log('Note-->', JSON.stringify(value) )
                        // this.workbook.sst = value
                        break;
                    case XLSRECORDNAME.Obj:
                        console.log('Obj-->', JSON.stringify(value))
                        break;
                    case XLSRECORDNAME.Format:
                        // console.log('Format-->', value)
                        this.workbook.formats.push(value);
                        break;
                    case XLSRECORDNAME.Dimensions:
                        if(currWorksheetInst) {
                            currWorksheetInst.dimensions = value;
                        }
                        break;
                    case XLSRECORDNAME.Country:
                        this.workbook.country = value;
                        break; 
                    case XLSRECORDNAME.DBCell:
                        console.log('DBCell-->', value)
                        break;    
                    case XLSRECORDNAME.TxO:
                        console.log('TxO-->', value)
                        break;    
                    case XLSRECORDNAME.MulBlank:
                        console.log('MulBlank-->', value)
                        break;   
                    case XLSRECORDNAME.RK:

                        value.xf = this.workbook.xfs[value.ixfe];
                        tempCell = buildCell({col: value.col, row: value.row, type: value.type, text: value.rknum})
                        
                        currWorksheetInst?.rks.push(value)
                        currWorksheetInst?.cells.push(tempCell)
                        break;
                    case XLSRECORDNAME.EOF:
                        if(--file_depth) break; // 出栈，第一对 BOF EOF 读完了
                        // TODO: 第一次是处理其他的workbook 内容  后面则是worksheet的结束
                        break;
                }
            }
        }
    
        return this.workbook;
    }
}