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

var _require = require('uuid'),
    uuidv4 = _require.v4;

var BaseXform = require('../../base-xform');

var CompositeXform = require('../../composite-xform');

var DatabarExtXform = require('./databar-ext-xform');

var IconSetExtXform = require('./icon-set-ext-xform');

var extIcons = {
  '3Triangles': true,
  '3Stars': true,
  '5Boxes': true
};

var CfRuleExtXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(CfRuleExtXform, _CompositeXform);

  var _super = _createSuper(CfRuleExtXform);

  function CfRuleExtXform() {
    var _this;

    _classCallCheck(this, CfRuleExtXform);

    _this = _super.call(this);
    _this.map = {
      'x14:dataBar': _this.databarXform = new DatabarExtXform(),
      'x14:iconSet': _this.iconSetXform = new IconSetExtXform()
    };
    return _this;
  }

  _createClass(CfRuleExtXform, [{
    key: "prepare",
    value: function prepare(model) {
      if (CfRuleExtXform.isExt(model)) {
        model.x14Id = "{".concat(uuidv4(), "}").toUpperCase();
      }
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      if (!CfRuleExtXform.isExt(model)) {
        return;
      }

      switch (model.type) {
        case 'dataBar':
          this.renderDataBar(xmlStream, model);
          break;

        case 'iconSet':
          this.renderIconSet(xmlStream, model);
          break;
      }
    }
  }, {
    key: "renderDataBar",
    value: function renderDataBar(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'dataBar',
        id: model.x14Id
      });
      this.databarXform.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "renderIconSet",
    value: function renderIconSet(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        type: 'iconSet',
        priority: model.priority,
        id: model.x14Id || "{".concat(uuidv4(), "}")
      });
      this.iconSetXform.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel(_ref) {
      var attributes = _ref.attributes;
      return {
        type: attributes.type,
        x14Id: attributes.id,
        priority: BaseXform.toIntValue(attributes.priority)
      };
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      Object.assign(this.model, parser.model);
    }
  }, {
    key: "tag",
    get: function get() {
      return 'x14:cfRule';
    }
  }], [{
    key: "isExt",
    value: function isExt(rule) {
      // is this rule primitive?
      if (rule.type === 'dataBar') {
        return DatabarExtXform.isExt(rule);
      }

      if (rule.type === 'iconSet') {
        if (rule.custom || extIcons[rule.iconSet]) {
          return true;
        }
      }

      return false;
    }
  }]);

  return CfRuleExtXform;
}(CompositeXform);

module.exports = CfRuleExtXform;
//# sourceMappingURL=cf-rule-ext-xform.js.map
