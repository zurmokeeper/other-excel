import { ZodError } from 'zod';
import { describe, it, expect, beforeAll } from '@jest/globals';

import OtherExcel from '../src/index';
import WorkBook from '../src/workbook';

const otherExcel = new OtherExcel();

let workbook: WorkBook;

describe('WorkSheet', () => {
  beforeAll(async () => {
    workbook = await otherExcel.read('./tests/test1-merge.xls');
  });

  it.only('new WorkSheet().getCell: success.', async () => {
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

  it('new WorkSheet().getColumns', async () => {
    // const workbook = await otherExcel.read(`./tests/test1-merge.xls`);
    const worksheet = workbook.getWorksheet(0);
    try {
      const columns = worksheet.getColumns(-1, -1);
      // expect(200).toEqual(200);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('xxxxxx123412312', error.formErrors); // `errors` 是 ZodError 的属性
        // console.error('xxxxxx123412312123213', error.format()); // `errors` 是 ZodError 的属性
      } else {
        throw error;
      }
    }
  });

  it('new WorkSheet().getColumns', async () => {
    const worksheet = workbook.getWorksheet(0);
    try {
      const columns = worksheet.getColumns(-1, 2);
      // expect(200).toEqual(200);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('xxxxxx1234123121312321321', error.formErrors); // `errors` 是 ZodError 的属性
        console.error('xxxxxx123412312123213', error.toString()); // `errors` 是 ZodError 的属性
      } else {
        throw error;
      }
    }
  });
});
