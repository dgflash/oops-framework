"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var BaseXform = require('../../base-xform');

var ConditionalFormattingXform = require('./conditional-formatting-xform');

var ConditionalFormattingsXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(ConditionalFormattingsXform, _BaseXform);

  var _super = _createSuper(ConditionalFormattingsXform);

  function ConditionalFormattingsXform() {
    var _this;

    _classCallCheck(this, ConditionalFormattingsXform);

    _this = _super.call(this);
    _this.cfXform = new ConditionalFormattingXform();
    return _this;
  }

  _createClass(ConditionalFormattingsXform, [{
    key: "reset",
    value: function reset() {
      this.model = [];
    }
  }, {
    key: "prepare",
    value: function prepare(model, options) {
      // ensure each rule has a priority value
      var nextPriority = model.reduce(function (p, cf) {
        return Math.max.apply(Math, [p].concat(_toConsumableArray(cf.rules.map(function (rule) {
          return rule.priority || 0;
        }))));
      }, 1);
      model.forEach(function (cf) {
        cf.rules.forEach(function (rule) {
          if (!rule.priority) {
            rule.priority = nextPriority++;
          }

          if (rule.style) {
            rule.dxfId = options.styles.addDxfStyle(rule.style);
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      var _this2 = this;

      model.forEach(function (cf) {
        _this2.cfXform.render(xmlStream, cf);
      });
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      switch (node.name) {
        case 'conditionalFormatting':
          this.parser = this.cfXform;
          this.parser.parseOpen(node);
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      if (this.parser) {
        this.parser.parseText(text);
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model.push(this.parser.model);
          this.parser = undefined;
          return false;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      model.forEach(function (cf) {
        cf.rules.forEach(function (rule) {
          if (rule.dxfId !== undefined) {
            rule.style = options.styles.getDxfStyle(rule.dxfId);
            delete rule.dxfId;
          }
        });
      });
    }
  }, {
    key: "tag",
    get: function get() {
      return 'conditionalFormatting';
    }
  }]);

  return ConditionalFormattingsXform;
}(BaseXform);

module.exports = ConditionalFormattingsXform;
//# sourceMappingURL=conditional-formattings-xform.js.map
