// import XLSX from 'xlsx';
// const CFB = XLSX.CFB;

// // Custprops: {
// //     SystemIdentifier: 131082,
// //     CodePage: 1200,
// //     Locale: 2052,
// //     Company: '',  // TODO:
// //     ScaleCrop: false,
// //     LinksUpToDate: false,
// //     FMTID: [
// //       '02d5cdd59c2e1b10939708002b2cf9ae',
// //       '05d5cdd59c2e1b10939708002b2cf9ae'
// //     ],
// //     undefined: 2052,
// //     ICV: 'F574F8F05D72459192C0C00BD7E4CAB4_11',
// //     KSOProductBuildVer: '2052-12.1.0.17827',   // TODO:
// //     Author: '13675',  // TODO:
// //     LastAuthor: '13675',  // TODO:
// //     CreatedDate: '2024-08-11T07:56:53Z',  // TODO:
// //     ModifiedDate: '2024-08-16T16:05:13Z',  // TODO:
// //     Application: 'WPS 表格'  // TODO:
// //   },

// /* [MS-OLEPS] 2.2 PropertyType */
// // Note: some tree shakers cannot handle VT_VECTOR | $CONST, hence extra vars
// //var VT_EMPTY    = 0x0000;
// //var VT_NULL     = 0x0001;
// var VT_I2       = 0x0002;
// var VT_I4       = 0x0003;
// //var VT_R4       = 0x0004;
// //var VT_R8       = 0x0005;
// //var VT_CY       = 0x0006;
// //var VT_DATE     = 0x0007;
// //var VT_BSTR     = 0x0008;
// //var VT_ERROR    = 0x000A;
// var VT_BOOL     = 0x000B;
// var VT_VARIANT  = 0x000C;
// //var VT_DECIMAL  = 0x000E;
// //var VT_I1       = 0x0010;
// //var VT_UI1      = 0x0011;
// //var VT_UI2      = 0x0012;
// var VT_UI4      = 0x0013;
// //var VT_I8       = 0x0014;
// //var VT_UI8      = 0x0015;
// //var VT_INT      = 0x0016;
// //var VT_UINT     = 0x0017;
// var VT_LPSTR    = 0x001E;
// //var VT_LPWSTR   = 0x001F;
// var VT_FILETIME = 0x0040;
// var VT_BLOB     = 0x0041;
// //var VT_STREAM   = 0x0042;
// //var VT_STORAGE  = 0x0043;
// //var VT_STREAMED_Object  = 0x0044;
// //var VT_STORED_Object    = 0x0045;
// //var VT_BLOB_Object      = 0x0046;
// var VT_CF       = 0x0047;
// //var VT_CLSID    = 0x0048;
// //var VT_VERSIONED_STREAM = 0x0049;
// var VT_VECTOR   = 0x1000;
// var VT_VECTOR_VARIANT = 0x100C;
// var VT_VECTOR_LPSTR   = 0x101E;
// //var VT_ARRAY    = 0x2000;

// var VT_STRING   = 0x0050; // 2.3.3.1.11 VtString
// var VT_USTR     = 0x0051; // 2.3.3.1.12 VtUnalignedString
// var VT_CUSTOM   = [VT_STRING, VT_USTR];

