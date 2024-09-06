# other-excel


other-excel is a library for working with excel. including xls reading and writing.

PS：Exporting xls is not supported yet

## Special Notes
Inspired by [xlsx](https://www.npmjs.com/package/xlsx), some of the source code was copied directly from [xlsx](https://www.npmjs.com/package/xlsx)

**The reason for all the rewrites is that the community version of xlsx is not going to be updated anymore, and also the API for xlsx is really unfriendly and costly to use, as well as the readability of the source code is not good. So use TS to rewrite it, and the API is designed and returned more friendly.**


## Contents

- [other-excel](#other-excel)
  - [Special Notes](#special-notes)
  - [Contents](#contents)
  - [Install](#install)
  - [Examples](#examples)
  - [Tests](#tests)
  - [Todo](#todo)
  - [Resources](#resources)


## Install

```
npm/yarn/pnpm install other-excel
```

## Examples

```

use commonjs:

const OtherExcel = require('other-excel').default;

(async ()=>{
        const otherExcel = new OtherExcel();
        const workbook = await otherExcel.read('./test.xls');

        Get sheetNames:
        workbook.sheetNames -> ['Sheet1', 'Sheet2', 'Sheet3']

        Get index to get worksheet:
        const worksheet = workbook.getWorksheet(0);

        Get the name of the worksheet:
        const worksheet = workbook.getWorksheet('Sheet1');

        Get the contents of a cell in a row:
        const row = worksheet.getRow(0);  // Subscript 0 indicates row 1 

        Getting the contents of certain lines: 
        const rows = worksheet.getRows(0, 2);  // Get the contents of rows 1 through 3

        Get the contents of a cell in a col:
        const col = worksheet.getColumn(0);  // Subscript 0 indicates row 1 
        const col = worksheet.getColumn('A');  // A indicates row 1 

        Getting the contents of certain lines: 
        const cols = worksheet.getColumns(0, 2);  // Get the contents of cols 1 through 3

        Get the contents of a cell directly:
        const cell = worksheet.getCell('A1');
        const cell = worksheet.getCell(0, 0);

        Get the total number of rows on the worksheet that actually have cell data.
        worksheet.actualRowCount

        There are many more attributes that can be viewed directly in the .d.ts declaration file...

})()

```


PRs are welcome!

## Tests

With Jest:

```
pnpm i 
pnpm run test
```

## Todo

* [x] Add tests
* [x] Supports reading of more attributes
* [x] Support for xls file export


## Resources


* Technical Documents <https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/cd03cb5f-ca02-4934-a391-bb674cb8aa06>


