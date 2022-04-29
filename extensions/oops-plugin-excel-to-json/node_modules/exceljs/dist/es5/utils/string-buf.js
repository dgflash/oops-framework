"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// StringBuf - a way to keep string memory operations to a minimum
// while building the strings for the xml files
var StringBuf = /*#__PURE__*/function () {
  function StringBuf(options) {
    _classCallCheck(this, StringBuf);

    this._buf = Buffer.alloc(options && options.size || 16384);
    this._encoding = options && options.encoding || 'utf8'; // where in the buffer we are at

    this._inPos = 0; // for use by toBuffer()

    this._buffer = undefined;
  }

  _createClass(StringBuf, [{
    key: "toBuffer",
    value: function toBuffer() {
      // return the current data as a single enclosing buffer
      if (!this._buffer) {
        this._buffer = Buffer.alloc(this.length);

        this._buf.copy(this._buffer, 0, 0, this.length);
      }

      return this._buffer;
    }
  }, {
    key: "reset",
    value: function reset(position) {
      position = position || 0;
      this._buffer = undefined;
      this._inPos = position;
    }
  }, {
    key: "_grow",
    value: function _grow(min) {
      var size = this._buf.length * 2;

      while (size < min) {
        size *= 2;
      }

      var buf = Buffer.alloc(size);

      this._buf.copy(buf, 0);

      this._buf = buf;
    }
  }, {
    key: "addText",
    value: function addText(text) {
      this._buffer = undefined;

      var inPos = this._inPos + this._buf.write(text, this._inPos, this._encoding); // if we've hit (or nearing capacity), grow the buf


      while (inPos >= this._buf.length - 4) {
        this._grow(this._inPos + text.length); // keep trying to write until we've completely written the text


        inPos = this._inPos + this._buf.write(text, this._inPos, this._encoding);
      }

      this._inPos = inPos;
    }
  }, {
    key: "addStringBuf",
    value: function addStringBuf(inBuf) {
      if (inBuf.length) {
        this._buffer = undefined;

        if (this.length + inBuf.length > this.capacity) {
          this._grow(this.length + inBuf.length);
        } // eslint-disable-next-line no-underscore-dangle


        inBuf._buf.copy(this._buf, this._inPos, 0, inBuf.length);

        this._inPos += inBuf.length;
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this._inPos;
    }
  }, {
    key: "capacity",
    get: function get() {
      return this._buf.length;
    }
  }, {
    key: "buffer",
    get: function get() {
      return this._buf;
    }
  }]);

  return StringBuf;
}();

module.exports = StringBuf;
//# sourceMappingURL=string-buf.js.map
