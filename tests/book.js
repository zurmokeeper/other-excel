
const CFB = require('cfb');
const fs = require('fs').promises;
const _ = require('lodash');

const recordNameNum = {
  'Formula': 6,
  'EOF': 10,
  'CalcCount': 12,
  'CalcMode': 13,
  'CalcPrecision': 14,
  'CalcRefMode': 15,
  'CalcDelta': 16,
  'CalcIter': 17,
  'Protect': 18,
  'Password': 19,
  'Header': 20,
  'Footer': 21,
  'ExternSheet': 23,
  'Lbl': 24,
  'WinProtect': 25,
  'VerticalPageBreaks': 26,
  'HorizontalPageBreaks': 27,
  'Note': 28,
  'Selection': 29,
  'Date1904': 34,
  'ExternName': 35,
  'LeftMargin': 38,
  'RightMargin': 39,
  'TopMargin': 40,
  'BottomMargin': 41,
  'PrintRowCol': 42,
  'PrintGrid': 43,
  'FilePass': 47,
  'Font': 49,
  'PrintSize': 51,
  'Continue': 60,
  'Window1': 61,
  'Backup': 64,
  'Pane': 65,
  'CodePage': 66,
  'Pls': 77,
  'DCon': 80,
  'DConRef': 81,
  'DConName': 82,
  'DefColWidth': 85,
  'XCT': 89,
  'CRN': 90,
  'FileSharing': 91,
  'WriteAccess': 92,
  'Obj': 93,
  'Uncalced': 94,
  'CalcSaveRecalc': 95,
  'Template': 96,
  'Intl': 97,
  'ObjProtect': 99,
  'ColInfo': 125,
  'Guts': 128,
  'WsBool': 129,
  'GridSet': 130,
  'HCenter': 131,
  'VCenter': 132,
  'BoundSheet8': 133,
  'WriteProtect': 134,
  'Country': 140,
  'HideObj': 141,
  'Sort': 144,
  'Palette': 146,
  'Sync': 151,
  'LPr': 152,
  'DxGCol': 153,
  'FnGroupName': 154,
  'FilterMode': 155,
  'BuiltInFnGroupCount': 156,
  'AutoFilterInfo': 157,
  'AutoFilter': 158,
  'Scl': 160,
  'Setup': 161,
  'ScenMan': 174,
  'SCENARIO': 175,
  'SxView': 176,
  'Sxvd': 177,
  'SXVI': 178,
  'SxIvd': 180,
  'SXLI': 181,
  'SXPI': 182,
  'DocRoute': 184,
  'RecipName': 185,
  'MulRk': 189,
  'MulBlank': 190,
  'Mms': 193,
  'SXDI': 197,
  'SXDB': 198,
  'SXFDB': 199,
  'SXDBB': 200,
  'SXNum': 201,
  'SxBool': 202,
  'SxErr': 203,
  'SXInt': 204,
  'SXString': 205,
  'SXDtr': 206,
  'SxNil': 207,
  'SXTbl': 208,
  'SXTBRGIITM': 209,
  'SxTbpg': 210,
  'ObProj': 211,
  'SXStreamID': 213,
  'DBCell': 215,
  'SXRng': 216,
  'SxIsxoper': 217,
  'BookBool': 218,
  'DbOrParamQry': 220,
  'ScenarioProtect': 221,
  'OleObjectSize': 222,
  'XF': 224,
  'InterfaceHdr': 225,
  'InterfaceEnd': 226,
  'SXVS': 227,
  'MergeCells': 229,
  'BkHim': 233,
  'MsoDrawingGroup': 235,
  'MsoDrawing': 236,
  'MsoDrawingSelection': 237,
  'PhoneticInfo': 239,
  'SxRule': 240,
  'SXEx': 241,
  'SxFilt': 242,
  'SxDXF': 244,
  'SxItm': 245,
  'SxName': 246,
  'SxSelect': 247,
  'SXPair': 248,
  'SxFmla': 249,
  'SxFormat': 251,
  'SST': 252,
  'LabelSst': 253,
  'ExtSST': 255,
  'SXVDEx': 256,
  'SXFormula': 259,
  'SXDBEx': 290,
  'RRDInsDel': 311,
  'RRDHead': 312,
  'RRDChgCell': 315,
  'RRTabId': 317,
  'RRDRenSheet': 318,
  'RRSort': 319,
  'RRDMove': 320,
  'RRFormat': 330,
  'RRAutoFmt': 331,
  'RRInsertSh': 333,
  'RRDMoveBegin': 334,
  'RRDMoveEnd': 335,
  'RRDInsDelBegin': 336,
  'RRDInsDelEnd': 337,
  'RRDConflict': 338,
  'RRDDefName': 339,
  'RRDRstEtxp': 340,
  'LRng': 351,
  'UsesELFs': 352,
  'DSF': 353,
  'CUsr': 401,
  'CbUsr': 402,
  'UsrInfo': 403,
  'UsrExcl': 404,
  'FileLock': 405,
  'RRDInfo': 406,
  'BCUsrs': 407,
  'UsrChk': 408,
  'UserBView': 425,
  'UserSViewBegin': 426,
  'UserSViewBegin_Chart': 426,
  'UserSViewEnd': 427,
  'RRDUserView': 428,
  'Qsi': 429,
  'SupBook': 430,
  'Prot4Rev': 431,
  'CondFmt': 432,
  'CF': 433,
  'DVal': 434,
  'DConBin': 437,
  'TxO': 438,
  'RefreshAll': 439,
  'HLink': 440,
  'Lel': 441,
  'CodeName': 442,
  'SXFDBType': 443,
  'Prot4RevPass': 444,
  'ObNoMacros': 445,
  'Dv': 446,
  'Excel9File': 448,
  'RecalcId': 449,
  'EntExU2': 450,
  'Dimensions': 512,
  'Blank': 513,
  'Number': 515,
  'Label': 516,
  'BoolErr': 517,
  'String': 519,
  'Row': 520,
  'Index': 523,
  'Array': 545,
  'DefaultRowHeight': 549,
  'Table': 566,
  'Window2': 574,
  'RK': 638,
  'Style': 659,
  'BigName': 1048,
  'Format': 1054,
  'ContinueBigName': 1084,
  'ShrFmla': 1212,
  'HLinkTooltip': 2048,
  'WebPub': 2049,
  'QsiSXTag': 2050,
  'DBQueryExt': 2051,
  'ExtString': 2052,
  'TxtQry': 2053,
  'Qsir': 2054,
  'Qsif': 2055,
  'RRDTQSIF': 2056,
  'BOF': 2057,
  'OleDbConn': 2058,
  'WOpt': 2059,
  'SXViewEx': 2060,
  'SXTH': 2061,
  'SXPIEx': 2062,
  'SXVDTEx': 2063,
  'SXViewEx9': 2064,
  'ContinueFrt': 2066,
  'RealTimeData': 2067,
  'ChartFrtInfo': 2128,
  'FrtWrapper': 2129,
  'StartBlock': 2130,
  'EndBlock': 2131,
  'StartObject': 2132,
  'EndObject': 2133,
  'CatLab': 2134,
  'YMult': 2135,
  'SXViewLink': 2136,
  'PivotChartBits': 2137,
  'FrtFontList': 2138,
  'SheetExt': 2146,
  'BookExt': 2147,
  'SXAddl': 2148,
  'CrErr': 2149,
  'HFPicture': 2150,
  'FeatHdr': 2151,
  'Feat': 2152,
  'DataLabExt': 2154,
  'DataLabExtContents': 2155,
  'CellWatch': 2156,
  'FeatHdr11': 2161,
  'Feature11': 2162,
  'DropDownObjIds': 2164,
  'ContinueFrt11': 2165,
  'DConn': 2166,
  'List12': 2167,
  'Feature12': 2168,
  'CondFmt12': 2169,
  'CF12': 2170,
  'CFEx': 2171,
  'XFCRC': 2172,
  'XFExt': 2173,
  'AutoFilter12': 2174,
  'ContinueFrt12': 2175,
  'MDTInfo': 2180,
  'MDXStr': 2181,
  'MDXTuple': 2182,
  'MDXSet': 2183,
  'MDXProp': 2184,
  'MDXKPI': 2185,
  'MDB': 2186,
  'PLV': 2187,
  'Compat12': 2188,
  'DXF': 2189,
  'TableStyles': 2190,
  'TableStyle': 2191,
  'TableStyleElement': 2192,
  'StyleExt': 2194,
  'NamePublish': 2195,
  'NameCmt': 2196,
  'SortData': 2197,
  'Theme': 2198,
  'GUIDTypeLib': 2199,
  'FnGrp12': 2200,
  'NameFnGrp12': 2201,
  'MTRSettings': 2202,
  'CompressPictures': 2203,
  'HeaderFooter': 2204,
  'CrtLayout12': 2205,
  'CrtMlFrt': 2206,
  'CrtMlFrtContinue': 2207,
  'ForceFullCalculation': 2211,
  'ShapePropsStream': 2212,
  'TextPropsStream': 2213,
  'RichTextStream': 2214,
  'CrtLayout12A': 2215,
  'Units': 4097,
  'Chart': 4098,
  'Series': 4099,
  'DataFormat': 4102,
  'LineFormat': 4103,
  'MarkerFormat': 4105,
  'AreaFormat': 4106,
  'PieFormat': 4107,
  'AttachedLabel': 4108,
  'SeriesText': 4109,
  'ChartFormat': 4116,
  'Legend': 4117,
  'SeriesList': 4118,
  'Bar': 4119,
  'Line': 4120,
  'Pie': 4121,
  'Area': 4122,
  'Scatter': 4123,
  'CrtLine': 4124,
  'Axis': 4125,
  'Tick': 4126,
  'ValueRange': 4127,
  'CatSerRange': 4128,
  'AxisLine': 4129,
  'CrtLink': 4130,
  'DefaultText': 4132,
  'Text': 4133,
  'FontX': 4134,
  'ObjectLink': 4135,
  'Frame': 4146,
  'Begin': 4147,
  'End': 4148,
  'PlotArea': 4149,
  'Chart3d': 4154,
  'PicF': 4156,
  'DropBar': 4157,
  'Radar': 4158,
  'Surf': 4159,
  'RadarArea': 4160,
  'AxisParent': 4161,
  'LegendException': 4163,
  'ShtProps': 4164,
  'SerToCrt': 4165,
  'AxesUsed': 4166,
  'SBaseRef': 4168,
  'SerParent': 4170,
  'SerAuxTrend': 4171,
  'IFmtRecord': 4174,
  'Pos': 4175,
  'AlRuns': 4176,
  'BRAI': 4177,
  'SerAuxErrBar': 4187,
  'ClrtClient': 4188,
  'SerFmt': 4189,
  'Chart3DBarShape': 4191,
  'Fbi': 4192,
  'BopPop': 4193,
  'AxcExt': 4194,
  'Dat': 4195,
  'PlotGrowth': 4196,
  'SIIndex': 4197,
  'GelFrame': 4198,
  'BopPopCustom': 4199,
  'Fbi2': 4200,
};

