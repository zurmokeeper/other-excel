import OtherExcel from './index';
// import _ from 'lodash';
import { z } from 'zod';


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
    // console.log('workbook1', workbook1)
    const worksheet = workbook1.getWorksheet(0)
    // console.log('worksheet', worksheet)
    const cell = worksheet.getCell('A3')
    console.log('cell', cell)

    const worksheet1 = workbook1.getWorksheet(1)
    worksheet1.getCell('A3')

    // const row = worksheet.getRow(3)
    // console.log('row', row)

    // const col = worksheet.getColumn(0)
    // console.log('col', col)

    // const rows = worksheet.getRows(-2, 4)
    // console.log('rows', rows)

    // const col = worksheet.getColumn(0)
    // console.log('row', col)
}

name()

// DBCell--> { dbRtrw: 158 }
// DBCell--> { dbRtrw: 136 }

// const MAX_COL_NUM = 100; // 替换为实际的最大列数

// // 定义一个 Zod 模式来验证 start 和 end 参数
// const getRowsSchema = z.object({
//   start: z.number()
//   .nonnegative({message: 'start must be greater than or equal to 0.'})
//   .int({message: 'start must be an integer.'}),
//   end: z.number().nonnegative().int(),
// }).refine(data => data.start < data.end, {
//   message: 'start must be less than end.',
// }).refine(data => data.end <= MAX_COL_NUM, {
//   message: `end must be less than or equal to ${MAX_COL_NUM}.`,
// });

// function getRows(start: number, end: number) {
//   // 使用 Zod 验证参数
//   getRowsSchema.parse({ start, end });

//   // 参数验证通过，继续执行函数逻辑
//   console.log(`Fetching rows from ${start} to ${end}`);
// }

// getRows(1, 1000)