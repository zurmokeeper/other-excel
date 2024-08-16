
// const fs = require('fs');
// const CFB = require('cfb');

// const file = fs.readFileSync('test1.xls');
// const cfb = CFB.read(file, {type: 'buffer'});
// const Workbook = CFB.find(cfb, '/Workbook');


// const a1 = 14994;
// const a2 = 15566;
// const bof = Workbook.content.readUInt16LE(a1);

// // const bof = file.readUInt16LE(a1);
// console.log('xx-->', bof)
// const oofh = bof.toString(16)
// console.log('xx-->', oofh)

// const bof2 = Workbook.content.readUInt16LE(a2);
// console.log('xx-->', bof2)
// const oofh2 = bof2.toString(16)
// console.log('xx-->', oofh2)
let totalData = {lens: []};
const buf =  [Buffer.from([0x62]), Buffer.from([0x75, 0x66]), Buffer.from([0x66])] 
let len = 0;  //  continue 前一个记录的数据部分长度
for(let j = 0; j < buf.length; ++j) { 
    console.log('j->', j, len)
    totalData.lens.push(len); 
    console.log('buf[j].length->', buf[j].length)
    len += buf[j].length;  // j = 1, 那每一个continue data部分的长度
    console.log('len->', len)
}
console.log('totalData-->', totalData)