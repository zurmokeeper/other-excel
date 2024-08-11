import OtherExcel from './index';
import _ from 'lodash';


async function name() {
    const otherExcel = new OtherExcel()

    const workbook1 = await otherExcel.read('./tests/test1-merge.xls')
    // const workbook1 = await otherExcel.read('../tests/test1.xls') //直接ts-node 用 在src下用
    // const workbook1 = await otherExcel.read('./tests/test1.xls') //直接ts-node 用 在项目目录下 和 tsc
    // console.log('0------->xf', JSON.stringify(workbook1.xfs) )

    // const temp = _.orderBy(workbook1.xfs, ['fontIndex'], ['asc'])
    // console.log('0------->xf sort', JSON.stringify(temp) )

    // console.log('0------->font', JSON.stringify(workbook1.fonts) )

    // console.log('0------->format', JSON.stringify(workbook1.formats) )

    // workbook1.setWorksheet()
    const worksheet = workbook1.getWorksheet(0)
    worksheet.getCell()

    const worksheet1 = workbook1.getWorksheet(1)
    worksheet1.getCell()

}

name()

// DBCell--> { dbRtrw: 158 }
// DBCell--> { dbRtrw: 136 }