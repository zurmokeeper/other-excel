import WorkSheet from './worksheet';
import {parseWorkbook} from './lib/xls/parsev2';


class WorkBook {
    sheetNames: Array<string>;
    date1904: boolean;
    worksheet: Record<string, WorkSheet>;

    constructor() {
        this.sheetNames = [];
        this.date1904 = false;
        this.worksheet = {};
    }

    getWorksheet(id: number | string) {
        // if (!this.workbook) {
        //     throw new Error('Workbook is not loaded. Call read() first.');
        // }
    
        if( typeof id === 'number') {
          const sheetName = this.sheetNames[id];
          if (!sheetName) {
            throw new Error(`Worksheet at index ${id} not found.`);
          }
          return new WorkSheet({id: sheetName});
        }
        return new WorkSheet({id: id});
    }

}

export default WorkBook;