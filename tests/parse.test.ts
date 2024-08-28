import {
  describe, it, expect,
} from '@jest/globals';
import fs from 'fs';
import OtherExcel from '../src/index';

const otherExcel = new OtherExcel();
const filePath = './tests/test1-merge.xls';

describe('read()', () => {
  it('read(): The parameter is the file path, options.type is base64, success.', async () => {
    const buffer = await fs.promises.readFile(filePath);
    await otherExcel.read(buffer.toString('base64'), { type: 'base64' });
  });

  it('read(): The parameter is the file path, success.', async () => {
    await otherExcel.read(filePath);
  });

  it('read(): The parameter is buffer, success.', async () => {
    const buffer = await fs.promises.readFile(filePath);
    await otherExcel.read(buffer);
  });

  it('read(): The parameter is stream, success.', async () => {
    const stream = await fs.createReadStream(filePath);
    await otherExcel.read(stream);
  });

  it('read(): no such file or directory', async () => {
    try {
      const data = '/path/xxx';
      await otherExcel.read(data);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch('File not found:');
      } else {
        throw error;
      }
    }
  });

  it('read(): Unsupported file type!', async () => {
    try {
      const data = './tests/test.docx';
      await otherExcel.read(data);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Unsupported file type!');
      } else {
        throw error;
      }
    }
  });
});
