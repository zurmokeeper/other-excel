import orderBy from 'lodash/orderBy';
import {decodeCell} from './util/index';
import {getRowsSchema} from './util/schema';
import {MAX_ROW_NUM, MAX_COL_NUM} from './util/enum';
import {Cell, Row, Column, Range} from './util/type';


type Options = {
    name: string | number;
}

class WorkSheet {
    index: number;
    name: string | number;
    labelSsts: Array<Record<string, any>>;
    dimensions: Range;
    rks: Array<Record<string, any>>;
    defaultRowHeight: number;
    defaultColWidth: number;
    mergeCells: Array<Record<string, any>>;
    cells: Cell[];

    calcMode: number;
    calcCount: number;
    calcIter: boolean;
    calcDelta: number;
    calcSaveRecalc: boolean;
    calcRefMode: boolean;

    actualRowCount: number;
    actualColumnCount: number;

    constructor(options: Options) {
        this.index = 0;
        this.name = options.name;
        this.labelSsts = [];
        this.dimensions = {start: {row:0, col: 0}, end: {row:0, col: 0}};
        this.rks = [];
        this.defaultRowHeight = 0;
        this.defaultColWidth = 0;
        this.mergeCells = [];
        this.cells = [];

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
      if(this.cells.length === 0) return row;
      const filterCellList = this.cells.filter((item)=>item.row === index);
      const sortCellList = orderBy(filterCellList, 'col', 'asc');
      row = {number: index, values: sortCellList}
      return row;
    }

    getRows(start: number, end: number): Row[] {
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

      if(this.cells.length === 0) return [];
      const filterCellList = this.cells.filter((item)=>item.row >= start && item.row <= end);

      const rangeCellList = [];
      while (start < end) {
        const indexCellList: Row = {number: start, values: []}
        for (const cell of filterCellList) {
            if(cell.row === start) indexCellList.values.push(cell)
        }
        if(indexCellList.values.length > 0) {
          rangeCellList.push(indexCellList)
        }
        start++;
      }
      return rangeCellList;
    }

    getColumn(index: number | string): Column {
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
      let col: Column = {number: index, values: []};
      if(this.cells.length === 0) return col;
      const filterCellList = this.cells.filter((item)=>item.col === index);
      const sortCellList = orderBy(filterCellList, 'col', 'asc')
      col = {number: index, values: sortCellList}
      return col;
    }

    getColumns(start: number, end: number): Column[] {

      getRowsSchema.parse({start, end})


      if(this.cells.length === 0) return [];
      const filterCellList = this.cells.filter((item)=>item.col >= start && item.col <= end);

      const rangeCellList = [];
      while (start < end) {
        const indexCellList: Column = {number: start, values: []}
        for (const cell of filterCellList) {
            if(cell.row === start) indexCellList.values.push(cell)
        }
        if(indexCellList.values.length > 0) {
          rangeCellList.push(indexCellList)
        }
        start++;
      }
      return rangeCellList;
    }

    // cell 挂多个 address ->A1
    // getCell(1,1) or getCell(A1)
    getCell(row: number | string, col?: number): Cell | undefined {
      console.log('xxxx', this.name)
      console.log('xxxx', this.labelSsts)
    //   console.log('xxxx', this.dimensions)
      console.log('rks', this.rks)
      console.log('mergeCells', JSON.stringify(this.mergeCells))

      console.log('cells', this.cells)

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

      if(this.cells.length === 0) return ;
      const cell = this.cells.find((item)=>item.col === realCol && item.row === realRow);
      return cell;
    }

    // parse(value: any) {
    //     this.labelSst.push(value); // 使用当前实例的 labelSst
    // }
}

export default WorkSheet;