async function test() {
    // const input = await fs.readFile(`./sample3.xls`);
    // const input = await fs.readFile(`./test1.xls`);
    // const input = await fs.readFile(`./test1-merge.xls`);
    const input = await fs.readFile(`./wps-plain.xls`);
    const cfb = CFB.read(input, {type: 'buffer'});
    const Workbook = CFB.find(cfb, 'Workbook') || CFB.find(cfb, 'Book') ;
    let workbookContent = Workbook.content;

    const dataList = iterRecord(workbookContent);

    // await fs.writeFile(`./record-test1.json`, JSON.stringify(dataList));



    let list = dataList.map((item)=>item.num);
    const num = reverse(recordNameNum);
    const data = {};
    // list.forEach((item)=>{
    //   data[item] = num[item]
    // })

    dataList.forEach((item)=>{
      if(num[item.num]) {
        item.type = num[item.num];
      }
    })
    await fs.writeFile(`./wps-plain.json`, JSON.stringify(dataList));
    return;
    
    // await fs.writeFile(`./record-data-uniq.json`, JSON.stringify(data));

    const arr = list.map((item)=>{
      return {num: item, value: num[item]}
    })

    await fs.writeFile(`./record-list-merge.json`, JSON.stringify(arr));

    // await fs.writeFile(`./record-list.json`, JSON.stringify(arr));

    // list = _.sortBy(_.uniq(list)) 
    // console.log('list', list, list.length)



}

