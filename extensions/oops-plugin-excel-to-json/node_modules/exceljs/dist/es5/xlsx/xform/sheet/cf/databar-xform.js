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

var CompositeXform = require('../../composite-xform');

var ColorXform = require('../../style/color-xform');

var CfvoXform = require('./cfvo-xform');

var DatabarXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(DatabarXform, _CompositeXform);

  var _super = _createSuper(DatabarXform);

  function DatabarXform() {
    var _this;

    _classCallCheck(this, DatabarXform);

    _this = _super.call(this);
    _this.map = {
      cfvo: _this.cfvoXform = new CfvoXform(),
      color: _this.colorXform = new ColorXform()
    };
    return _this;
  }

  _createClass(DatabarXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var _this2 = this;

      xmlStream.openNode(this.tag);
      model.cfvo.forEach(function (cfvo) {
        _this2.cfvoXform.render(xmlStream, cfvo);
      });
      this.colorXform.render(xmlStream, model.color);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {
        cfvo: []
      };
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      switch (name) {
        case 'cfvo':
          this.model.cfvo.push(parser.model);
          break;

        case 'color':
          this.model.color = parser.model;
          break;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'dataBar';
    }
  }]);

  return DatabarXform;
}(CompositeXform);

module.exports = DatabarXform;
//# sourceMappingURL=databar-xform.js.map
