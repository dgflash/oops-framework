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

var _ = require('../../../utils/under-dash');

var defaultNumFormats = require('../../defaultnumformats');

var BaseXform = require('../base-xform');

function hashDefaultFormats() {
  var hash = {};

  _.each(defaultNumFormats, function (dnf, id) {
    if (dnf.f) {
      hash[dnf.f] = parseInt(id, 10);
    } // at some point, add the other cultures here...

  });

  return hash;
}

var defaultFmtHash = hashDefaultFormats(); // NumFmt encapsulates translation between number format and xlsx

var NumFmtXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(NumFmtXform, _BaseXform);

  var _super = _createSuper(NumFmtXform);

  function NumFmtXform(id, formatCode) {
    var _this;

    _classCallCheck(this, NumFmtXform);

    _this = _super.call(this);
    _this.id = id;
    _this.formatCode = formatCode;
    return _this;
  }

  _createClass(NumFmtXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.leafNode('numFmt', {
        numFmtId: model.id,
        formatCode: model.formatCode
      });
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case 'numFmt':
          this.model = {
            id: parseInt(node.attributes.numFmtId, 10),
            formatCode: node.attributes.formatCode.replace(/[\\](.)/g, '$1')
          };
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose() {
      return false;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'numFmt';
    }
  }]);

  return NumFmtXform;
}(BaseXform);

NumFmtXform.getDefaultFmtId = function getDefaultFmtId(formatCode) {
  return defaultFmtHash[formatCode];
};

NumFmtXform.getDefaultFmtCode = function getDefaultFmtCode(numFmtId) {
  return defaultNumFormats[numFmtId] && defaultNumFormats[numFmtId].f;
};

module.exports = NumFmtXform;
//# sourceMappingURL=numfmt-xform.js.map
