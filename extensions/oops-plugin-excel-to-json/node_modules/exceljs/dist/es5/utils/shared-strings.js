"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SharedStrings = /*#__PURE__*/function () {
  function SharedStrings() {
    _classCallCheck(this, SharedStrings);

    this._values = [];
    this._totalRefs = 0;
    this._hash = Object.create(null);
  }

  _createClass(SharedStrings, [{
    key: "getString",
    value: function getString(index) {
      return this._values[index];
    }
  }, {
    key: "add",
    value: function add(value) {
      var index = this._hash[value];

      if (index === undefined) {
        index = this._hash[value] = this._values.length;

        this._values.push(value);
      }

      this._totalRefs++;
      return index;
    }
  }, {
    key: "count",
    get: function get() {
      return this._values.length;
    }
  }, {
    key: "values",
    get: function get() {
      return this._values;
    }
  }, {
    key: "totalRefs",
    get: function get() {
      return this._totalRefs;
    }
  }]);

  return SharedStrings;
}();

module.exports = SharedStrings;
//# sourceMappingURL=shared-strings.js.map
