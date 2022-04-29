"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// =======================================================================================================
// StreamConverter
//
// convert between encoding schemes in a stream
// Work in Progress - Will complete this at some point
var jconv;

var StreamConverter = /*#__PURE__*/function () {
  function StreamConverter(inner, options) {
    _classCallCheck(this, StreamConverter);

    this.inner = inner;
    options = options || {};
    this.innerEncoding = (options.innerEncoding || 'UTF8').toUpperCase();
    this.outerEncoding = (options.outerEncoding || 'UTF8').toUpperCase();
    this.innerBOM = options.innerBOM || null;
    this.outerBOM = options.outerBOM || null;
    this.writeStarted = false;
  }

  _createClass(StreamConverter, [{
    key: "convertInwards",
    value: function convertInwards(data) {
      if (data) {
        if (typeof data === 'string') {
          data = Buffer.from(data, this.outerEncoding);
        }

        if (this.innerEncoding !== this.outerEncoding) {
          data = jconv.convert(data, this.outerEncoding, this.innerEncoding);
        }
      }

      return data;
    }
  }, {
    key: "convertOutwards",
    value: function convertOutwards(data) {
      if (typeof data === 'string') {
        data = Buffer.from(data, this.innerEncoding);
      }

      if (this.innerEncoding !== this.outerEncoding) {
        data = jconv.convert(data, this.innerEncoding, this.outerEncoding);
      }

      return data;
    }
  }, {
    key: "addListener",
    value: function addListener(event, handler) {
      this.inner.addListener(event, handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, handler) {
      this.inner.removeListener(event, handler);
    }
  }, {
    key: "write",
    value: function write(data, encoding, callback) {
      if (encoding instanceof Function) {
        callback = encoding;
        encoding = undefined;
      }

      if (!this.writeStarted) {
        // if inner encoding has BOM, write it now
        if (this.innerBOM) {
          this.inner.write(this.innerBOM);
        } // if outer encoding has BOM, delete it now


        if (this.outerBOM) {
          if (data.length <= this.outerBOM.length) {
            if (callback) {
              callback();
            }

            return;
          }

          var bomless = Buffer.alloc(data.length - this.outerBOM.length);
          data.copy(bomless, 0, this.outerBOM.length, data.length);
          data = bomless;
        }

        this.writeStarted = true;
      }

      this.inner.write(this.convertInwards(data), encoding ? this.innerEncoding : undefined, callback);
    }
  }, {
    key: "read",
    value: function read() {// TBD
    }
  }, {
    key: "pipe",
    value: function pipe(destination, options) {
      var reverseConverter = new StreamConverter(destination, {
        innerEncoding: this.outerEncoding,
        outerEncoding: this.innerEncoding,
        innerBOM: this.outerBOM,
        outerBOM: this.innerBOM
      });
      this.inner.pipe(reverseConverter, options);
    }
  }, {
    key: "close",
    value: function close() {
      this.inner.close();
    }
  }, {
    key: "on",
    value: function on(type, callback) {
      var _this = this;

      switch (type) {
        case 'data':
          this.inner.on('data', function (chunk) {
            callback(_this.convertOutwards(chunk));
          });
          return this;

        default:
          this.inner.on(type, callback);
          return this;
      }
    }
  }, {
    key: "once",
    value: function once(type, callback) {
      this.inner.once(type, callback);
    }
  }, {
    key: "end",
    value: function end(chunk, encoding, callback) {
      this.inner.end(this.convertInwards(chunk), this.innerEncoding, callback);
    }
  }, {
    key: "emit",
    value: function emit(type, value) {
      this.inner.emit(type, value);
    }
  }]);

  return StreamConverter;
}();

module.exports = StreamConverter;
//# sourceMappingURL=stream-converter.js.map
