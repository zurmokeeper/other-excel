// import { ZodError } from 'zod';
import {
  describe, it, expect, beforeAll,
} from '@jest/globals';

import OtherExcel from '../src/index';
import WorkBook from '../src/workbook';

const otherExcel = new OtherExcel();

let workbook: WorkBook;

describe('WorkBook', () => {
  beforeAll(async () => {
    workbook = await otherExcel.read('./tests/test1-merge.xls');
  });

  it('new WorkBook().getWorksheet: The parameter is number,  success.', async () => {
    const worksheet = workbook.getWorksheet(0);
    // expect(cell).toEqual(expectData);
  });

  it('new WorkBook().getWorksheet: Worksheet at index id not found.', async () => {
    const id = 3;
    const test = function test() {
      return function test1() {
        workbook.getWorksheet(id);
      };
    };
    expect(test()).toThrowError(new Error(`Worksheet at index ${id} not found.`));
  });

  it('new WorkBook().getWorksheet: Worksheet at index id not found.', async () => {
    const id = -1;
    try {
      const worksheet = workbook.getWorksheet(id);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(`Worksheet at index ${id} not found.`);
      } else {
        throw error;
      }
    }
  });

  it('new WorkBook().getWorksheet: SheetName xx not found.', async () => {
    const id = 'xx';
    const test = function test() {
      return function test1() {
        workbook.getWorksheet(id);
      };
    };
    expect(test()).toThrowError(new Error(`SheetName ${id} not found.`));
  });

  it('new WorkBook().getWorksheet: The parameter is string,  success.', async () => {
    const worksheet = workbook.getWorksheet('Sheet1');
    // expect(cell).toEqual(expectData);
  });
});
