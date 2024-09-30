import { Buffer } from 'buffer';

declare module 'buffer' {
    interface Buffer {
        write_shift(byteLength: number, value: number | string, encoding?: string): void;
    }
}
