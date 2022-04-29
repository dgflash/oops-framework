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

var events = require('events'); // =============================================================================
// StutteredPipe - Used to slow down streaming so GC can get a look in


var StutteredPipe = /*#__PURE__*/function (_events$EventEmitter) {
  _inherits(StutteredPipe, _events$EventEmitter);

  var _super = _createSuper(StutteredPipe);

  function StutteredPipe(readable, writable, options) {
    var _this;

    _classCallCheck(this, StutteredPipe);

    _this = _super.call(this);
    options = options || {};
    _this.readable = readable;
    _this.writable = writable;
    _this.bufSize = options.bufSize || 16384;
    _this.autoPause = options.autoPause || false;
    _this.paused = false;
    _this.eod = false;
    _this.scheduled = null;
    readable.on('end', function () {
      _this.eod = true;
      writable.end();
    }); // need to have some way to communicate speed of stream
    // back from the consumer

    readable.on('readable', function () {
      if (!_this.paused) {
        _this.resume();
      }
    });

    _this._schedule();

    return _this;
  }

  _createClass(StutteredPipe, [{
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      if (!this.eod) {
        if (this.scheduled !== null) {
          clearImmediate(this.scheduled);
        }

        this._schedule();
      }
    }
  }, {
    key: "_schedule",
    value: function _schedule() {
      var _this2 = this;

      this.scheduled = setImmediate(function () {
        _this2.scheduled = null;

        if (!_this2.eod && !_this2.paused) {
          var data = _this2.readable.read(_this2.bufSize);

          if (data && data.length) {
            _this2.writable.write(data);

            if (!_this2.paused && !_this2.autoPause) {
              _this2._schedule();
            }
          } else if (!_this2.paused) {
            _this2._schedule();
          }
        }
      });
    }
  }]);

  return StutteredPipe;
}(events.EventEmitter);

module.exports = StutteredPipe;
//# sourceMappingURL=stuttered-pipe.js.map
