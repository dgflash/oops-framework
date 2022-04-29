"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var parseSax = require('../../utils/parse-sax');

var XmlStream = require('../../utils/xml-stream');
/* 'virtual' methods used as a form of documentation */

/* eslint-disable class-methods-use-this */
// Base class for Xforms


var BaseXform = /*#__PURE__*/function () {
  function BaseXform() {
    _classCallCheck(this, BaseXform);
  }

  _createClass(BaseXform, [{
    key: "prepare",
    // constructor(/* model, name */) {}
    // ============================================================
    // Virtual Interface
    value: function prepare()
    /* model, options */
    {// optional preparation (mutation) of model so it is ready for write
    }
  }, {
    key: "render",
    value: function render()
    /* xmlStream, model */
    {// convert model to xml
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {// XML node opened
    }
  }, {
    key: "parseText",
    value: function parseText(text) {// chunk of text encountered for current node
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {// XML node closed
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {// optional post-parse step (opposite to prepare)
    } // ============================================================

  }, {
    key: "reset",
    value: function reset() {
      // to make sure parses don't bleed to next iteration
      this.model = null; // if we have a map - reset them too

      if (this.map) {
        Object.values(this.map).forEach(function (xform) {
          if (xform instanceof BaseXform) {
            xform.reset();
          } else if (xform.xform) {
            xform.xform.reset();
          }
        });
      }
    }
  }, {
    key: "mergeModel",
    value: function mergeModel(obj) {
      // set obj's props to this.model
      this.model = Object.assign(this.model || {}, obj);
    }
  }, {
    key: "parse",
    value: function () {
      var _parse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(saxParser) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, events, _iterator2, _step2, _step2$value, eventType, value;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 2;
                _iterator = _asyncIterator(saxParser);

              case 4:
                _context.next = 6;
                return _iterator.next();

              case 6:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 10;
                return _step.value;

              case 10:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 42;
                  break;
                }

                events = _value;
                _iterator2 = _createForOfIteratorHelper(events);
                _context.prev = 14;

                _iterator2.s();

              case 16:
                if ((_step2 = _iterator2.n()).done) {
                  _context.next = 31;
                  break;
                }

                _step2$value = _step2.value, eventType = _step2$value.eventType, value = _step2$value.value;

                if (!(eventType === 'opentag')) {
                  _context.next = 22;
                  break;
                }

                this.parseOpen(value);
                _context.next = 29;
                break;

              case 22:
                if (!(eventType === 'text')) {
                  _context.next = 26;
                  break;
                }

                this.parseText(value);
                _context.next = 29;
                break;

              case 26:
                if (!(eventType === 'closetag')) {
                  _context.next = 29;
                  break;
                }

                if (this.parseClose(value.name)) {
                  _context.next = 29;
                  break;
                }

                return _context.abrupt("return", this.model);

              case 29:
                _context.next = 16;
                break;

              case 31:
                _context.next = 36;
                break;

              case 33:
                _context.prev = 33;
                _context.t0 = _context["catch"](14);

                _iterator2.e(_context.t0);

              case 36:
                _context.prev = 36;

                _iterator2.f();

                return _context.finish(36);

              case 39:
                _iteratorNormalCompletion = true;
                _context.next = 4;
                break;

              case 42:
                _context.next = 48;
                break;

              case 44:
                _context.prev = 44;
                _context.t1 = _context["catch"](2);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 48:
                _context.prev = 48;
                _context.prev = 49;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context.next = 53;
                  break;
                }

                _context.next = 53;
                return _iterator.return();

              case 53:
                _context.prev = 53;

                if (!_didIteratorError) {
                  _context.next = 56;
                  break;
                }

                throw _iteratorError;

              case 56:
                return _context.finish(53);

              case 57:
                return _context.finish(48);

              case 58:
                return _context.abrupt("return", this.model);

              case 59:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 44, 48, 58], [14, 33, 36, 39], [49,, 53, 57]]);
      }));

      function parse(_x) {
        return _parse.apply(this, arguments);
      }

      return parse;
    }()
  }, {
    key: "parseStream",
    value: function () {
      var _parseStream = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(stream) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.parse(parseSax(stream)));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseStream(_x2) {
        return _parseStream.apply(this, arguments);
      }

      return parseStream;
    }()
  }, {
    key: "toXml",
    value: function toXml(model) {
      var xmlStream = new XmlStream();
      this.render(xmlStream, model);
      return xmlStream.xml;
    } // ============================================================
    // Useful Utilities

  }, {
    key: "xml",
    get: function get() {
      // convenience function to get the xml of this.model
      // useful for manager types that are built during the prepare phase
      return this.toXml(this.model);
    }
  }], [{
    key: "toAttribute",
    value: function toAttribute(value, dflt) {
      var always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (value === undefined) {
        if (always) {
          return dflt;
        }
      } else if (always || value !== dflt) {
        return value.toString();
      }

      return undefined;
    }
  }, {
    key: "toStringAttribute",
    value: function toStringAttribute(value, dflt) {
      var always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return BaseXform.toAttribute(value, dflt, always);
    }
  }, {
    key: "toStringValue",
    value: function toStringValue(attr, dflt) {
      return attr === undefined ? dflt : attr;
    }
  }, {
    key: "toBoolAttribute",
    value: function toBoolAttribute(value, dflt) {
      var always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (value === undefined) {
        if (always) {
          return dflt;
        }
      } else if (always || value !== dflt) {
        return value ? '1' : '0';
      }

      return undefined;
    }
  }, {
    key: "toBoolValue",
    value: function toBoolValue(attr, dflt) {
      return attr === undefined ? dflt : attr === '1';
    }
  }, {
    key: "toIntAttribute",
    value: function toIntAttribute(value, dflt) {
      var always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return BaseXform.toAttribute(value, dflt, always);
    }
  }, {
    key: "toIntValue",
    value: function toIntValue(attr, dflt) {
      return attr === undefined ? dflt : parseInt(attr, 10);
    }
  }, {
    key: "toFloatAttribute",
    value: function toFloatAttribute(value, dflt) {
      var always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return BaseXform.toAttribute(value, dflt, always);
    }
  }, {
    key: "toFloatValue",
    value: function toFloatValue(attr, dflt) {
      return attr === undefined ? dflt : parseFloat(attr);
    }
  }]);

  return BaseXform;
}();

module.exports = BaseXform;
//# sourceMappingURL=base-xform.js.map
