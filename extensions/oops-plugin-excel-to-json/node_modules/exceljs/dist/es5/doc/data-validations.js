"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataValidations = /*#__PURE__*/function () {
  function DataValidations(model) {
    _classCallCheck(this, DataValidations);

    this.model = model || {};
  }

  _createClass(DataValidations, [{
    key: "add",
    value: function add(address, validation) {
      return this.model[address] = validation;
    }
  }, {
    key: "find",
    value: function find(address) {
      return this.model[address];
    }
  }, {
    key: "remove",
    value: function remove(address) {
      this.model[address] = undefined;
    }
  }]);

  return DataValidations;
}();

module.exports = DataValidations;
//# sourceMappingURL=data-validations.js.map
