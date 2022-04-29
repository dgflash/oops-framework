"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TypedStack = /*#__PURE__*/function () {
  function TypedStack(type) {
    _classCallCheck(this, TypedStack);

    this._type = type;
    this._stack = [];
  }

  _createClass(TypedStack, [{
    key: "pop",
    value: function pop() {
      var tos = this._stack.pop();

      return tos || new this._type();
    }
  }, {
    key: "push",
    value: function push(instance) {
      if (!(instance instanceof this._type)) {
        throw new Error('Invalid type pushed to TypedStack');
      }

      this._stack.push(instance);
    }
  }, {
    key: "size",
    get: function get() {
      return this._stack.length;
    }
  }]);

  return TypedStack;
}();

module.exports = TypedStack;
//# sourceMappingURL=typed-stack.js.map
