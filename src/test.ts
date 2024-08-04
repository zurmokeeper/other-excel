import OtherExcel from './index';

//  const workbook1 = new otherExcel.WorkBook()
//  const worksheet = workbook1.getWorksheet()
//  worksheet.getCell()



async function name() {
    const otherExcel = new OtherExcel()
    const workbook1 = await otherExcel.read('./tests/test1.xls')
    const worksheet = workbook1.getWorksheet(0)
    worksheet.getCell()
    // const otherExcel = new Excel();
    // const workbook = await otherExcel.read('./tests/test1.xls')
    // const worksheet = workbook.getWorksheet(1);
  }