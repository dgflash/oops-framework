"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var events = require('events');

var JSZip = require('jszip');

var StreamBuf = require('./stream-buf');

var _require = require('./browser-buffer-encode'),
    stringToBuffer = _require.stringToBuffer; // =============================================================================
// The ZipWriter class
// Packs streamed data into an output zip stream


var ZipWriter = /*#__PURE__*/function (_events$EventEmitter) {
  _inherits(ZipWriter, _events$EventEmitter);

  var _super = _createSuper(ZipWriter);

  function ZipWriter(options) {
    var _this;

    _classCallCheck(this, ZipWriter);

    _this = _super.call(this);
    _this.options = Object.assign({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    }, options);
    _this.zip = new JSZip();
    _this.stream = new StreamBuf();
    return _this;
  }

  _createClass(ZipWriter, [{
    key: "append",
    value: function append(data, options) {
      if (options.hasOwnProperty('base64') && options.base64) {
        this.zip.file(options.name, data, {
          base64: true
        });
      } else {
        // https://www.npmjs.com/package/process
        if (process.browser && typeof data === 'string') {
          // use TextEncoder in browser
          data = stringToBuffer(data);
        }

        this.zip.file(options.name, data);
      }
    }
  }, {
    key: "finalize",
    value: function () {
      var _finalize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var content;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.zip.generateAsync(this.options);

              case 2:
                content = _context.sent;
                this.stream.end(content);
                this.emit('finish');

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function finalize() {
        return _finalize.apply(this, arguments);
      }

      return finalize;
    }() // ==========================================================================
    // Stream.Readable interface

  }, {
    key: "read",
    value: function read(size) {
      return this.stream.read(size);
    }
  }, {
    key: "setEncoding",
    value: function setEncoding(encoding) {
      return this.stream.setEncoding(encoding);
    }
  }, {
    key: "pause",
    value: function pause() {
      return this.stream.pause();
    }
  }, {
    key: "resume",
    value: function resume() {
      return this.stream.resume();
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.stream.isPaused();
    }
  }, {
    key: "pipe",
    value: function pipe(destination, options) {
      return this.stream.pipe(destination, options);
    }
  }, {
    key: "unpipe",
    value: function unpipe(destination) {
      return this.stream.unpipe(destination);
    }
  }, {
    key: "unshift",
    value: function unshift(chunk) {
      return this.stream.unshift(chunk);
    }
  }, {
    key: "wrap",
    value: function wrap(stream) {
      return this.stream.wrap(stream);
    }
  }]);

  return ZipWriter;
}(events.EventEmitter); // =============================================================================


module.exports = {
  ZipWriter: ZipWriter
};
//# sourceMappingURL=zip-stream.js.map
