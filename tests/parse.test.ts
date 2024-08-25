import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import fs from 'fs';
import OtherExcel from '../src/index';

const otherExcel = new OtherExcel();
const filePath = './tests/test1-merge.xls';

describe('read()', () => {
  it('read(): The parameter is the file path, options.type is base64, success.', async () => {
    const buffer = await fs.promises.readFile(filePath);
    const workbook = await otherExcel.read(buffer.toString('base64'), { type: 'base64' });
  });

  it('read(): The parameter is the file path, success.', async () => {
    const workbook = await otherExcel.read(filePath);
  });

  it('read(): The parameter is buffer, success.', async () => {
    const buffer = await fs.promises.readFile(filePath);
    const workbook = await otherExcel.read(buffer);
  });

  it('read(): The parameter is stream, success.', async () => {
    const stream = await fs.createReadStream(filePath);
    const workbook = await otherExcel.read(stream);
  });

  it.only('read(): no such file or directory', async () => {
    try {
      const data = '/path/xxx';
      const workbook = await otherExcel.read(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log('xxxxxxxxxxxxxxxxx-->', error.message);
        expect(error.message).toMatch(/ENOENT: no such file or directory/);
      } else {
        console.log('xxxxxxxxxxxxxxxxx-->1312');
        throw error;
      }
    }
  });
});
