import OtherExcel from './index';


async function name() {
    const otherExcel = new OtherExcel()
    // const workbook1 = await otherExcel.read('./tests/test1.xls')
    const workbook1 = await otherExcel.read('../tests/test1.xls')


    // workbook1.setWorksheet()
    const worksheet = workbook1.getWorksheet(0)
    worksheet.getCell()

    const worksheet1 = workbook1.getWorksheet(1)
    worksheet1.getCell()

}

name()