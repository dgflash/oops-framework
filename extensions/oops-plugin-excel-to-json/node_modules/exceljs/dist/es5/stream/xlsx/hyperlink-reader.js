"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var parseSax = require('../../utils/parse-sax');

var Enums = require('../../doc/enums');

var RelType = require('../../xlsx/rel-type');

var HyperlinkReader = /*#__PURE__*/function (_EventEmitter) {
  _inherits(HyperlinkReader, _EventEmitter);

  var _super = _createSuper(HyperlinkReader);

  function HyperlinkReader(_ref) {
    var _this;

    var workbook = _ref.workbook,
        id = _ref.id,
        iterator = _ref.iterator,
        options = _ref.options;

    _classCallCheck(this, HyperlinkReader);

    _this = _super.call(this);
    _this.workbook = workbook;
    _this.id = id;
    _this.iterator = iterator;
    _this.options = options;
    return _this;
  }

  _createClass(HyperlinkReader, [{
    key: "each",
    value: function each(fn) {
      return this.hyperlinks.forEach(fn);
    }
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var iterator, options, emitHyperlinks, hyperlinks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, events, _iterator2, _step2, _step2$value, eventType, value, node, rId, relationship;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                iterator = this.iterator, options = this.options;
                emitHyperlinks = false;
                hyperlinks = null;
                _context.t0 = options.hyperlinks;
                _context.next = _context.t0 === 'emit' ? 6 : _context.t0 === 'cache' ? 8 : 10;
                break;

              case 6:
                emitHyperlinks = true;
                return _context.abrupt("break", 11);

              case 8:
                this.hyperlinks = hyperlinks = {};
                return _context.abrupt("break", 11);

              case 10:
                return _context.abrupt("break", 11);

              case 11:
                if (!(!emitHyperlinks && !hyperlinks)) {
                  _context.next = 14;
                  break;
                }

                this.emit('finished');
                return _context.abrupt("return");

              case 14:
                _context.prev = 14;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 17;
                _iterator = _asyncIterator(parseSax(iterator));

              case 19:
                _context.next = 21;
                return _iterator.next();

              case 21:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 25;
                return _step.value;

              case 25:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 57;
                  break;
                }

                events = _value;
                _iterator2 = _createForOfIteratorHelper(events);
                _context.prev = 29;

                _iterator2.s();

              case 31:
                if ((_step2 = _iterator2.n()).done) {
                  _context.next = 46;
                  break;
                }

                _step2$value = _step2.value, eventType = _step2$value.eventType, value = _step2$value.value;

                if (!(eventType === 'opentag')) {
                  _context.next = 44;
                  break;
                }

                node = value;

                if (!(node.name === 'Relationship')) {
                  _context.next = 44;
                  break;
                }

                rId = node.attributes.Id;
                _context.t1 = node.attributes.Type;
                _context.next = _context.t1 === RelType.Hyperlink ? 40 : 43;
                break;

              case 40:
                relationship = {
                  type: Enums.RelationshipType.Styles,
                  rId: rId,
                  target: node.attributes.Target,
                  targetMode: node.attributes.TargetMode
                };

                if (emitHyperlinks) {
                  this.emit('hyperlink', relationship);
                } else {
                  hyperlinks[relationship.rId] = relationship;
                }

                return _context.abrupt("break", 44);

              case 43:
                return _context.abrupt("break", 44);

              case 44:
                _context.next = 31;
                break;

              case 46:
                _context.next = 51;
                break;

              case 48:
                _context.prev = 48;
                _context.t2 = _context["catch"](29);

                _iterator2.e(_context.t2);

              case 51:
                _context.prev = 51;

                _iterator2.f();

                return _context.finish(51);

              case 54:
                _iteratorNormalCompletion = true;
                _context.next = 19;
                break;

              case 57:
                _context.next = 63;
                break;

              case 59:
                _context.prev = 59;
                _context.t3 = _context["catch"](17);
                _didIteratorError = true;
                _iteratorError = _context.t3;

              case 63:
                _context.prev = 63;
                _context.prev = 64;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context.next = 68;
                  break;
                }

                _context.next = 68;
                return _iterator.return();

              case 68:
                _context.prev = 68;

                if (!_didIteratorError) {
                  _context.next = 71;
                  break;
                }

                throw _iteratorError;

              case 71:
                return _context.finish(68);

              case 72:
                return _context.finish(63);

              case 73:
                this.emit('finished');
                _context.next = 79;
                break;

              case 76:
                _context.prev = 76;
                _context.t4 = _context["catch"](14);
                this.emit('error', _context.t4);

              case 79:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[14, 76], [17, 59, 63, 73], [29, 48, 51, 54], [64,, 68, 72]]);
      }));

      function read() {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "count",
    get: function get() {
      return this.hyperlinks && this.hyperlinks.length || 0;
    }
  }]);

  return HyperlinkReader;
}(EventEmitter);

module.exports = HyperlinkReader;
//# sourceMappingURL=hyperlink-reader.js.map
