import { CustomCFB$Blob } from '../../../util/type';
import { parseUInt16, parseXLUnicodeStringNoCch } from '../../../util/charsetParseUtil';


/* [MS-XLS] 2.5.61 ControlInfo */
function parse_ControlInfo(blob: CustomCFB$Blob, length: number, options?: any) {
	var flags = blob.read_shift(1);
	blob.l++;
	var accel = blob.read_shift(2);
	blob.l += 2;
	return [flags, accel];
}

/* [MS-XLS] 2.4.329 TODO: parse properly */
export function parseTxO(blob: CustomCFB$Blob, length: number, options?: any) {
	var s = blob.l;
	var texts = "";
    try {
        blob.l += 4;
        var ot = (options.lastobj||{cmo:[0,0]}).cmo[1];
        var controlInfo; // eslint-disable-line no-unused-vars
        if([0,5,7,11,12,14].indexOf(ot) == -1) blob.l += 6;
        else controlInfo = parse_ControlInfo(blob, 6, options); // eslint-disable-line no-unused-vars
        var cchText = blob.read_shift(2);
        /*var cbRuns = */blob.read_shift(2);
        /*var ifntEmpty = */parseUInt16(blob, 2);
        var len = blob.read_shift(2);
        blob.l += len;
        //var fmla = parse_ObjFmla(blob, s + length - blob.l);

        for(var i = 1; i < blob.lens.length-1; ++i) {
            if(blob.l-s != blob.lens[i]) throw new Error("TxO: bad continue record");
            var hdr = blob[blob.l];
            var t = parseXLUnicodeStringNoCch(blob, blob.lens[i+1]-blob.lens[i]-1);
            texts += t;
            if(texts.length >= (hdr ? cchText : 2*cchText)) break;
        }
        if(texts.length !== cchText && texts.length !== cchText*2) {
            throw new Error("cchText: " + cchText + " != " + texts.length);
        }

        blob.l = s + length;
        /* [MS-XLS] 2.5.272 TxORuns */
    //	var rgTxoRuns = [];
    //	for(var j = 0; j != cbRuns/8-1; ++j) blob.l += 8;
    //	var cchText2 = blob.read_shift(2);
    //	if(cchText2 !== cchText) throw new Error("TxOLastRun mismatch: " + cchText2 + " " + cchText);
    //	blob.l += 6;
    //	if(s + length != blob.l) throw new Error("TxO " + (s + length) + ", at " + blob.l);
        return { t: texts };
    } catch(e) { blob.l = s + length; return { t: texts }; }
}