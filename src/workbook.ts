import WorkSheet from './worksheet';
import { SSTValueType } from './util/type';

class WorkBook {
  sheetNames: Array<string>;
  date1904: boolean;
  calcPrecision: boolean;
  refreshAll: boolean;
  worksheet: Record<string, WorkSheet>;
  sst: SSTValueType;
  lastUserName: string;
  protect: boolean;
  password: string;
  winProtect: boolean;
  xfs: Array<Record<string, any>>;
  fonts: Array<Record<string, any>>;
  formats: Array<Record<string, any>>;
  rrTabid: number[];
  country: string[];

  constructor() {
    this.sheetNames = [];
    this.date1904 = false;
    this.calcPrecision = true;
    this.refreshAll = false;
    this.worksheet = {};
    this.sst = {
      strs: [],
      count: 0,
      uniqueCount: 0,
    };
    this.lastUserName = '';
    this.protect = false;
    this.password = '';
    this.winProtect = false;
    this.xfs = [];
    this.fonts = [];
    this.formats = [];
    this.rrTabid = [];
    this.country = [];
  }

  getWorksheet(id: number | string) {
    // if (!this.workbook) {
    //     throw new Error('Workbook is not loaded. Call read() first.');
    // }

    if (typeof id === 'number') {
      const sheetName = this.sheetNames[id];
      if (!sheetName) {
        throw new Error(`Worksheet at index ${id} not found.`);
      }
      return this.worksheet[sheetName];
    }
    return this.worksheet[id];
  }

  setWorksheet(value: { sheetName: string }): WorkSheet {
    this.worksheet[value.sheetName] = new WorkSheet({ name: value.sheetName });
    return this.worksheet[value.sheetName];
  }
}

export default WorkBook;
