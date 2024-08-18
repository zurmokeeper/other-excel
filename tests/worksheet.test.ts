
import OtherExcel from '../src/index';
const otherExcel = new OtherExcel();

describe('rc4 decrypt', () => {
    it('decrypt xls success', async () => {
      const workbook = await otherExcel.read(`./tests/test1-merge.xls`);
      const worksheet = workbook.getWorksheet(0)
      const cell = worksheet.getCell('A3')
      // expect(200).toEqual(200);
    });
})