// /* [MS-OLEPS] 2.20 PropertySet */
// function parsePropertySet(blob: any, PIDSI: any) {
// 	var start_addr = blob.l;
// 	var size = blob.read_shift(4);
// 	var NumProps = blob.read_shift(4);
// 	var Props = [], i = 0;
// 	var CodePage = 0;
// 	var Dictionary = -1, DictObj = ({});
// 	for(i = 0; i != NumProps; ++i) {
// 		var PropID = blob.read_shift(4);
// 		var Offset = blob.read_shift(4);
// 		Props[i] = [PropID, Offset + start_addr];
// 	}
// 	Props.sort(function(x,y) { return x[1] - y[1]; });
// 	var PropH = {};
// 	for(i = 0; i != NumProps; ++i) {
// 		if(blob.l !== Props[i][1]) {
// 			var fail = true;
// 			if(i>0 && PIDSI) switch(PIDSI[Props[i-1][0]].t) {
// 				case 0x02 /*VT_I2*/: if(blob.l+2 === Props[i][1]) { blob.l+=2; fail = false; } break;
// 				case 0x50 /*VT_STRING*/: if(blob.l <= Props[i][1]) { blob.l=Props[i][1]; fail = false; } break;
// 				case 0x100C /*VT_VECTOR|VT_VARIANT*/: if(blob.l <= Props[i][1]) { blob.l=Props[i][1]; fail = false; } break;
// 			}
// 			if((!PIDSI||i==0) && blob.l <= Props[i][1]) { fail=false; blob.l = Props[i][1]; }
// 			if(fail) throw new Error("Read Error: Expected address " + Props[i][1] + ' at ' + blob.l + ' :' + i);
// 		}
// 		if(PIDSI) {
// 			var piddsi = PIDSI[Props[i][0]];
// 			PropH[piddsi.n] = parse_TypedPropertyValue(blob, piddsi.t, {raw:true});
// 			if(piddsi.p === 'version') PropH[piddsi.n] = String(PropH[piddsi.n] >> 16) + "." + ("0000" + String(PropH[piddsi.n] & 0xFFFF)).slice(-4);
// 			if(piddsi.n == "CodePage") switch(PropH[piddsi.n]) {
// 				case 0: PropH[piddsi.n] = 1252;
// 					/* falls through */
// 				case 874:
// 				case 932:
// 				case 936:
// 				case 949:
// 				case 950:
// 				case 1250:
// 				case 1251:
// 				case 1253:
// 				case 1254:
// 				case 1255:
// 				case 1256:
// 				case 1257:
// 				case 1258:
// 				case 10000:
// 				case 1200:
// 				case 1201:
// 				case 1252:
// 				case 65000: case -536:
// 				case 65001: case -535:
// 					set_cp(CodePage = (PropH[piddsi.n]>>>0) & 0xFFFF); break;
// 				default: throw new Error("Unsupported CodePage: " + PropH[piddsi.n]);
// 			}
// 		} else {
// 			if(Props[i][0] === 0x1) {
// 				CodePage = PropH.CodePage = (parse_TypedPropertyValue(blob, VT_I2));
// 				set_cp(CodePage);
// 				if(Dictionary !== -1) {
// 					var oldpos = blob.l;
// 					blob.l = Props[Dictionary][1];
// 					DictObj = parse_dictionary(blob,CodePage);
// 					blob.l = oldpos;
// 				}
// 			} else if(Props[i][0] === 0) {
// 				if(CodePage === 0) { Dictionary = i; blob.l = Props[i+1][1]; continue; }
// 				DictObj = parse_dictionary(blob,CodePage);
// 			} else {
// 				var name = DictObj[Props[i][0]];
// 				var val;
// 				/* [MS-OSHARED] 2.3.3.2.3.1.2 + PROPVARIANT */
// 				switch(blob[blob.l]) {
// 					case 0x41 /*VT_BLOB*/: blob.l += 4; val = parse_BLOB(blob); break;
// 					case 0x1E /*VT_LPSTR*/: blob.l += 4; val = parse_VtString(blob, blob[blob.l-4]).replace(/\u0000+$/,""); break;
// 					case 0x1F /*VT_LPWSTR*/: blob.l += 4; val = parse_VtString(blob, blob[blob.l-4]).replace(/\u0000+$/,""); break;
// 					case 0x03 /*VT_I4*/: blob.l += 4; val = blob.read_shift(4, 'i'); break;
// 					case 0x13 /*VT_UI4*/: blob.l += 4; val = blob.read_shift(4); break;
// 					case 0x05 /*VT_R8*/: blob.l += 4; val = blob.read_shift(8, 'f'); break;
// 					case 0x0B /*VT_BOOL*/: blob.l += 4; val = parsebool(blob, 4); break;
// 					case 0x40 /*VT_FILETIME*/: blob.l += 4; val = parseDate(parse_FILETIME(blob)); break;
// 					default: throw new Error("unparsed value: " + blob[blob.l]);
// 				}
// 				PropH[name] = val;
// 			}
// 		}
// 	}
// 	blob.l = start_addr + size; /* step ahead to skip padding */
// 	return PropH;
// }