async function test2(){
  // const input = await fs.readFile(`./sample3.xls`);
  // const input = await fs.readFile(`./wps-plain.xls`);
  const input = await fs.readFile(`./wps-plain-java-pass.xls`);
  const cfb = CFB.read(input, {type: 'buffer'});
  const Workbook = CFB.find(cfb, 'Workbook') || CFB.find(cfb, 'Book') ;
  let workbookContent = Workbook.content;

  let dataList = iterRecord(workbookContent);

  dataList = _.orderBy(dataList, 'num')

  // await fs.writeFile(`./record-wps-plain.json`, JSON.stringify(dataList));
  await fs.writeFile(`./record-wps-plain-java-pass.json`, JSON.stringify(dataList));

  // let list = dataList.map((item)=>item.num);
  // const num = reverse(recordNameNum);
  // const data = {};
  // list.forEach((item)=>{
  //   data[item] = num[item]
  // })
  
  // await fs.writeFile(`./record-data-uniq.json`, JSON.stringify(data));

  // const arr = list.map((item)=>{
  //   return {num: item, value: num[item]}
  // })

  // await fs.writeFile(`./record-list.json`, JSON.stringify(arr));

  // list = _.sortBy(_.uniq(list)) 
  // console.log('list', list, list.length)



}

function reverse(data){
  const reversedData = {};
  for (let key in data) {
    reversedData[data[key]] = key;
  }
  return reversedData
}

