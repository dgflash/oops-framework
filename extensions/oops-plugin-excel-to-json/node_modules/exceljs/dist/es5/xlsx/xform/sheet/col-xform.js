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

var BaseXform = require('../base-xform');

var ColXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(ColXform, _BaseXform);

  var _super = _createSuper(ColXform);

  function ColXform() {
    _classCallCheck(this, ColXform);

    return _super.apply(this, arguments);
  }

  _createClass(ColXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      var styleId = options.styles.addStyleModel(model.style || {});

      if (styleId) {
        model.styleId = styleId;
      }
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('col');
      xmlStream.addAttribute('min', model.min);
      xmlStream.addAttribute('max', model.max);

      if (model.width) {
        xmlStream.addAttribute('width', model.width);
      }

      if (model.styleId) {
        xmlStream.addAttribute('style', model.styleId);
      }

      if (model.hidden) {
        xmlStream.addAttribute('hidden', '1');
      }

      if (model.bestFit) {
        xmlStream.addAttribute('bestFit', '1');
      }

      if (model.outlineLevel) {
        xmlStream.addAttribute('outlineLevel', model.outlineLevel);
      }

      if (model.collapsed) {
        xmlStream.addAttribute('collapsed', '1');
      }

      xmlStream.addAttribute('customWidth', '1');
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (node.name === 'col') {
        var model = this.model = {
          min: parseInt(node.attributes.min || '0', 10),
          max: parseInt(node.attributes.max || '0', 10),
          width: node.attributes.width === undefined ? undefined : parseFloat(node.attributes.width || '0')
        };

        if (node.attributes.style) {
          model.styleId = parseInt(node.attributes.style, 10);
        }

        if (node.attributes.hidden === true || node.attributes.hidden === 'true' || node.attributes.hidden === 1 || node.attributes.hidden === '1') {
          model.hidden = true;
        }

        if (node.attributes.bestFit) {
          model.bestFit = true;
        }

        if (node.attributes.outlineLevel) {
          model.outlineLevel = parseInt(node.attributes.outlineLevel, 10);
        }

        if (node.attributes.collapsed) {
          model.collapsed = true;
        }

        return true;
      }

      return false;
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
    key: "reconcile",
    value: function reconcile(model, options) {
      // reconcile column styles
      if (model.styleId) {
        model.style = options.styles.getStyleModel(model.styleId);
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'col';
    }
  }]);

  return ColXform;
}(BaseXform);

module.exports = ColXform;
//# sourceMappingURL=col-xform.js.map