// /* [MS-OLEPS] 2.21 PropertySetStream */
// function parsePropertySetStream(file: any, PIDSI: any, clsid: string) {
// 	const blob = file.content;
// 	if(!blob) return {};
// 	CFB.utils.prep_blob(blob, 0);

// 	let NumSets, FMTID0, FMTID1, Offset0, Offset1 = 0;
// 	blob.chk('feff', 'Byte Order: ');

// 	/*var vers = */blob.read_shift(2); // TODO: check version
// 	const SystemIdentifier = blob.read_shift(4);
// 	const CLSID = blob.read_shift(16);
// 	if(CLSID !== CFB.utils.consts.HEADER_CLSID && CLSID !== clsid) {
//         throw new Error("Bad PropertySet CLSID " + CLSID);
//     }
// 	NumSets = blob.read_shift(4);
// 	if(NumSets !== 1 && NumSets !== 2) throw new Error("Unrecognized #Sets: " + NumSets);
// 	FMTID0 = blob.read_shift(16); 
//     Offset0 = blob.read_shift(4);

// 	if(NumSets === 1 && Offset0 !== blob.l) {
//         throw new Error("Length mismatch: " + Offset0 + " !== " + blob.l);
//     } else if(NumSets === 2) { 
//         FMTID1 = blob.read_shift(16); 
//         Offset1 = blob.read_shift(4); 
//     }
// 	var PSet0 = parsePropertySet(blob, PIDSI);

// 	var rval = { SystemIdentifier: SystemIdentifier };
// 	for(var y in PSet0) {
//         rval[y] = PSet0[y];
//     }
// 	//rval.blob = blob;
// 	rval.FMTID = FMTID0;
// 	//rval.PSet0 = PSet0;
// 	if(NumSets === 1) return rval;
// 	if(Offset1 - blob.l == 2) blob.l += 2;
// 	if(blob.l !== Offset1) throw new Error("Length mismatch 2: " + blob.l + " !== " + Offset1);
// 	var PSet1;
// 	try { 
//         PSet1 = parsePropertySet(blob, null); 
//     } catch(e) {
//         /* empty */
//     }
// 	for(y in PSet1) rval[y] = PSet1[y];
// 	rval.FMTID = [FMTID0, FMTID1]; // TODO: verify FMTID0/1
// 	return rval;
// }
// /* [MS-OSHARED] 2.3.3.2.2.1 Document Summary Information PIDDSI */
// const DocSummaryPIDDSI = {
//     0x01: { n: 'CodePage', t: VT_I2 },
//     0x02: { n: 'Category', t: VT_STRING },
//     0x03: { n: 'PresentationFormat', t: VT_STRING },
//     0x04: { n: 'ByteCount', t: VT_I4 },
//     0x05: { n: 'LineCount', t: VT_I4 },
//     0x06: { n: 'ParagraphCount', t: VT_I4 },
//     0x07: { n: 'SlideCount', t: VT_I4 },
//     0x08: { n: 'NoteCount', t: VT_I4 },
//     0x09: { n: 'HiddenCount', t: VT_I4 },
//     0x0a: { n: 'MultimediaClipCount', t: VT_I4 },
//     0x0b: { n: 'ScaleCrop', t: VT_BOOL },
//     0x0c: { n: 'HeadingPairs', t: VT_VECTOR_VARIANT /* VT_VECTOR | VT_VARIANT */ },
//     0x0d: { n: 'TitlesOfParts', t: VT_VECTOR_LPSTR /* VT_VECTOR | VT_LPSTR */ },
//     0x0e: { n: 'Manager', t: VT_STRING },
//     0x0f: { n: 'Company', t: VT_STRING },
//     0x10: { n: 'LinksUpToDate', t: VT_BOOL },
//     0x11: { n: 'CharacterCount', t: VT_I4 },
//     0x13: { n: 'SharedDoc', t: VT_BOOL },
//     0x16: { n: 'HyperlinksChanged', t: VT_BOOL },
//     0x17: { n: 'AppVersion', t: VT_I4, p: 'version' },
//     0x18: { n: 'DigSig', t: VT_BLOB },
//     0x1A: { n: 'ContentType', t: VT_STRING },
//     0x1B: { n: 'ContentStatus', t: VT_STRING },
//     0x1C: { n: 'Language', t: VT_STRING },
//     0x1D: { n: 'Version', t: VT_STRING },
//     0xFF: {},
//         /* [MS-OLEPS] 2.18 */
//     0x80000000: { n: 'Locale', t: VT_UI4 },
//     0x80000003: { n: 'Behavior', t: VT_UI4 },
//     0x72627262: {}
// };

