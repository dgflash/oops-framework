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

var SqRefExtXform = require('./sqref-ext-xform');

var CfRuleExtXform = require('./cf-rule-ext-xform');

var ConditionalFormattingExtXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(ConditionalFormattingExtXform, _CompositeXform);

  var _super = _createSuper(ConditionalFormattingExtXform);

  function ConditionalFormattingExtXform() {
    var _this;

    _classCallCheck(this, ConditionalFormattingExtXform);

    _this = _super.call(this);
    _this.map = {
      'xm:sqref': _this.sqRef = new SqRefExtXform(),
      'x14:cfRule': _this.cfRule = new CfRuleExtXform()
    };
    return _this;
  }

  _createClass(ConditionalFormattingExtXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      var _this2 = this;

      model.rules.forEach(function (rule) {
        _this2.cfRule.prepare(rule, options);
      });
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      var _this3 = this;

      if (!model.rules.some(CfRuleExtXform.isExt)) {
        return;
      }

      xmlStream.openNode(this.tag, {
        'xmlns:xm': 'http://schemas.microsoft.com/office/excel/2006/main'
      });
      model.rules.filter(CfRuleExtXform.isExt).forEach(function (rule) {
        return _this3.cfRule.render(xmlStream, rule);
      }); // for some odd reason, Excel needs the <xm:sqref> node to be after the rules

      this.sqRef.render(xmlStream, model.ref);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {
        rules: []
      };
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      switch (name) {
        case 'xm:sqref':
          this.model.ref = parser.model;
          break;

        case 'x14:cfRule':
          this.model.rules.push(parser.model);
          break;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'x14:conditionalFormatting';
    }
  }]);

  return ConditionalFormattingExtXform;
}(CompositeXform);

module.exports = ConditionalFormattingExtXform;
//# sourceMappingURL=conditional-formatting-ext-xform.js.map
