/// <reference types="node" />
/// <reference types="node" />
/**
 * @author Bruce
 * @time 2024-03-16
 */
import * as fs from 'fs';
type Options = {
    type?: 'base64' | 'buffer' | 'stream';
};
export declare function read1(data: string | Buffer | fs.ReadStream, options?: Options): Promise<any>;
export {};
