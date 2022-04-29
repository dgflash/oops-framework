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

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var parseSax = require('../../utils/parse-sax');

var _ = require('../../utils/under-dash');

var utils = require('../../utils/utils');

var colCache = require('../../utils/col-cache');

var Dimensions = require('../../doc/range');

var Row = require('../../doc/row');

var Column = require('../../doc/column');

var WorksheetReader = /*#__PURE__*/function (_EventEmitter) {
  _inherits(WorksheetReader, _EventEmitter);

  var _super = _createSuper(WorksheetReader);

  function WorksheetReader(_ref) {
    var _this3;

    var workbook = _ref.workbook,
        id = _ref.id,
        iterator = _ref.iterator,
        options = _ref.options;

    _classCallCheck(this, WorksheetReader);

    _this3 = _super.call(this);
    _this3.workbook = workbook;
    _this3.id = id;
    _this3.iterator = iterator;
    _this3.options = options || {}; // and a name

    _this3.name = "Sheet".concat(_this3.id); // column definitions

    _this3._columns = null;
    _this3._keys = {}; // keep a record of dimensions

    _this3._dimensions = new Dimensions();
    return _this3;
  } // destroy - not a valid operation for a streaming writer
  // even though some streamers might be able to, it's a bad idea.


  _createClass(WorksheetReader, [{
    key: "destroy",
    value: function destroy() {
      throw new Error('Invalid Operation: destroy');
    } // return the current dimensions of the writer

  }, {
    key: "getColumn",
    // get a single column by col number. If it doesn't exist, it and any gaps before it
    // are created.
    value: function getColumn(c) {
      if (typeof c === 'string') {
        // if it matches a key'd column, return that
        var col = this._keys[c];

        if (col) {
          return col;
        } // otherise, assume letter


        c = colCache.l2n(c);
      }

      if (!this._columns) {
        this._columns = [];
      }

      if (c > this._columns.length) {
        var n = this._columns.length + 1;

        while (n <= c) {
          this._columns.push(new Column(this, n++));
        }
      }

      return this._columns[c - 1];
    }
  }, {
    key: "getColumnKey",
    value: function getColumnKey(key) {
      return this._keys[key];
    }
  }, {
    key: "setColumnKey",
    value: function setColumnKey(key, value) {
      this._keys[key] = value;
    }
  }, {
    key: "deleteColumnKey",
    value: function deleteColumnKey(key) {
      delete this._keys[key];
    }
  }, {
    key: "eachColumnKey",
    value: function eachColumnKey(f) {
      _.each(this._keys, f);
    }
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, events, _iterator4, _step4, _step4$value, eventType, value;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 3;
                _iterator = _asyncIterator(this.parse());

              case 5:
                _context.next = 7;
                return _iterator.next();

              case 7:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 11;
                return _step.value;

              case 11:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 19;
                  break;
                }

                events = _value;
                _iterator4 = _createForOfIteratorHelper(events);

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    _step4$value = _step4.value, eventType = _step4$value.eventType, value = _step4$value.value;
                    this.emit(eventType, value);
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context.next = 30;
                  break;
                }

                _context.next = 30;
                return _iterator.return();

              case 30:
                _context.prev = 30;

                if (!_didIteratorError) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(25);

              case 35:
                this.emit('finished');
                _context.next = 41;
                break;

              case 38:
                _context.prev = 38;
                _context.t1 = _context["catch"](0);
                this.emit('error', _context.t1);

              case 41:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 38], [3, 21, 25, 35], [26,, 30, 34]]);
      }));

      function read() {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: Symbol.asyncIterator,
    value: function value() {
      var _this = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, events, _iterator5, _step5, _step5$value, eventType, value;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context2.prev = 2;
                _iterator2 = _asyncIterator(_this.parse());

              case 4:
                _context2.next = 6;
                return _awaitAsyncGenerator(_iterator2.next());

              case 6:
                _step2 = _context2.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context2.next = 10;
                return _awaitAsyncGenerator(_step2.value);

              case 10:
                _value2 = _context2.sent;

                if (_iteratorNormalCompletion2) {
                  _context2.next = 34;
                  break;
                }

                events = _value2;
                _iterator5 = _createForOfIteratorHelper(events);
                _context2.prev = 14;

                _iterator5.s();

              case 16:
                if ((_step5 = _iterator5.n()).done) {
                  _context2.next = 23;
                  break;
                }

                _step5$value = _step5.value, eventType = _step5$value.eventType, value = _step5$value.value;

                if (!(eventType === 'row')) {
                  _context2.next = 21;
                  break;
                }

                _context2.next = 21;
                return value;

              case 21:
                _context2.next = 16;
                break;

              case 23:
                _context2.next = 28;
                break;

              case 25:
                _context2.prev = 25;
                _context2.t0 = _context2["catch"](14);

                _iterator5.e(_context2.t0);

              case 28:
                _context2.prev = 28;

                _iterator5.f();

                return _context2.finish(28);

              case 31:
                _iteratorNormalCompletion2 = true;
                _context2.next = 4;
                break;

              case 34:
                _context2.next = 40;
                break;

              case 36:
                _context2.prev = 36;
                _context2.t1 = _context2["catch"](2);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t1;

              case 40:
                _context2.prev = 40;
                _context2.prev = 41;

                if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
                  _context2.next = 45;
                  break;
                }

                _context2.next = 45;
                return _awaitAsyncGenerator(_iterator2.return());

              case 45:
                _context2.prev = 45;

                if (!_didIteratorError2) {
                  _context2.next = 48;
                  break;
                }

                throw _iteratorError2;

              case 48:
                return _context2.finish(45);

              case 49:
                return _context2.finish(40);

              case 50:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 36, 40, 50], [14, 25, 28, 31], [41,, 45, 49]]);
      }))();
    }
  }, {
    key: "parse",
    value: function parse() {
      var _this2 = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var iterator, options, emitSheet, emitHyperlinks, hyperlinks, _this2$workbook, sharedStrings, styles, properties, inCols, inRows, inHyperlinks, cols, row, c, current, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, events, worksheetEvents, _iterator6, _step6, _step6$value, eventType, value, node, r, styleId, style, hyperlink, _node, address, cell, _style, cellValue, index, _hyperlink;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                iterator = _this2.iterator, options = _this2.options;
                emitSheet = false;
                emitHyperlinks = false;
                hyperlinks = null;
                _context3.t0 = options.worksheets;
                _context3.next = _context3.t0 === 'emit' ? 7 : _context3.t0 === 'prep' ? 9 : 10;
                break;

              case 7:
                emitSheet = true;
                return _context3.abrupt("break", 11);

              case 9:
                return _context3.abrupt("break", 11);

              case 10:
                return _context3.abrupt("break", 11);

              case 11:
                _context3.t1 = options.hyperlinks;
                _context3.next = _context3.t1 === 'emit' ? 14 : _context3.t1 === 'cache' ? 16 : 18;
                break;

              case 14:
                emitHyperlinks = true;
                return _context3.abrupt("break", 19);

              case 16:
                _this2.hyperlinks = hyperlinks = {};
                return _context3.abrupt("break", 19);

              case 18:
                return _context3.abrupt("break", 19);

              case 19:
                if (!(!emitSheet && !emitHyperlinks && !hyperlinks)) {
                  _context3.next = 21;
                  break;
                }

                return _context3.abrupt("return");

              case 21:
                // references
                _this2$workbook = _this2.workbook, sharedStrings = _this2$workbook.sharedStrings, styles = _this2$workbook.styles, properties = _this2$workbook.properties; // xml position

                inCols = false;
                inRows = false;
                inHyperlinks = false; // parse state

                cols = null;
                row = null;
                c = null;
                current = null;
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _context3.prev = 31;
                _iterator3 = _asyncIterator(parseSax(iterator));

              case 33:
                _context3.next = 35;
                return _awaitAsyncGenerator(_iterator3.next());

              case 35:
                _step3 = _context3.sent;
                _iteratorNormalCompletion3 = _step3.done;
                _context3.next = 39;
                return _awaitAsyncGenerator(_step3.value);

              case 39:
                _value3 = _context3.sent;

                if (_iteratorNormalCompletion3) {
                  _context3.next = 153;
                  break;
                }

                events = _value3;
                worksheetEvents = [];
                _iterator6 = _createForOfIteratorHelper(events);
                _context3.prev = 44;

                _iterator6.s();

              case 46:
                if ((_step6 = _iterator6.n()).done) {
                  _context3.next = 139;
                  break;
                }

                _step6$value = _step6.value, eventType = _step6$value.eventType, value = _step6$value.value;

                if (!(eventType === 'opentag')) {
                  _context3.next = 82;
                  break;
                }

                node = value;

                if (!emitSheet) {
                  _context3.next = 71;
                  break;
                }

                _context3.t2 = node.name;
                _context3.next = _context3.t2 === 'cols' ? 54 : _context3.t2 === 'sheetData' ? 57 : _context3.t2 === 'col' ? 59 : _context3.t2 === 'row' ? 61 : _context3.t2 === 'c' ? 63 : _context3.t2 === 'f' ? 65 : _context3.t2 === 'v' ? 67 : _context3.t2 === 'mergeCell' ? 69 : 70;
                break;

              case 54:
                inCols = true;
                cols = [];
                return _context3.abrupt("break", 71);

              case 57:
                inRows = true;
                return _context3.abrupt("break", 71);

              case 59:
                if (inCols) {
                  cols.push({
                    min: parseInt(node.attributes.min, 10),
                    max: parseInt(node.attributes.max, 10),
                    width: parseFloat(node.attributes.width),
                    styleId: parseInt(node.attributes.style || '0', 10)
                  });
                }

                return _context3.abrupt("break", 71);

              case 61:
                if (inRows) {
                  r = parseInt(node.attributes.r, 10);
                  row = new Row(_this2, r);

                  if (node.attributes.ht) {
                    row.height = parseFloat(node.attributes.ht);
                  }

                  if (node.attributes.s) {
                    styleId = parseInt(node.attributes.s, 10);
                    style = styles.getStyleModel(styleId);

                    if (style) {
                      row.style = style;
                    }
                  }
                }

                return _context3.abrupt("break", 71);

              case 63:
                if (row) {
                  c = {
                    ref: node.attributes.r,
                    s: parseInt(node.attributes.s, 10),
                    t: node.attributes.t
                  };
                }

                return _context3.abrupt("break", 71);

              case 65:
                if (c) {
                  current = c.f = {
                    text: ''
                  };
                }

                return _context3.abrupt("break", 71);

              case 67:
                if (c) {
                  current = c.v = {
                    text: ''
                  };
                }

                return _context3.abrupt("break", 71);

              case 69:
                return _context3.abrupt("break", 71);

              case 70:
                return _context3.abrupt("break", 71);

              case 71:
                if (!(emitHyperlinks || hyperlinks)) {
                  _context3.next = 80;
                  break;
                }

                _context3.t3 = node.name;
                _context3.next = _context3.t3 === 'hyperlinks' ? 75 : _context3.t3 === 'hyperlink' ? 77 : 79;
                break;

              case 75:
                inHyperlinks = true;
                return _context3.abrupt("break", 80);

              case 77:
                if (inHyperlinks) {
                  hyperlink = {
                    ref: node.attributes.ref,
                    rId: node.attributes['r:id']
                  };

                  if (emitHyperlinks) {
                    worksheetEvents.push({
                      eventType: 'hyperlink',
                      value: hyperlink
                    });
                  } else {
                    hyperlinks[hyperlink.ref] = hyperlink;
                  }
                }

                return _context3.abrupt("break", 80);

              case 79:
                return _context3.abrupt("break", 80);

              case 80:
                _context3.next = 137;
                break;

              case 82:
                if (!(eventType === 'text')) {
                  _context3.next = 86;
                  break;
                }

                // only text data is for sheet values
                if (emitSheet) {
                  if (current) {
                    current.text += value;
                  }
                }

                _context3.next = 137;
                break;

              case 86:
                if (!(eventType === 'closetag')) {
                  _context3.next = 137;
                  break;
                }

                _node = value;

                if (!emitSheet) {
                  _context3.next = 130;
                  break;
                }

                _context3.t4 = _node.name;
                _context3.next = _context3.t4 === 'cols' ? 92 : _context3.t4 === 'sheetData' ? 95 : _context3.t4 === 'row' ? 97 : _context3.t4 === 'c' ? 101 : 129;
                break;

              case 92:
                inCols = false;
                _this2._columns = Column.fromModel(cols);
                return _context3.abrupt("break", 130);

              case 95:
                inRows = false;
                return _context3.abrupt("break", 130);

              case 97:
                _this2._dimensions.expandRow(row);

                worksheetEvents.push({
                  eventType: 'row',
                  value: row
                });
                row = null;
                return _context3.abrupt("break", 130);

              case 101:
                if (!(row && c)) {
                  _context3.next = 128;
                  break;
                }

                address = colCache.decodeAddress(c.ref);
                cell = row.getCell(address.col);

                if (c.s) {
                  _style = styles.getStyleModel(c.s);

                  if (_style) {
                    cell.style = _style;
                  }
                }

                if (!c.f) {
                  _context3.next = 111;
                  break;
                }

                cellValue = {
                  formula: c.f.text
                };

                if (c.v) {
                  if (c.t === 'str') {
                    cellValue.result = utils.xmlDecode(c.v.text);
                  } else {
                    cellValue.result = parseFloat(c.v.text);
                  }
                }

                cell.value = cellValue;
                _context3.next = 126;
                break;

              case 111:
                if (!c.v) {
                  _context3.next = 126;
                  break;
                }

                _context3.t5 = c.t;
                _context3.next = _context3.t5 === 's' ? 115 : _context3.t5 === 'str' ? 118 : _context3.t5 === 'e' ? 120 : _context3.t5 === 'b' ? 122 : 124;
                break;

              case 115:
                index = parseInt(c.v.text, 10);

                if (sharedStrings) {
                  cell.value = sharedStrings[index];
                } else {
                  cell.value = {
                    sharedString: index
                  };
                }

                return _context3.abrupt("break", 126);

              case 118:
                cell.value = utils.xmlDecode(c.v.text);
                return _context3.abrupt("break", 126);

              case 120:
                cell.value = {
                  error: c.v.text
                };
                return _context3.abrupt("break", 126);

              case 122:
                cell.value = parseInt(c.v.text, 10) !== 0;
                return _context3.abrupt("break", 126);

              case 124:
                if (utils.isDateFmt(cell.numFmt)) {
                  cell.value = utils.excelToDate(parseFloat(c.v.text), properties.model && properties.model.date1904);
                } else {
                  cell.value = parseFloat(c.v.text);
                }

                return _context3.abrupt("break", 126);

              case 126:
                if (hyperlinks) {
                  _hyperlink = hyperlinks[c.ref];

                  if (_hyperlink) {
                    cell.text = cell.value;
                    cell.value = undefined;
                    cell.hyperlink = _hyperlink;
                  }
                }

                c = null;

              case 128:
                return _context3.abrupt("break", 130);

              case 129:
                return _context3.abrupt("break", 130);

              case 130:
                if (!(emitHyperlinks || hyperlinks)) {
                  _context3.next = 137;
                  break;
                }

                _context3.t6 = _node.name;
                _context3.next = _context3.t6 === 'hyperlinks' ? 134 : 136;
                break;

              case 134:
                inHyperlinks = false;
                return _context3.abrupt("break", 137);

              case 136:
                return _context3.abrupt("break", 137);

              case 137:
                _context3.next = 46;
                break;

              case 139:
                _context3.next = 144;
                break;

              case 141:
                _context3.prev = 141;
                _context3.t7 = _context3["catch"](44);

                _iterator6.e(_context3.t7);

              case 144:
                _context3.prev = 144;

                _iterator6.f();

                return _context3.finish(144);

              case 147:
                if (!(worksheetEvents.length > 0)) {
                  _context3.next = 150;
                  break;
                }

                _context3.next = 150;
                return worksheetEvents;

              case 150:
                _iteratorNormalCompletion3 = true;
                _context3.next = 33;
                break;

              case 153:
                _context3.next = 159;
                break;

              case 155:
                _context3.prev = 155;
                _context3.t8 = _context3["catch"](31);
                _didIteratorError3 = true;
                _iteratorError3 = _context3.t8;

              case 159:
                _context3.prev = 159;
                _context3.prev = 160;

                if (!(!_iteratorNormalCompletion3 && _iterator3.return != null)) {
                  _context3.next = 164;
                  break;
                }

                _context3.next = 164;
                return _awaitAsyncGenerator(_iterator3.return());

              case 164:
                _context3.prev = 164;

                if (!_didIteratorError3) {
                  _context3.next = 167;
                  break;
                }

                throw _iteratorError3;

              case 167:
                return _context3.finish(164);

              case 168:
                return _context3.finish(159);

              case 169:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[31, 155, 159, 169], [44, 141, 144, 147], [160,, 164, 168]]);
      }))();
    }
  }, {
    key: "dimensions",
    get: function get() {
      return this._dimensions;
    } // =========================================================================
    // Columns
    // get the current columns array.

  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    }
  }]);

  return WorksheetReader;
}(EventEmitter);

module.exports = WorksheetReader;
//# sourceMappingURL=worksheet-reader.js.map
