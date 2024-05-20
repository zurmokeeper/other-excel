
const fs = require('fs');
const CFB = require('cfb');

const file = fs.readFileSync('test1.xls');
const cfb = CFB.read(file, {type: 'buffer'});
const Workbook = CFB.find(cfb, '/Workbook');


const a1 = 14994;
const a2 = 15566;
const bof = Workbook.content.readUInt16LE(a1);

// const bof = file.readUInt16LE(a1);
console.log('xx-->', bof)
const oofh = bof.toString(16)
console.log('xx-->', oofh)

const bof2 = Workbook.content.readUInt16LE(a2);
console.log('xx-->', bof2)
const oofh2 = bof2.toString(16)
console.log('xx-->', oofh2)