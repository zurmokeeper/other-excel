
// var has_buf = (function() { return typeof Buffer !== 'undefined' && typeof process !== 'undefined' && typeof process.versions !== 'undefined' && !!process.versions.node; })();

// var chr0 = /\u0000/g, chr1 = /[\u0001-\u0006]/g;

// function read_double_le(b: { [x: string]: number; }, idx: number) {
// 	var s = 1 - 2 * (b[idx + 7] >>> 7);
// 	var e = ((b[idx + 7] & 0x7f) << 4) + ((b[idx + 6] >>> 4) & 0x0f);
// 	var m = (b[idx+6]&0x0f);
// 	for(var i = 5; i >= 0; --i) m = m * 256 + b[idx + i];
// 	if(e == 0x7ff) return m == 0 ? (s * Infinity) : NaN;
// 	if(e == 0) e = -1022;
// 	else { e -= 1023; m += Math.pow(2,52); }
// 	return s * Math.pow(2, e - 52) * m;
// }

// var __readUInt8 = function(b: { [x: string]: any; }, idx: string | number) { return b[idx]; };
// var __readUInt16LE = function(b: { [x: string]: number; }, idx: number) { return (b[idx+1]*(1<<8))+b[idx]; };
// var __readInt16LE = function(b: { [x: string]: number; }, idx: number) { var u = (b[idx+1]*(1<<8))+b[idx]; return (u < 0x8000) ? u : ((0xffff - u + 1) * -1); };
// var __readUInt32LE = function(b: { [x: string]: number; }, idx: number) { return b[idx+3]*(1<<24)+(b[idx+2]<<16)+(b[idx+1]<<8)+b[idx]; };
// var __readInt32LE = function(b: { [x: string]: number; }, idx: number) { return (b[idx+3]<<24)|(b[idx+2]<<16)|(b[idx+1]<<8)|b[idx]; };
// var __readInt32BE = function(b: { [x: string]: number; }, idx: number) { return (b[idx]<<24)|(b[idx+1]<<16)|(b[idx+2]<<8)|b[idx+3]; };

// var ___utf16le = function(b: any,s: any,e: number) { var ss=[]; for(var i=s; i<e; i+=2) ss.push(String.fromCharCode(__readUInt16LE(b,i))); return ss.join("").replace(chr0,''); };
// var __utf16le = has_buf ? function(b: { toString: (arg0: string, arg1: any, arg2: any) => string; },s: number | undefined,e: number | undefined) { if(!Buffer.isBuffer(b)) return ___utf16le(b,s,e); return b.toString('utf16le',s,e).replace(chr0,'')/*.replace(chr1,'!')*/; } : ___utf16le;

// var ___hexlify = function(b: { [x: string]: { toString: (arg0: number) => string; }; },s: any,l: any) { var ss=[]; for(var i=s; i<s+l; ++i) ss.push(("0" + b[i].toString(16)).slice(-2)); return ss.join(""); };
// var __hexlify = has_buf ? function(b: { toString: (arg0: string, arg1: any, arg2: any) => any; },s: number | undefined,l: any) { return Buffer.isBuffer(b) ? b.toString('hex',s,s+l) : ___hexlify(b,s,l); } : ___hexlify;

// var ___utf8 = function(b: any,s: any,e: number) { var ss=[]; for(var i=s; i<e; i++) ss.push(String.fromCharCode(__readUInt8(b,i))); return ss.join(""); };
// var __utf8 = has_buf ? function utf8_b(b: { toString: (arg0: string, arg1: any, arg2: any) => any; }, s: number | undefined, e: number | undefined) { return (Buffer.isBuffer(b)) ? b.toString('utf8',s,e) : ___utf8(b,s,e); } : ___utf8;

// var ___utf16le = function(b: any,s: any,e: number) { var ss=[]; for(var i=s; i<e; i+=2) ss.push(String.fromCharCode(__readUInt16LE(b,i))); return ss.join("").replace(chr0,''); };
// var __utf16le = has_buf ? function(b: { toString: (arg0: string, arg1: any, arg2: any) => string; },s: number | undefined,e: number | undefined) { if(!Buffer.isBuffer(b)) return ___utf16le(b,s,e); return b.toString('utf16le',s,e).replace(chr0,'')/*.replace(chr1,'!')*/; } : ___utf16le;

// var ___lpstr = function(b: any,i: number) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
// var __lpstr = ___lpstr;

// var ___cpstr = function(b: any,i: number) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
// var __cpstr = ___cpstr;

// var ___lpwstr = function(b: any,i: number) { var len = 2*__readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
// var __lpwstr = ___lpwstr;

// var ___lpp4 = function lpp4_(b: any,i: number) { var len = __readUInt32LE(b,i); return len > 0 ? __utf16le(b, i+4,i+4+len) : "";};
// var __lpp4 = ___lpp4;

// var ___8lpp4 = function(b: any,i: number) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len) : "";};
// var __8lpp4 = ___8lpp4;

// var ___double = function(b: any, idx: any) { return read_double_le(b, idx);};
// var __double = ___double;

// var _getchar = function _gc1(x: number) { return String.fromCharCode(x); };

