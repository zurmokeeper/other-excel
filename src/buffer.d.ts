declare module 'buffer' {
    interface Buffer {
        write_shift(byteLength: number, value: number): void;
    }
}