// const SummaryPIDSI = {
//     0x01: { n: 'CodePage', t: VT_I2 },
//     0x02: { n: 'Title', t: VT_STRING },
//     0x03: { n: 'Subject', t: VT_STRING },
//     0x04: { n: 'Author', t: VT_STRING },
//     0x05: { n: 'Keywords', t: VT_STRING },
//     0x06: { n: 'Comments', t: VT_STRING },
//     0x07: { n: 'Template', t: VT_STRING },
//     0x08: { n: 'LastAuthor', t: VT_STRING },
//     0x09: { n: 'RevNumber', t: VT_STRING },
//     0x0A: { n: 'EditTime', t: VT_FILETIME },
//     0x0B: { n: 'LastPrinted', t: VT_FILETIME },
//     0x0C: { n: 'CreatedDate', t: VT_FILETIME },
//     0x0D: { n: 'ModifiedDate', t: VT_FILETIME },
//     0x0E: { n: 'PageCount', t: VT_I4 },
//     0x0F: { n: 'WordCount', t: VT_I4 },
//     0x10: { n: 'CharCount', t: VT_I4 },
//     0x11: { n: 'Thumbnail', t: VT_CF },
//     0x12: { n: 'Application', t: VT_STRING },
//     0x13: { n: 'DocSecurity', t: VT_I4 },
//     0xFF: {},
//         /* [MS-OLEPS] 2.18 */
//     0x80000000: { n: 'Locale', t: VT_UI4 },
//     0x80000003: { n: 'Behavior', t: VT_UI4 },
//     0x72627262: {}
// };
// const PSCLSID = {
// 	SI: "e0859ff2f94f6810ab9108002b27b3d9",
// 	DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
// 	UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
// };

// function parseProperty(cfb: any, options?: any) {

//     // if(cfb.FullPaths) parse_xls_props(cfb, props, options);
//     const props = {};

// 	/* [MS-OSHARED] 2.3.3.2.2 Document Summary Information Property Set */
// 	const documentSummaryInformation = CFB.find(cfb, '/!DocumentSummaryInformation');
// 	if(documentSummaryInformation?.size > 0) {
//         try {
//             const docSummary = parsePropertySetStream(documentSummaryInformation, DocSummaryPIDDSI, PSCLSID.DSI);
//             for(var d in docSummary) {
//                 props[d] = docSummary[d];
//             }
//         } catch(e) {
//             if(options.WTF) throw e;/* empty */
//         }
//     }

// 	/* [MS-OSHARED] 2.3.3.2.1 Summary Information Property Set*/
// 	const summaryInformation = CFB.find(cfb, '/!SummaryInformation');
// 	if(summaryInformation?.size > 0) {
//         try {
//             const summary = parsePropertySetStream(summaryInformation, SummaryPIDSI, PSCLSID.SI);
//             for(var s in summary) {
//                 if(props[s] == null) props[s] = summary[s];
//             }

//         } catch(e) {
//             if(options.WTF) throw e;/* empty */
//         }
//     }

// 	// if(props.HeadingPairs && props.TitlesOfParts) {
// 	// 	load_props_pairs(props.HeadingPairs, props.TitlesOfParts, props, o);
// 	// 	delete props.HeadingPairs; 
//     //     delete props.TitlesOfParts;
// 	// }
// }