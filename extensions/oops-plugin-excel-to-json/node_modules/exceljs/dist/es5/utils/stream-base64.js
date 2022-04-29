"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var Stream = require('readable-stream'); // =============================================================================
// StreamBase64 - A utility to convert to/from base64 stream
// Note: does not buffer data, must be piped


var StreamBase64 = /*#__PURE__*/function (_Stream$Duplex) {
  _inherits(StreamBase64, _Stream$Duplex);

  var _super = _createSuper(StreamBase64);

  function StreamBase64() {
    var _this;

    _classCallCheck(this, StreamBase64);

    _this = _super.call(this); // consuming pipe streams go here

    _this.pipes = [];
    return _this;
  } // writable
  // event drain - if write returns false (which it won't), indicates when safe to write again.
  // finish - end() has been called
  // pipe(src) - pipe() has been called on readable
  // unpipe(src) - unpipe() has been called on readable
  // error - duh


  _createClass(StreamBase64, [{
    key: "write",
    value: function write()
    /* data, encoding */
    {
      return true;
    }
  }, {
    key: "cork",
    value: function cork() {}
  }, {
    key: "uncork",
    value: function uncork() {}
  }, {
    key: "end",
    value: function end()
    /* chunk, encoding, callback */
    {} // readable
    // event readable - some data is now available
    // event data - switch to flowing mode - feeds chunks to handler
    // event end - no more data
    // event close - optional, indicates upstream close
    // event error - duh

  }, {
    key: "read",
    value: function read()
    /* size */
    {}
  }, {
    key: "setEncoding",
    value: function setEncoding(encoding) {
      // causes stream.read or stream.on('data) to return strings of encoding instead of Buffer objects
      this.encoding = encoding;
    }
  }, {
    key: "pause",
    value: function pause() {}
  }, {
    key: "resume",
    value: function resume() {}
  }, {
    key: "isPaused",
    value: function isPaused() {}
  }, {
    key: "pipe",
    value: function pipe(destination) {
      // add destination to pipe list & write current buffer
      this.pipes.push(destination);
    }
  }, {
    key: "unpipe",
    value: function unpipe(destination) {
      // remove destination from pipe list
      this.pipes = this.pipes.filter(function (pipe) {
        return pipe !== destination;
      });
    }
  }, {
    key: "unshift",
    value: function unshift()
    /* chunk */
    {
      // some numpty has read some data that's not for them and they want to put it back!
      // Might implement this some day
      throw new Error('Not Implemented');
    }
  }, {
    key: "wrap",
    value: function wrap()
    /* stream */
    {
      // not implemented
      throw new Error('Not Implemented');
    }
  }]);

  return StreamBase64;
}(Stream.Duplex);

module.exports = StreamBase64;
//# sourceMappingURL=stream-base64.js.map
