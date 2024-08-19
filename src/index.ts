/**
 * @author zurmokeeper
 * @time 2024-03-16
 */
import * as fs from 'fs';
// import * as CFB from 'cfb';
import XLSX from 'xlsx';
import WorkBook from './workbook';
import { Parse } from './lib/xls/parse';
// import { CustomCFB$Blob } from './util/type';

const CFB = XLSX.CFB;

type Options = {
  type?: 'base64' | 'buffer' | 'stream';
}


class Excel {
  workbook: WorkBook;

  constructor() {
    this.workbook = new WorkBook();
  }

  async read(data: string | Buffer | fs.ReadStream, options?: Options): Promise<WorkBook>{

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
  
    const cfb = CFB.read(buffer, {type: 'buffer'});
    const Workbook = CFB.find(cfb, '/Workbook') || CFB.find(cfb, '/Book');
    // const cfb = XLSX.CFB.read(buffer, {type: 'buffer'});
    // const Workbook = XLSX.CFB.find(cfb, '/Workbook') || XLSX.CFB.find(cfb, '/Book');
    if(!Workbook) {
      throw new Error('Unsupported data type');
    }
  
    const parse = new Parse(this.workbook)
    // parse.parse(Workbook.content as CustomCFB$Blob, options)
    parse.parse(Workbook.content, options)

    return this.workbook;
  }

  getWorksheetNames() {
    if (!this.workbook) {
        throw new Error('Workbook is not loaded. Call read() first.');
    }
    return this.workbook.sheetNames;
  }
}

export default Excel;

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

// ixfe-> indexOfXFCell