// import { ZodError } from 'zod';
import {
  describe, it, expect, beforeAll,
} from '@jest/globals';

import OtherExcel from '../src/index';
import WorkBook from '../src/workbook';
import { MAX_ROW_NUM, MAX_COL_NUM } from '../src/util/enum';

const otherExcel = new OtherExcel();

let workbook: WorkBook;

describe('WorkSheet', () => {
  beforeAll(async () => {
    workbook = await otherExcel.read('./tests/test1-merge.xls');
  });

  it('new WorkSheet().getCell: success. The parameter is string.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const cell = worksheet.getCell('A3');
    const expectData = {
      address: 'A3',
      value: { value: '特殊' },
      type: 'string',
      col: 0,
      row: 2,
      text: '特殊',
    };
    expect(cell).toEqual(expectData);
  });

  it('new WorkSheet().getCell: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const cell = worksheet.getCell(2, 0);
    const expectData = {
      address: 'A3',
      value: { value: '特殊' },
      type: 'string',
      col: 0,
      row: 2,
      text: '特殊',
    };
    expect(cell).toEqual(expectData);
  });

  it('new WorkSheet().getCell: The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getCell(-1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getCell: The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getCell(0, -1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getCell: row must be less than or equal to ${MAX_ROW_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getCell(MAX_ROW_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`row must be less than or equal to ${MAX_ROW_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getCell: col must be less than or equal to ${MAX_COL_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getCell(0, MAX_COL_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`col must be less than or equal to ${MAX_COL_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getCell: success. Empty worksheet and col is undefined', async () => {
    const worksheet = workbook.getWorksheet(2);
    const col = worksheet.getCell(0);
    const expectData = {
    };
    expect(col).toEqual(undefined);
  });

  it('new WorkSheet().getRow: index must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRow(-1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('index must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getRow: index must be less than or equal to ${MAX_ROW_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRow(MAX_ROW_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`index must be less than or equal to ${MAX_ROW_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getRow: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const row = worksheet.getRow(3);
    const expectData = {
      number: 3,
      values: [
        {
          address: 'B4',
          col: 1,
          row: 3,
          type: 'number',
          text: 123,
          value: { value: 123 },
        },
        {
          address: 'F4',
          col: 5,
          row: 3,
          type: 'string',
          text: '特殊12\n阿达是的',
          value: { value: '特殊12\n阿达是的' },
        },
      ],
    };
    expect(row).toEqual(expectData);
  });

  it('new WorkSheet().getRow: success. The row is an []', async () => {
    const worksheet = workbook.getWorksheet(0);
    const row = worksheet.getRow(5);
    const expectData = {
      number: 5,
      values: [
      ],
    };
    expect(row).toEqual(expectData);
  });

  it('new WorkSheet().getRow: success. Empty worksheet and row is an []', async () => {
    const worksheet = workbook.getWorksheet(2);
    const row = worksheet.getRow(0);
    const expectData = {
      number: 0,
      values: [
      ],
    };
    expect(row).toEqual(expectData);
  });

  it('new WorkSheet().getRows: start is -1, The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRows(-1, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getRows: end is -1, The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRows(0, -1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getRows: start = end, end must be greater than start.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRows(0, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('end must be greater than start.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getRows: start > end, end must be greater than start.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRows(1, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('end must be greater than start.');
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getRows: row must be less than or equal to ${MAX_ROW_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getRows(1, MAX_ROW_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`row must be less than or equal to ${MAX_ROW_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getRows: success. Empty worksheet and row is an []', async () => {
    const worksheet = workbook.getWorksheet(2);
    const rows = worksheet.getRows(0, 1);
    const expectData = [];
    expect(rows).toEqual(expectData);
  });

  it('new WorkSheet().getRows: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const rows = worksheet.getRows(2, 3);
    const expectData = [
      {
        number: 2,
        values: [
          {
            address: 'A3',
            col: 0,
            row: 2,
            type: 'string',
            text: '特殊',
            value: {
              value: '特殊',
            },
          },
        ],
      },
      {
        number: 3,
        values: [
          {
            address: 'B4',
            col: 1,
            row: 3,
            type: 'number',
            text: 123,
            value: {
              value: 123,
            },
          },
          {
            address: 'F4',
            col: 5,
            row: 3,
            type: 'string',
            text: '特殊12\n阿达是的',
            value: {
              value: '特殊12\n阿达是的',
            },
          },
        ],
      },
    ];
    expect(rows).toEqual(expectData);
  });

  it('new WorkSheet().getColumn: index must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumn(-1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('index must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getColumn: index must be less than or equal to ${MAX_COL_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumn(MAX_COL_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`index must be less than or equal to ${MAX_COL_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumn: parameter is string, Illegal parameter format, please enter the correct format.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumn('xx');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Illegal parameter format, please enter the correct format.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumn: parameter is string, Illegal parameter format, please enter the correct format.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumn('1');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Illegal parameter format, please enter the correct format.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumn: success. The col is an []', async () => {
    const worksheet = workbook.getWorksheet(0);
    const col = worksheet.getColumn(6);
    const expectData = {
      number: 6,
      values: [
      ],
    };
    expect(col).toEqual(expectData);
  });

  it('new WorkSheet().getColumn: success. Empty worksheet and row is an []', async () => {
    const worksheet = workbook.getWorksheet(2);
    const col = worksheet.getColumn(0);
    const expectData = {
      number: 0,
      values: [
      ],
    };
    expect(col).toEqual(expectData);
  });

  it('new WorkSheet().getColumn: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const row = worksheet.getColumn(5);
    const expectData = {
      number: 5,
      values: [
        {
          address: 'F4',
          col: 5,
          row: 3,
          type: 'string',
          text: '特殊12\n阿达是的',
          value: {
            value: '特殊12\n阿达是的',
          },
        },
        {
          address: 'F11',
          col: 5,
          row: 10,
          type: 'string',
          text: 'book.js',
          value: {
            value: 'book.js',
          },
        },
        {
          address: 'F14',
          col: 5,
          row: 13,
          type: 'number',
          text: 456,
          value: {
            value: 456,
          },
        },
      ],
    };
    expect(row).toEqual(expectData);
  });

  it('new WorkSheet().getColumn: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const row = worksheet.getColumn('F');
    const expectData = {
      number: 5,
      values: [
        {
          address: 'F4',
          col: 5,
          row: 3,
          type: 'string',
          text: '特殊12\n阿达是的',
          value: {
            value: '特殊12\n阿达是的',
          },
        },
        {
          address: 'F11',
          col: 5,
          row: 10,
          type: 'string',
          text: 'book.js',
          value: {
            value: 'book.js',
          },
        },
        {
          address: 'F14',
          col: 5,
          row: 13,
          type: 'number',
          text: 456,
          value: {
            value: 456,
          },
        },
      ],
    };
    expect(row).toEqual(expectData);
  });

  it('new WorkSheet().getColumns: start is -1, The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumns(-1, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumns: end is -1, The parameter must be greater than or equal to 0.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumns(0, -1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('The parameter must be greater than or equal to 0.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumns: start = end, end must be greater than start.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumns(0, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('end must be greater than start.');
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumns: start > end, end must be greater than start.', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumns(1, 0);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('end must be greater than start.');
      } else {
        throw error;
      }
    }
  });

  it(`new WorkSheet().getColumns: col must be less than or equal to ${MAX_COL_NUM}.`, async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      worksheet.getColumns(1, MAX_COL_NUM + 1);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`col must be less than or equal to ${MAX_COL_NUM}.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumns: success. Empty worksheet and col is an []', async () => {
    const worksheet = workbook.getWorksheet(2);
    const cols = worksheet.getColumns(0, 1);
    const expectData = [];
    expect(cols).toEqual(expectData);
  });

  it('new WorkSheet().getColumns: success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    const cols = worksheet.getColumns(4, 5);
    const expectData = [
      {
        number: 4,
        values: [
          {
            address: 'E8',
            col: 4,
            row: 7,
            type: 'number',
            text: 123,
            value: {
              value: 123,
            },
          },
        ],
      },
      {
        number: 5,
        values: [
          {
            address: 'F4',
            col: 5,
            row: 3,
            type: 'string',
            text: '特殊12\n阿达是的',
            value: {
              value: '特殊12\n阿达是的',
            },
          },
          {
            address: 'F11',
            col: 5,
            row: 10,
            type: 'string',
            text: 'book.js',
            value: {
              value: 'book.js',
            },
          },
          {
            address: 'F14',
            col: 5,
            row: 13,
            type: 'number',
            text: 456,
            value: {
              value: 456,
            },
          },
        ],
      },
    ];
    expect(cols).toEqual(expectData);
  });

  it('new WorkSheet().actualRowCount: success. actualRowCount is 9', async () => {
    const worksheet = workbook.getWorksheet(0);
    const actualRowCount = worksheet.actualRowCount;
    const expectData = 9;
    expect(actualRowCount).toEqual(expectData);
  });
});
