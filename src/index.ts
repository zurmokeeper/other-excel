/**
 * @author Bruce
 * @time 2024-03-16
 */
import * as fs from 'fs';
import * as CFB from 'cfb';
import { parseWorkbook } from './lib/xls/parse';

// async readFile(filename: string, options: any): Promise<any> {
//     if (!(await fs.promises.exists(filename))) {
//       throw new Error(`File not found: ${filename}`);
//     }
//     const stream = fs.createReadStream(filename);
//     try {
//       const workbook = await this.read(stream, options);
//       stream.close();
//       return workbook;
//     } catch (error) {
//       stream.close();
//       throw error;
//     }
// }

// async read(data: Buffer | fs.ReadStream, options) {


//     const chunks = [];
//     for await (const chunk of stream) {
//       chunks.push(chunk);
//     }
//     return this.load(Buffer.concat(chunks), options);
// }

// async load(data, options) {
//     let buffer;
//     if (options && options.base64) {
//       buffer = Buffer.from(data.toString(), 'base64');
//     } else {
//       buffer = data;
//     }
// }

type Options = {
  type?: 'base64' | 'buffer' | 'stream';
}


// const ExcelJS = require('exceljs');
// let workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('path/to/your/excel/file.xlsx')
// const worksheet = workbook.getWorksheet(1);

class Excel {
  workbook: Record<string, any>;

  constructor(workbook?: Record<string, any>) {
    this.workbook = workbook || {}
  }

  async read(data: string | Buffer | fs.ReadStream, options?: Options): Promise<any> {

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
    const Workbook = CFB.find(cfb, '/Workbook');
    if(!Workbook) {
      throw new Error('Unsupported data type');
    }
  
    parseWorkbook(Workbook.content)
  
    return this.workbook;
  }
}



export async function read1(data: string | Buffer | fs.ReadStream, options?: Options): Promise<any> {

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
  const Workbook = CFB.find(cfb, '/Workbook');
  if(!Workbook) {
    throw new Error('Unsupported data type');
  }

  parseWorkbook(Workbook.content)

  return data;
}

// read('../tests/test1.xls')
// read('./tests/test1.xls')

const otherExcel = new Excel();
otherExcel.read('./tests/test1.xls')
