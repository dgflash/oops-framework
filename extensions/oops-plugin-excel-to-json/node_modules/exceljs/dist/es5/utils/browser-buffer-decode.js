"use strict";

// eslint-disable-next-line node/no-unsupported-features/node-builtins
var textDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8');

function bufferToString(chunk) {
  if (typeof chunk === 'string') {
    return chunk;
  }

  if (textDecoder) {
    return textDecoder.decode(chunk);
  }

  return chunk.toString();
}

exports.bufferToString = bufferToString;
//# sourceMappingURL=browser-buffer-decode.js.map