test()
// test2()

function iterRecord(blob) {
    const dataList = [];
    while (true) {
      const h = blob.read_shift(4);
      if (!h) {
        break;
      }
      blob.l = blob.l - 4; // 重置偏移量
      const l = blob.l;
      const header = blob.slice(blob.l, blob.l + 4);
      const num = blob.read_shift(2);
      const size = blob.read_shift(2);
      const record = blob.slice(blob.l, blob.l + size);
      // const temp = {header, num, size, record};
      const temp = {header: header.toString('hex'), num, size, record: record.toString('hex'), l};
    //   if (num === recordNameNum.Font && dataList.length === 44) {
        
    //   } else {
    //     dataList.push(temp);
    //   }
      dataList.push(temp);
      blob.l = blob.l + size;
    }
    return dataList;
  }


//   list [
//     10,   12,   13,   14,   15,   16,   17,   18,   19,   20,
//     21,   25,   29,   34,   38,   39,   40,   41,   42,   43,
//     49,   61,   64,   66,   85,   92,   95,  125,  128,  129,
//    130,  131,  132,  133,  140,  141,  153,  161,  193,  215,
//    218,  224,  225,  226,  252,  253,  255,  317,  352,  353,
//    431,  439,  444,  448,  449,  512,  520,  523,  549,  574,
//    638,  659, 1054, 2057, 2147, 2151, 2172, 2173, 2187, 2188,
//   2189, 2190, 2191, 2192, 2194, 2198, 2202, 2204
// ]

// BOF 14994  EOF  15562 (+4) = 15506

// BOF 15566  EOF  16146 (+4) = 16150


// { 0xD7, "DBCELL",	"Stream Offsets" },
// { "num": 523, "value": "Index" },
// { 0xFC, "SST",	"Shared String Table" },
// { 0xFD, "LABELSST",	"Cell Value, String Constant/SST" },
// { "num": 520, "value": "Row" },
// { "num": 512, "value": "Dimensions" },
// { 0x27E, "RK",	"Cell Value, RK Number" },

// // 拿到范围， 多少行，多少列，以及里面的所有值，还有值的类型

// {
//   "header": "08021000",
//   "num": 520,
//   "size": 16,
//   "record": "02000000070018010000000000010f00",
//   "l": 15296
// },

// ROW + DBCell.dbRtrw = 15296 + 158 = 15454

// //   DBCELL
// {
//   "header": "d7000a00",
//   "num": 215,
//   "size": 10,
//   "record": "9e00000028002a001c00",
//   "l": 15454
// },