// function ReadShift(this: { l: any; read_shift: (size: number, t: string) => number | string; }, size: number, t: string) : number | string {
// 	var o="", oI, oR, oo=[], w, vv, i, loc;
// 	switch(t) {
// 		case 'dbcs':
// 			loc = this.l;
// 			if(has_buf && Buffer.isBuffer(this)) o = this.slice(this.l, this.l+2*size).toString("utf16le");
// 			else for(i = 0; i < size; ++i) { o+=String.fromCharCode(__readUInt16LE(this, loc)); loc+=2; }
// 			size *= 2;
// 			break;

// 		case 'utf8': o = __utf8(this, this.l, this.l + size); break;
// 		case 'utf16le': size *= 2; o = __utf16le(this, this.l, this.l + size); break;

// 		// case 'wstr':
// 		// 	if(typeof $cptable !== 'undefined') o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l+2*size));
// 		// 	else return ReadShift.call(this, size, 'dbcs');
// 		// 	size = 2 * size; break;

// 		/* [MS-OLEDS] 2.1.4 LengthPrefixedAnsiString */
// 		case 'lpstr-ansi': o = __lpstr(this, this.l); size = 4 + __readUInt32LE(this, this.l); break;
// 		case 'lpstr-cp': o = __cpstr(this, this.l); size = 4 + __readUInt32LE(this, this.l); break;
// 		/* [MS-OLEDS] 2.1.5 LengthPrefixedUnicodeString */
// 		case 'lpwstr': o = __lpwstr(this, this.l); size = 4 + 2 * __readUInt32LE(this, this.l); break;
// 		/* [MS-OFFCRYPTO] 2.1.2 Length-Prefixed Padded Unicode String (UNICODE-LP-P4) */
// 		case 'lpp4': size = 4 +  __readUInt32LE(this, this.l); o = __lpp4(this, this.l); if(size & 0x02) size += 2; break;
// 		/* [MS-OFFCRYPTO] 2.1.3 Length-Prefixed UTF-8 String (UTF-8-LP-P4) */
// 		case '8lpp4': size = 4 +  __readUInt32LE(this, this.l); o = __8lpp4(this, this.l); if(size & 0x03) size += 4 - (size & 0x03); break;

// 		case 'cstr': size = 0; o = "";
// 			while((w=__readUInt8(this, this.l + size++))!==0) oo.push(_getchar(w));
// 			o = oo.join(""); break;
// 		case '_wstr': size = 0; o = "";
// 			while((w=__readUInt16LE(this,this.l +size))!==0){oo.push(_getchar(w));size+=2;}
// 			size+=2; o = oo.join(""); break;

// 		/* sbcs and dbcs support continue records in the SST way TODO codepages */
// 		case 'dbcs-cont': o = ""; loc = this.l;
// 			for(i = 0; i < size; ++i) {
// 				if(this.lens && this.lens.indexOf(loc) !== -1) {
// 					w = __readUInt8(this, loc);
// 					this.l = loc + 1;
// 					vv = ReadShift.call(this, size-i, w ? 'dbcs-cont' : 'sbcs-cont');
// 					return oo.join("") + vv;
// 				}
// 				oo.push(_getchar(__readUInt16LE(this, loc)));
// 				loc+=2;
// 			} o = oo.join(""); size *= 2; break;

// 		case 'cpstr':
// 			if(typeof $cptable !== 'undefined') {
// 				o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l + size));
// 				break;
// 			}
// 		/* falls through */
// 		case 'sbcs-cont': o = ""; loc = this.l;
// 			for(i = 0; i != size; ++i) {
// 				if(this.lens && this.lens.indexOf(loc) !== -1) {
// 					w = __readUInt8(this, loc);
// 					this.l = loc + 1;
// 					vv = ReadShift.call(this, size-i, w ? 'dbcs-cont' : 'sbcs-cont');
// 					return oo.join("") + vv;
// 				}
// 				oo.push(_getchar(__readUInt8(this, loc)));
// 				loc+=1;
// 			} o = oo.join(""); break;

// 		default:
// 	switch(size) {
// 		case 1: oI = __readUInt8(this, this.l); this.l++; return oI;
// 		case 2: oI = (t === 'i' ? __readInt16LE : __readUInt16LE)(this, this.l); this.l += 2; return oI;
// 		case 4: case -4:
// 			if(t === 'i' || ((this[this.l+3] & 0x80)===0)) { oI = ((size > 0) ? __readInt32LE : __readInt32BE)(this, this.l); this.l += 4; return oI; }
// 			else { oR = __readUInt32LE(this, this.l); this.l += 4; } return oR;
// 		case 8: case -8:
// 			if(t === 'f') {
// 				if(size == 8) oR = __double(this, this.l);
// 				else oR = __double([this[this.l+7],this[this.l+6],this[this.l+5],this[this.l+4],this[this.l+3],this[this.l+2],this[this.l+1],this[this.l+0]], 0);
// 				this.l += 8; return oR;
// 			} else size = 8;
// 		/* falls through */
// 		case 16: o = __hexlify(this, this.l, size); break;
// 	}}
// 	this.l+=size; return o;
// }

// function prep_blob(blob: any, pos: number) {
// 	blob.l = pos;
// 	blob.read_shift = ReadShift;
// 	// blob.chk = CheckField;
// 	// blob.write_shift = WriteShift;
// }

// export default {
//     // l: pos
//     // read_shift: ReadShift
//     // write_shift: WriteShift
// }