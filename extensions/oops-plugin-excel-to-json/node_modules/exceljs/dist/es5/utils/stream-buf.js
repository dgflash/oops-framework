"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable max-classes-per-file */
var Stream = require('readable-stream');

var utils = require('./utils');

var StringBuf = require('./string-buf'); // =============================================================================
// data chunks - encapsulating incoming data


var StringChunk = /*#__PURE__*/function () {
  function StringChunk(data, encoding) {
    _classCallCheck(this, StringChunk);

    this._data = data;
    this._encoding = encoding;
  }

  _createClass(StringChunk, [{
    key: "copy",
    // copy to target buffer
    value: function copy(target, targetOffset, offset, length) {
      return this.toBuffer().copy(target, targetOffset, offset, length);
    }
  }, {
    key: "toBuffer",
    value: function toBuffer() {
      if (!this._buffer) {
        this._buffer = Buffer.from(this._data, this._encoding);
      }

      return this._buffer;
    }
  }, {
    key: "length",
    get: function get() {
      return this.toBuffer().length;
    }
  }]);

  return StringChunk;
}();

var StringBufChunk = /*#__PURE__*/function () {
  function StringBufChunk(data) {
    _classCallCheck(this, StringBufChunk);

    this._data = data;
  }

  _createClass(StringBufChunk, [{
    key: "copy",
    // copy to target buffer
    value: function copy(target, targetOffset, offset, length) {
      // eslint-disable-next-line no-underscore-dangle
      return this._data._buf.copy(target, targetOffset, offset, length);
    }
  }, {
    key: "toBuffer",
    value: function toBuffer() {
      return this._data.toBuffer();
    }
  }, {
    key: "length",
    get: function get() {
      return this._data.length;
    }
  }]);

  return StringBufChunk;
}();

var BufferChunk = /*#__PURE__*/function () {
  function BufferChunk(data) {
    _classCallCheck(this, BufferChunk);

    this._data = data;
  }

  _createClass(BufferChunk, [{
    key: "copy",
    // copy to target buffer
    value: function copy(target, targetOffset, offset, length) {
      this._data.copy(target, targetOffset, offset, length);
    }
  }, {
    key: "toBuffer",
    value: function toBuffer() {
      return this._data;
    }
  }, {
    key: "length",
    get: function get() {
      return this._data.length;
    }
  }]);

  return BufferChunk;
}(); // =============================================================================
// ReadWriteBuf - a single buffer supporting simple read-write


var ReadWriteBuf = /*#__PURE__*/function () {
  function ReadWriteBuf(size) {
    _classCallCheck(this, ReadWriteBuf);

    this.size = size; // the buffer

    this.buffer = Buffer.alloc(size); // read index

    this.iRead = 0; // write index

    this.iWrite = 0;
  }

  _createClass(ReadWriteBuf, [{
    key: "toBuffer",
    value: function toBuffer() {
      if (this.iRead === 0 && this.iWrite === this.size) {
        return this.buffer;
      }

      var buf = Buffer.alloc(this.iWrite - this.iRead);
      this.buffer.copy(buf, 0, this.iRead, this.iWrite);
      return buf;
    }
  }, {
    key: "read",
    value: function read(size) {
      var buf; // read size bytes from buffer and return buffer

      if (size === 0) {
        // special case - return null if no data requested
        return null;
      }

      if (size === undefined || size >= this.length) {
        // if no size specified or size is at least what we have then return all of the bytes
        buf = this.toBuffer();
        this.iRead = this.iWrite;
        return buf;
      } // otherwise return a chunk


      buf = Buffer.alloc(size);
      this.buffer.copy(buf, 0, this.iRead, size);
      this.iRead += size;
      return buf;
    }
  }, {
    key: "write",
    value: function write(chunk, offset, length) {
      // write as many bytes from data from optional source offset
      // and return number of bytes written
      var size = Math.min(length, this.size - this.iWrite);
      chunk.copy(this.buffer, this.iWrite, offset, offset + size);
      this.iWrite += size;
      return size;
    }
  }, {
    key: "length",
    get: function get() {
      return this.iWrite - this.iRead;
    }
  }, {
    key: "eod",
    get: function get() {
      return this.iRead === this.iWrite;
    }
  }, {
    key: "full",
    get: function get() {
      return this.iWrite === this.size;
    }
  }]);

  return ReadWriteBuf;
}(); // =============================================================================
// StreamBuf - a multi-purpose read-write stream
//  As MemBuf - write as much data as you like. Then call toBuffer() to consolidate
//  As StreamHub - pipe to multiple writables
//  As readable stream - feed data into the writable part and have some other code read from it.
// Note: Not sure why but StreamBuf does not like JS "class" sugar. It fails the
// integration tests


var StreamBuf = function StreamBuf(options) {
  options = options || {};
  this.bufSize = options.bufSize || 1024 * 1024;
  this.buffers = []; // batch mode fills a buffer completely before passing the data on
  // to pipes or 'readable' event listeners

  this.batch = options.batch || false;
  this.corked = false; // where in the current writable buffer we're up to

  this.inPos = 0; // where in the current readable buffer we've read up to

  this.outPos = 0; // consuming pipe streams go here

  this.pipes = []; // controls emit('data')

  this.paused = false;
  this.encoding = null;
};

