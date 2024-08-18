import orderBy from 'lodash/orderBy';
import {decodeCell} from './util/index';
import {getRowsSchema} from './util/schema';
import {MAX_ROW_NUM, MAX_COL_NUM} from './util/enum';


type Options = {
    name: string | number;
}

interface Cell {
  value: string;
  type: 'string' | 'date' | 'hyperlink' | 'number';
  col: number;
  row: number;
  text: string | number; // 单元格字面量
}

interface Row {
  readonly number: number;
  values: Cell[];
}

class WorkSheet {
    index: number;
    name: string | number;
    labelSsts: Array<Record<string, any>>;
    dimensions: Array<Record<string, any>>;
    rks: Array<Record<string, any>>;
    defaultRowHeight: number;
    defaultColWidth: number;
    mergeCells: Array<Record<string, any>>;

    calcMode: number;
    calcCount: number;
    calcIter: boolean;
    calcDelta: number;
    calcSaveRecalc: boolean;
    calcRefMode: boolean;

    readonly actualRowCount: number;
    readonly actualColumnCount: number;

    constructor(options: Options) {
        this.index = 0;
        this.name = options.name;
        this.labelSsts = [];
        this.dimensions = [];
        this.rks = [];
        this.defaultRowHeight = 0;
        this.defaultColWidth = 0;
        this.mergeCells = [];

        this.calcMode = 1;
        this.calcCount = 100;
        this.calcIter = false;
        this.calcDelta = 0.001;
        this.calcSaveRecalc = true;
        this.calcRefMode = true;

        this.actualRowCount = 0;
        this.actualColumnCount = 0;
    }

    getRow(index: number): Row {
      if(index < 0) {
        throw new Error('index must be greater than or equal to 0.');
      }
      if(index > MAX_ROW_NUM) {
        throw new Error(`index must be less than or equal to ${MAX_ROW_NUM}.`);
      }
      let row: Row = {number: index, values: []};
      // 加一个 非整数的判断  TODO:  加一个最大行的判断
      const cellList = this.labelSsts.concat(this.rks);
      if(cellList.length === 0) return row;
      const filterCellList = cellList.filter((item)=>item.row === index);
      const sortCellList = orderBy(filterCellList, 'col', 'asc');
      // row = {number: index, values: sortCellList}
      return row;
    }

    getRows(start: number, end: number){
      // if(start < 0 || end < 0) {
      //   throw new Error('start or end must be greater than or equal to 0.');
      // }
      // if(start >= end) {
      //   throw new Error('start must be less than end.');
      // }
      // if(end > MAX_COL_NUM) {
      //   throw new Error(`end must be less than or equal to ${MAX_COL_NUM}.`);
      // }

      getRowsSchema.parse({start, end})

      const cellList = this.labelSsts.concat(this.rks);
      if(cellList.length === 0) return [];
      const filterCellList = cellList.filter((item)=>item.row >= start && item.row <= end);

      const rangeCellList = [];
      while (start < end) {
        const indexCellList = []
        for (const cell of filterCellList) {
          if(cell.row === start) indexCellList.push(cell)
        }
        if(indexCellList.length > 0) {
          rangeCellList.push(indexCellList)
        }
        start++;
      }
      return rangeCellList;
    }

    getColumn(index: number | string){
      if(typeof index === 'string') {
        const cell = decodeCell(index);
        index = cell.col;
      }
      if(index < 0) {
        throw new Error('index 必须大于等于0');
      }
      if(index > MAX_COL_NUM) {
        throw new Error('index 必须大于等于0');
      }
      // 加一个 非整数的判断
      const cellList = this.labelSsts.concat(this.rks);
      if(cellList.length === 0) return [];
      const filterCellList = cellList.filter((item)=>item.col === index);
      const sortCellList = orderBy(filterCellList, 'col', 'asc')
      return sortCellList;
    }

    getColumns(start: number, end: number){
    }

    // cell 挂多个 address ->A1
    // getCell(1,1) or getCell(A1)
    getCell(row: number | string, col?: number){
      console.log('xxxx', this.name)
      console.log('xxxx', this.labelSsts)
    //   console.log('xxxx', this.dimensions)
      console.log('rks', this.rks)
      console.log('mergeCells', JSON.stringify(this.mergeCells))

      let realRow = row, realCol = 0;
      if(typeof row === 'string') {
        const cell = decodeCell(row);
        realRow = cell.row;
        realCol = cell.col;
      } else {
        if(!col) throw new Error('index 必须大于等于0');
        if(row < 0 || col < 0) {
          throw new Error('index 必须大于等于0');
        }
        realCol = col;
      }
      if(realRow as number > MAX_ROW_NUM) {
        throw new Error('index 必须大于等于0');
      }
      if(realCol > MAX_COL_NUM) {
        throw new Error('index 必须大于等于0');
      }

      const cellList = this.labelSsts.concat(this.rks);
      if(cellList.length === 0) return ;
      const cell = cellList.find((item)=>item.col === realCol && item.row === realRow);
      return cell;
    }

    // parse(value: any) {
    //     this.labelSst.push(value); // 使用当前实例的 labelSst
    // }
}

export default WorkSheet;