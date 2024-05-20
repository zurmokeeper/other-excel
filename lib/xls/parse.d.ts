import * as CFB from 'cfb';
/**
 * @desc cfb blob.l  未加定义，手动加上
 */
export type CustomCFB$Blob = CFB.CFB$Blob & {
    l: number;
    read_shift(num: number, encoding?: string): any;
};
/**
 * @desc [MS-XLS] 2.5.240 ShortXLUnicodeString
 *
 * 'sbcs-cont': 这表示单字节字符集 (SBCS) 连续字符串。在这种编码中，每个字符由一个字节表示，字符集通常是 ASCII 或类似的编码。

    'cpstr': 这表示代码页字符串 (Code Page String)。在早期的 Excel 文件格式中，字符串可能使用不同的代码页来编码。'cpstr' 会根据当前的代码页来解析字符串。

    'wstr': 这表示宽字符 (Wide String)，即 Unicode 字符串。在 Excel 中，这种编码通常用于支持国际化和多语言文本。
 * @param blob
 * @param length
 * @returns
 */
export declare function parseShortXLUnicodeString(blob: CustomCFB$Blob, length: number, options: any): any;
export declare function parseXLUnicodeRichExtendedString(blob: CustomCFB$Blob): {
    t: string;
    raw: string;
    r: string;
};
/**
 * @desc record [type, size, data]
 * @param blob
 * @param options
 */
export declare function parseWorkbook(blob: any, options?: any): Promise<void>;