utils.inherits(StreamBuf, Stream.Duplex, {
  toBuffer: function toBuffer() {
    switch (this.buffers.length) {
      case 0:
        return null;

      case 1:
        return this.buffers[0].toBuffer();

      default:
        return Buffer.concat(this.buffers.map(function (rwBuf) {
          return rwBuf.toBuffer();
        }));
    }
  },
  // writable
  // event drain - if write returns false (which it won't), indicates when safe to write again.
  // finish - end() has been called
  // pipe(src) - pipe() has been called on readable
  // unpipe(src) - unpipe() has been called on readable
  // error - duh
  _getWritableBuffer: function _getWritableBuffer() {
    if (this.buffers.length) {
      var last = this.buffers[this.buffers.length - 1];

      if (!last.full) {
        return last;
      }
    }

    var buf = new ReadWriteBuf(this.bufSize);
    this.buffers.push(buf);
    return buf;
  },
  _pipe: function _pipe(chunk) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var write;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              write = function write(pipe) {
                return new Promise(function (resolve) {
                  pipe.write(chunk.toBuffer(), function () {
                    resolve();
                  });
                });
              };

              _context.next = 3;
              return Promise.all(_this.pipes.map(write));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  _writeToBuffers: function _writeToBuffers(chunk) {
    var inPos = 0;
    var inLen = chunk.length;

    while (inPos < inLen) {
      // find writable buffer
      var buffer = this._getWritableBuffer(); // write some data


      inPos += buffer.write(chunk, inPos, inLen - inPos);
    }
  },
  write: function write(data, encoding, callback) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var chunk;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (encoding instanceof Function) {
                callback = encoding;
                encoding = 'utf8';
              }

              callback = callback || utils.nop; // encapsulate data into a chunk

              if (!(data instanceof StringBuf)) {
                _context2.next = 6;
                break;
              }

              chunk = new StringBufChunk(data);
              _context2.next = 15;
              break;

            case 6:
              if (!(data instanceof Buffer)) {
                _context2.next = 10;
                break;
              }

              chunk = new BufferChunk(data);
              _context2.next = 15;
              break;

            case 10:
              if (!(typeof data === 'string' || data instanceof String || data instanceof ArrayBuffer)) {
                _context2.next = 14;
                break;
              }

              chunk = new StringChunk(data, encoding);
              _context2.next = 15;
              break;

            case 14:
              throw new Error('Chunk must be one of type String, Buffer or StringBuf.');

            case 15:
              if (!_this2.pipes.length) {
                _context2.next = 31;
                break;
              }

              if (!_this2.batch) {
                _context2.next = 21;
                break;
              }

              _this2._writeToBuffers(chunk);

              while (!_this2.corked && _this2.buffers.length > 1) {
                _this2._pipe(_this2.buffers.shift());
              }

              _context2.next = 29;
              break;

            case 21:
              if (_this2.corked) {
                _context2.next = 27;
                break;
              }

              _context2.next = 24;
              return _this2._pipe(chunk);

            case 24:
              callback();
              _context2.next = 29;
              break;

            case 27:
              _this2._writeToBuffers(chunk);

              process.nextTick(callback);

            case 29:
              _context2.next = 34;
              break;

            case 31:
              if (!_this2.paused) {
                _this2.emit('data', chunk.toBuffer());
              }

              _this2._writeToBuffers(chunk);

              _this2.emit('readable');

            case 34:
              return _context2.abrupt("return", true);

            case 35:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  cork: function cork() {
    this.corked = true;
  },
  _flush: function _flush()
  /* destination */
  {
    // if we have comsumers...
    if (this.pipes.length) {
      // and there's stuff not written
      while (this.buffers.length) {
        this._pipe(this.buffers.shift());
      }
    }
  },
  uncork: function uncork() {
    this.corked = false;

    this._flush();
  },
  end: function end(chunk, encoding, callback) {
    var _this3 = this;

    var writeComplete = function writeComplete(error) {
      if (error) {
        callback(error);
      } else {
        _this3._flush();

        _this3.pipes.forEach(function (pipe) {
          pipe.end();
        });

        _this3.emit('finish');
      }
    };

    if (chunk) {
      this.write(chunk, encoding, writeComplete);
    } else {
      writeComplete();
    }
  },
  // readable
  // event readable - some data is now available
  // event data - switch to flowing mode - feeds chunks to handler
  // event end - no more data
  // event close - optional, indicates upstream close
  // event error - duh
  read: function read(size) {
    var buffers; // read min(buffer, size || infinity)

    if (size) {
      buffers = [];

      while (size && this.buffers.length && !this.buffers[0].eod) {
        var first = this.buffers[0];
        var buffer = first.read(size);
        size -= buffer.length;
        buffers.push(buffer);

        if (first.eod && first.full) {
          this.buffers.shift();
        }
      }

      return Buffer.concat(buffers);
    }

    buffers = this.buffers.map(function (buf) {
      return buf.toBuffer();
    }).filter(Boolean);
    this.buffers = [];
    return Buffer.concat(buffers);
  },
  setEncoding: function setEncoding(encoding) {
    // causes stream.read or stream.on('data) to return strings of encoding instead of Buffer objects
    this.encoding = encoding;
  },
  pause: function pause() {
    this.paused = true;
  },
  resume: function resume() {
    this.paused = false;
  },
  isPaused: function isPaused() {
    return !!this.paused;
  },
  pipe: function pipe(destination) {
    // add destination to pipe list & write current buffer
    this.pipes.push(destination);

    if (!this.paused && this.buffers.length) {
      this.end();
    }
  },
  unpipe: function unpipe(destination) {
    // remove destination from pipe list
    this.pipes = this.pipes.filter(function (pipe) {
      return pipe !== destination;
    });
  },
  unshift: function unshift()
  /* chunk */
  {
    // some numpty has read some data that's not for them and they want to put it back!
    // Might implement this some day
    throw new Error('Not Implemented');
  },
  wrap: function wrap()
  /* stream */
  {
    // not implemented
    throw new Error('Not Implemented');
  }
});
module.exports = StreamBuf;
//# sourceMappingURL=stream-buf.js.map
