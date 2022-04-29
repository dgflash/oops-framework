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

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var LineBuffer = /*#__PURE__*/function (_EventEmitter) {
  _inherits(LineBuffer, _EventEmitter);

  var _super = _createSuper(LineBuffer);

  function LineBuffer(options) {
    var _this;

    _classCallCheck(this, LineBuffer);

    _this = _super.call(this);
    _this.encoding = options.encoding;
    _this.buffer = null; // part of cork/uncork

    _this.corked = false;
    _this.queue = [];
    return _this;
  } // Events:
  //  line: here is a line
  //  done: all lines emitted


  _createClass(LineBuffer, [{
    key: "write",
    value: function write(chunk) {
      // find line or lines in chunk and emit them if not corked
      // or queue them if corked
      var data = this.buffer ? this.buffer + chunk : chunk;
      var lines = data.split(/\r?\n/g); // save the last line

      this.buffer = lines.pop();
      lines.forEach(function (line) {
        if (this.corked) {
          this.queue.push(line);
        } else {
          this.emit('line', line);
        }
      });
      return !this.corked;
    }
  }, {
    key: "cork",
    value: function cork() {
      this.corked = true;
    }
  }, {
    key: "uncork",
    value: function uncork() {
      this.corked = false;

      this._flush(); // tell the source I'm ready again


      this.emit('drain');
    }
  }, {
    key: "setDefaultEncoding",
    value: function setDefaultEncoding() {// ?
    }
  }, {
    key: "end",
    value: function end() {
      if (this.buffer) {
        this.emit('line', this.buffer);
        this.buffer = null;
      }

      this.emit('done');
    }
  }, {
    key: "_flush",
    value: function _flush() {
      var _this2 = this;

      if (!this.corked) {
        this.queue.forEach(function (line) {
          _this2.emit('line', line);
        });
        this.queue = [];
      }
    }
  }]);

  return LineBuffer;
}(EventEmitter);

module.exports = LineBuffer;
//# sourceMappingURL=line-buffer.js.map
