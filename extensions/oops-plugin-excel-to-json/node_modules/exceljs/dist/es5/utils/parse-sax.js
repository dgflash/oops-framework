"use strict";

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var _require = require('saxes'),
    SaxesParser = _require.SaxesParser;

var _require2 = require('readable-stream'),
    PassThrough = _require2.PassThrough;

var _require3 = require('./browser-buffer-decode'),
    bufferToString = _require3.bufferToString;

module.exports = /*#__PURE__*/function () {
  var _ref = _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(iterable) {
    var saxesParser, error, events, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // TODO: Remove once node v8 is deprecated
            // Detect and upgrade old streams
            if (iterable.pipe && !iterable[Symbol.asyncIterator]) {
              iterable = iterable.pipe(new PassThrough());
            }

            saxesParser = new SaxesParser();
            saxesParser.on('error', function (err) {
              error = err;
            });
            events = [];
            saxesParser.on('opentag', function (value) {
              return events.push({
                eventType: 'opentag',
                value: value
              });
            });
            saxesParser.on('text', function (value) {
              return events.push({
                eventType: 'text',
                value: value
              });
            });
            saxesParser.on('closetag', function (value) {
              return events.push({
                eventType: 'closetag',
                value: value
              });
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 9;
            _iterator = _asyncIterator(iterable);

          case 11:
            _context.next = 13;
            return _awaitAsyncGenerator(_iterator.next());

          case 13:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 17;
            return _awaitAsyncGenerator(_step.value);

          case 17:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 29;
              break;
            }

            chunk = _value;
            saxesParser.write(bufferToString(chunk)); // saxesParser.write and saxesParser.on() are synchronous,
            // so we can only reach the below line once all events have been emitted

            if (!error) {
              _context.next = 23;
              break;
            }

            throw error;

          case 23:
            _context.next = 25;
            return events;

          case 25:
            events = [];

          case 26:
            _iteratorNormalCompletion = true;
            _context.next = 11;
            break;

          case 29:
            _context.next = 35;
            break;

          case 31:
            _context.prev = 31;
            _context.t0 = _context["catch"](9);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 35:
            _context.prev = 35;
            _context.prev = 36;

            if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
              _context.next = 40;
              break;
            }

            _context.next = 40;
            return _awaitAsyncGenerator(_iterator.return());

          case 40:
            _context.prev = 40;

            if (!_didIteratorError) {
              _context.next = 43;
              break;
            }

            throw _iteratorError;

          case 43:
            return _context.finish(40);

          case 44:
            return _context.finish(35);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 31, 35, 45], [36,, 40, 44]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=parse-sax.js.map
