
import XLSX from 'xlsx';
import {CustomCFB$Blob} from '../../util/type';
import {parseBoundSheet8, parseBOF, parseSST, parseLabelSST, parseCountry,
    parseDimensions, parseRow, parseXF, parseFont, parsenoop2, parseRK,
    parseExtSST, parseWriteAccess, parseUInt16a, parseBool, parseUInt16,
    parseDBCell, parseFormat, parseDefaultRowHeight, parseMergeCells
} from './record/entry';
import WorkBook from '../../workbook';

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
    MergeCells: 'MergeCells'
}

const XLSRECORDENUM: XLSRecordEnum = {
    0x0085: {func: parseBoundSheet8, name: XLSRECORDNAME.BoundSheet8},
    0x0809: {func: parseBOF, name: XLSRECORDNAME.BOF},
	// 0x0086: {name: XLSRECORDNAME.WriteProtect },
	0x00fc: {func: parseSST, name: XLSRECORDNAME.SST},
	0x00fd: {func: parseLabelSST, name: XLSRECORDNAME.LabelSST},
	0x008c: {func: parseCountry , name: XLSRECORDNAME.Country},
	0x0200: { /* n:"Dimensions", */ func: parseDimensions , name: XLSRECORDNAME.Dimensions},
	0x0208: {func: parseRow , name: XLSRECORDNAME.Row},
	0x013d: { /* n:"RRTabId", */ func: parseUInt16a , name: XLSRECORDNAME.RRTabId},
	// 0x020b: { /* n:"Index", */ func: parseIndex, name: XLSRECORDNAME.Index },
	0x00e0: { /* n:"XF", */ func: parseXF , name: XLSRECORDNAME.XF},
	0x0031: { /* n:"Font", */ func: parseFont , name: XLSRECORDNAME.Font},
    0x000a: { /* n:"EOF", */ func:parsenoop2 , name: XLSRECORDNAME.EOF},
    0x0022: { /* n:"Date1904", */ name: XLSRECORDNAME.Date1904},
    0x027e: { /* n:"RK", */ func: parseRK, name: XLSRECORDNAME.RK},
    0x00ff: { /* n:"ExtSST", */ func: parseExtSST, name: XLSRECORDNAME.ExtSST},
    0x005c: {func: parseWriteAccess, name: XLSRECORDNAME.WriteAccess },
    0x0012: {func: parseBool, name: XLSRECORDNAME.Protect },
    0x0013: {func: parseUInt16, name: XLSRECORDNAME.Password },
    0x0019: {func: parseBool, name: XLSRECORDNAME.WinProtect },
    0x00d7: {func: parseDBCell, name: XLSRECORDNAME.DBCell },
    0x041e: {func: parseFormat, name: XLSRECORDNAME.Format },
    0x0225: {func: parseDefaultRowHeight, name: XLSRECORDNAME.DefaultRowHeight },
    0x0055: {func: parseUInt16, name: XLSRECORDNAME.DefColWidth },
    0x00e5: {func: parseMergeCells, name: XLSRECORDNAME.MergeCells },
}

const BOFList = [0x0009, 0x0209, 0x0409, 0x0809];


function slurp(blob: any, length: number, record: XLSRecord){
	const data = blob.slice(blob.l, blob.l + length);
	blob.l += length;
	CFB.utils.prep_blob(data, 0);
	if(!record || !record.func) {  // TODO: 想想这些没有func的要怎么处理
		return {};
	}
	const result = record.func(data, length);
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
    
        while (blob.l < blob.length - 1) {
            const postion = blob.l;   // 每个record 第一个数据的偏移量
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
                    case XLSRECORDNAME.WriteAccess:
                        console.log('lastUserName-->', value)
                        this.workbook.lastUserName = value;
                        break;
                    case XLSRECORDNAME.RRTabId:
                        console.log('rrtabid-->', value)
                        // this.workbook.rrtabid = value;
                        break;
                    case XLSRECORDNAME.Protect:
                        console.log('Protect-->', value)
                        this.workbook.protect = value;
                        break;
                    case XLSRECORDNAME.Password:
                        console.log('Password-->', value)
                        this.workbook.password = value;
                        break;
                    case XLSRECORDNAME.WinProtect:
                            console.log('WinProtect-->', value)
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
    
                        currSheetName = currWorksheet[postion].sheetName;
                        
                        currWorksheetInst = this.workbook.setWorksheet({sheetName: currSheetName})

                        merges = [];
    
                        break;
                    case XLSRECORDNAME.LabelSST:
                        value.value = this.workbook.sst.strs[value.isst]
                        value.xf = this.workbook.xfs[value.cell.indexOfXFCell];

                        currWorksheetInst?.labelSst.push(value)
                        break;
                    // case XLSRECORDNAME.DefaultRowHeight:
                    //     if(currWorksheetInst) {
                    //         currWorksheetInst.defaultRowHeight = value;
                    //     }
                    //     break;
                    case XLSRECORDNAME.DefColWidth:
                        console.log('DefColWidth-->', value)
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
                    case XLSRECORDNAME.Format:
                        // console.log('Format-->', value)
                        this.workbook.formats.push(value);
                        break;
                    case XLSRECORDNAME.Dimensions:

                        currWorksheetInst?.dimensions.push(value)
                        break;
                    case XLSRECORDNAME.Country:
                        console.log('Country-->', value)
                        // currWorksheetInst?.dimensions.push(value)
                        break; 
                    case XLSRECORDNAME.DBCell:
                        console.log('DBCell-->', value)
                        break;    
                    case XLSRECORDNAME.RK:

                        value.xf = this.workbook.xfs[value.ixfe];
                        currWorksheetInst?.rks.push(value)
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