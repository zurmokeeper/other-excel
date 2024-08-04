/**
 * @author Bruce
 * @time 2024-03-16
 */
import * as fs from 'fs';
// import * as CFB from 'cfb';
import XLSX from 'xlsx';
import { parseWorkbook } from './lib/xls/parse';
import WorkBook from './workbook';
import { parseWorkbook as parseWorkbookV2, Parse } from './lib/xls/parsev2';

type Options = {
  type?: 'base64' | 'buffer' | 'stream';
}


// const ExcelJS = require('exceljs');
// let workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('path/to/your/excel/file.xlsx')
// const worksheet = workbook.getWorksheet(1);

class Excel {
  workbook: WorkBook;

  constructor() {
    this.workbook = new WorkBook();
  }

  async read(data: string | Buffer | fs.ReadStream, options?: Options): Promise<WorkBook>{
  // async read(data: string | Buffer | fs.ReadStream, options?: Options){
  // async read(data: string | Buffer | fs.ReadStream, options?: Options): Promise<any> {

    let buffer;
    if (typeof data === 'string') {
      if (options?.type === 'base64') {
          buffer = Buffer.from(data, 'base64');
      } else {
          if (!fs.existsSync(data)) {
            throw new Error(`File not found: ${data}`);
          }
          const readStream = fs.createReadStream(data);
          const readChunks = [];
          for await (const chunk of readStream) {
              readChunks.push(chunk);
          }
          buffer = Buffer.concat(readChunks);
      }
    } else if (Buffer.isBuffer(data)) {
        buffer = data;
    } else if (data instanceof fs.ReadStream) {
        const chunks = [];
        for await (const chunk of data) {
            chunks.push(chunk);
        }
        buffer = Buffer.concat(chunks);
    } else {
        throw new Error('Unsupported data type');
    }
  
    // const cfb = CFB.read(buffer, {type: 'buffer'});
    // const Workbook = CFB.find(cfb, '/Workbook');
    const cfb = XLSX.CFB.read(buffer, {type: 'buffer'});
    const Workbook = XLSX.CFB.find(cfb, '/Workbook');
    if(!Workbook) {
      throw new Error('Unsupported data type');
    }
  
    // parseWorkbook(Workbook.content)
    // parseWorkbook(Workbook.content)

    // parseWorkbookV2(Workbook.content, options, this.workbook)

    // this.workbook.parse(Workbook.content, options)

    const parse = new Parse(this.workbook)
    parse.parse(Workbook.content, options)
  
    return this.workbook;
  }

  getWorksheetNames() {
    if (!this.workbook) {
        throw new Error('Workbook is not loaded. Call read() first.');
    }
    return this.workbook.sheetNames;
  }

  getWorksheet(id: number | string) {
    if (!this.workbook) {
        throw new Error('Workbook is not loaded. Call read() first.');
    }

    if( typeof id === 'number') {
      const sheetName = this.workbook.sheetNames[id];
      if (!sheetName) {
        throw new Error(`Worksheet at index ${id} not found.`);
      }
      return this.workbook.worksheet[sheetName];
    }

    return this.workbook.worksheet[id];
  }

  getColumnCount(){

  }

  getRowCount(){
    
  }

  getDimensions(){
    
  }
}

export default Excel;

// class ExcelTest {
//   read(){
//     console.log('read')
//     return new WorkBook()
//   }
// }

// export default ExcelTest;

// class WorkSheet {
//   getCell(){
//     console.log('xxxx')
// }
// }

// class WorkBook {
//   getWorksheet(){
//       console.log('xxxx')
//       return new WorkSheet()
//   }
// }

// const otherExcel = {
//   WorkBook: WorkBook
// }

// export default otherExcel;

// read('../tests/test1.xls')
// read('./tests/test1.xls')

// const otherExcel = new Excel();
// const workbook = otherExcel.read('./tests/test1.xls')

async function name() {
  const otherExcel = new Excel();
  const workbook = await otherExcel.read('./tests/test1.xls')
  // const worksheet = workbook.getWorksheet(1);
}

// name()



// function decode_cell(cstr) {
// 	var R = 0, C = 0;
// 	for(var i = 0; i < cstr.length; ++i) {
// 		var cc = cstr.charCodeAt(i);
// 		if(cc >= 48 && cc <= 57) R = 10 * R + (cc - 48);
// 		else if(cc >= 65 && cc <= 90) C = 26 * C + (cc - 64);
// 	}
// 	return { c: C - 1, r:R - 1 };
// }

// // 把 {row: 1, cole: 1} 变成 B2
// //function encode_cell(cell) { return encode_col(cell.c) + encode_row(cell.r); }
// function encode_cell(cell) {
// 	var col = cell.c + 1;
// 	var s="";
// 	for(; col; col=((col-1)/26)|0) s = String.fromCharCode(((col-1)%26) + 65) + s;
// 	return s + (cell.r + 1);
// }

// export interface Worksheet {
//   readonly id: number;
// 	readonly name: string;
//   readonly dimensions: number;
//   properties: WorksheetProperties;
//   readonly rowCount: number;
//   readonly actualRowCount: number;
//   readonly columnCount: number;
//   readonly actualColumnCount: number;
//   getColumn(index: number): Column;
//   getColumns(start: number, length: number): Column[];
//   getColumns(start: number, end: number): Column[];  ?? 选哪种
//   getRow(index: number): Row;
//   getRows(start: number, length: number): Row[] | undefined;
//   getCell(r: number | string, c?: number | string): Cell;
// }

// export interface Row {
//   readonly number: number;
//   values: CellValue[];
// }

// export interface Column {
//   readonly number: number;
//   values: CellValue[];
// }

// export class Workbook {
//   category: string;
//   company: string;
//   creator: string;
//   description: string;
//   keywords: string;
//   lastModifiedBy: string;
//   created: Date;
//   manager: string;
//   modified: Date;
//   lastPrinted: Date;
//   properties: WorkbookProperties;
//   subject: string;
//   title: string;
//   worksheets: Worksheet[];
//   getWorksheet(indexOrName?: number | string): Worksheet | undefined;
// }