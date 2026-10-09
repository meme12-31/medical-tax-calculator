import fs from 'fs';
import zlib from 'zlib';

// Create a simple 200x44 PNG file
function createPng(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type: RGB
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    let c = 0xffffffff;
    for (let i = 0; i < body.length; i++) {
      c ^= body[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    c ^= 0xffffffff;
    crc.writeInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data: filter byte (0) + RGB pixels per row
  const rowBytes = 1 + width * 3;
  const rawData = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Dark slate blue background #1e293b (30, 41, 59)
      // Green accent box on left
      if (x >= 10 && x <= 38 && y >= 8 && y <= 36) {
        rawData[pixelOffset] = 16;     // R
        rawData[pixelOffset + 1] = 185; // G
        rawData[pixelOffset + 2] = 129; // B
      } else {
        rawData[pixelOffset] = 30;     // R
        rawData[pixelOffset + 1] = 41;  // G
        rawData[pixelOffset + 2] = 59;  // B
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png = createPng(200, 44);
fs.writeFileSync('public/images/logo.png', png);
console.log('logo.png created successfully');
