
// const ExcelJS = require('exceljs');
// let workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('path/to/your/excel/file.xlsx')
// const worksheet = workbook.getWorksheet(1);

// const buffer = Buffer.from('9e00000028002a001c00', 'hex')
// const num = buffer.readUInt32LE(0)   //158
// console.log('------>xx', num)
// const num2 = buffer.readUInt16LE(4)  //40
// console.log('------>xx', num2)


// const lbPlyPosbuffer = Buffer.from('ce3c0000', 'hex')
// const lbPlyPos = lbPlyPosbuffer.readUInt32LE(0)   
// console.log('------>xx', lbPlyPos)  // 15566


// const lbPlyPos2buffer = Buffer.from('923a0000', 'hex')
// const lbPlyPos2 = lbPlyPos2buffer.readUInt32LE(0)   
// console.log('------>xx', lbPlyPos2)  // 14994

const xlsx = require('xlsx');

    // xlsx.read()
// let workbook = xlsx.readFile("test1.xls")
let workbook = xlsx.readFile("test1-merge.xls")
// console.log('------>workbook', workbook)  // 14994

console.log('------>workbook', workbook.Workbook.Sheets)  // 14994
console.log('------>workbook', workbook)  // 14994

console.log('------>workbook', workbook.Sheets['Sheet1休息休息吧'])
// 158

// {
//     "header": "08021000",
//     "num": 520,
//     "size": 16,
//     "record": "02000000070018010000000000010f00",
//     "l": 15296
//   },

//   ROW + DBCell.dbRtrw = 15296 + 158 = 15454

// //   DBCELL
//   {
//     "header": "d7000a00",
//     "num": 215,
//     "size": 10,
//     "record": "9e00000028002a001c00",
//     "l": 15454
//   },

//   DBCELL
// {
//     "header": "d7000c00",
//     "num": 215,
//     "size": 12,
//     "record": "880000003c000e000e000e00",
//     "l": 16036
//   },
// 16036

// 第一个row的位置 + DBCell.dbRtrw
// ROW + DBCell.dbRtrw = 15900 + 136 = 16036