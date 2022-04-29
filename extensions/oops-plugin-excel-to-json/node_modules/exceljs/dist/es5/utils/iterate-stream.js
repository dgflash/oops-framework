"use strict";

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

module.exports = /*#__PURE__*/function () {
  var _iterateStream = _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stream) {
    var contents, resolveStreamEndedPromise, streamEndedPromise, ended, error, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contents = [];
            stream.on('data', function (data) {
              return contents.push(data);
            });
            streamEndedPromise = new Promise(function (resolve) {
              return resolveStreamEndedPromise = resolve;
            });
            ended = false;
            stream.on('end', function () {
              ended = true;
              resolveStreamEndedPromise();
            });
            error = false;
            stream.on('error', function (err) {
              error = err;
              resolveStreamEndedPromise();
            });

          case 7:
            if (!(!ended || contents.length > 0)) {
              _context.next = 22;
              break;
            }

            if (!(contents.length === 0)) {
              _context.next = 14;
              break;
            }

            stream.resume(); // eslint-disable-next-line no-await-in-loop

            _context.next = 12;
            return _awaitAsyncGenerator(Promise.race([once(stream, 'data'), streamEndedPromise]));

          case 12:
            _context.next = 18;
            break;

          case 14:
            stream.pause();
            data = contents.shift();
            _context.next = 18;
            return data;

          case 18:
            if (!error) {
              _context.next = 20;
              break;
            }

            throw error;

          case 20:
            _context.next = 7;
            break;

          case 22:
            resolveStreamEndedPromise();

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function iterateStream(_x) {
    return _iterateStream.apply(this, arguments);
  }

  return iterateStream;
}();

function once(eventEmitter, type) {
  // TODO: Use require('events').once when node v10 is dropped
  return new Promise(function (resolve) {
    var fired = false;

    var handler = function handler() {
      if (!fired) {
        fired = true;
        eventEmitter.removeListener(type, handler);
        resolve();
      }
    };

    eventEmitter.addListener(type, handler);
  });
}
//# sourceMappingURL=iterate-stream.js.map
