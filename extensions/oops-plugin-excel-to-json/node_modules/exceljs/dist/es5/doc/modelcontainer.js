'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var XLSX = require('../xlsx/xlsx');

var ModelContainer = /*#__PURE__*/function () {
  function ModelContainer(model) {
    _classCallCheck(this, ModelContainer);

    this.model = model;
  }

  _createClass(ModelContainer, [{
    key: "xlsx",
    get: function get() {
      if (!this._xlsx) {
        this._xlsx = new XLSX(this);
      }

      return this._xlsx;
    }
  }]);

  return ModelContainer;
}();

module.exports = ModelContainer;
//# sourceMappingURL=modelcontainer.js.map
