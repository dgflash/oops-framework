"use strict";

// eslint-disable-next-line node/no-unsupported-features/node-builtins
var textEncoder = typeof TextEncoder === 'undefined' ? null : new TextEncoder('utf-8');

var _require = require('buffer'),
    Buffer = _require.Buffer;

function stringToBuffer(str) {
  if (typeof str !== 'string') {
    return str;
  }

  if (textEncoder) {
    return Buffer.from(textEncoder.encode(str).buffer);
  }

  return Buffer.from(str);
}

exports.stringToBuffer = stringToBuffer;
//# sourceMappingURL=browser-buffer-encode.js.map
