/**
 * @desc [MS-XLS] 3.9.10 Number Formats
 * @link https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-xls/bf92a450-2adb-417f-9309-cf2a0b26af3c
 * @param length
 * @returns
 */

export function writeRRTabId(length: number) {
  const size = length * 2;
  const newBlob = Buffer.alloc(size);
  for (let i = 0; i < length; i++) {
    newBlob.writeUint16LE(2, i + 1);
  }
  return newBlob;
}
