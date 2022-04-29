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

var Enums = require('../../../doc/enums');

var utils = require('../../../utils/utils');

var BaseXform = require('../base-xform');

var validation = {
  horizontalValues: ['left', 'center', 'right', 'fill', 'centerContinuous', 'distributed', 'justify'].reduce(function (p, v) {
    p[v] = true;
    return p;
  }, {}),
  horizontal: function horizontal(value) {
    return this.horizontalValues[value] ? value : undefined;
  },
  verticalValues: ['top', 'middle', 'bottom', 'distributed', 'justify'].reduce(function (p, v) {
    p[v] = true;
    return p;
  }, {}),
  vertical: function vertical(value) {
    if (value === 'middle') return 'center';
    return this.verticalValues[value] ? value : undefined;
  },
  wrapText: function wrapText(value) {
    return value ? true : undefined;
  },
  shrinkToFit: function shrinkToFit(value) {
    return value ? true : undefined;
  },
  textRotation: function textRotation(value) {
    switch (value) {
      case 'vertical':
        return value;

      default:
        value = utils.validInt(value);
        return value >= -90 && value <= 90 ? value : undefined;
    }
  },
  indent: function indent(value) {
    value = utils.validInt(value);
    return Math.max(0, value);
  },
  readingOrder: function readingOrder(value) {
    switch (value) {
      case 'ltr':
        return Enums.ReadingOrder.LeftToRight;

      case 'rtl':
        return Enums.ReadingOrder.RightToLeft;

      default:
        return undefined;
    }
  }
};
var textRotationXform = {
  toXml: function toXml(textRotation) {
    textRotation = validation.textRotation(textRotation);

    if (textRotation) {
      if (textRotation === 'vertical') {
        return 255;
      }

      var tr = Math.round(textRotation);

      if (tr >= 0 && tr <= 90) {
        return tr;
      }

      if (tr < 0 && tr >= -90) {
        return 90 - tr;
      }
    }

    return undefined;
  },
  toModel: function toModel(textRotation) {
    var tr = utils.validInt(textRotation);

    if (tr !== undefined) {
      if (tr === 255) {
        return 'vertical';
      }

      if (tr >= 0 && tr <= 90) {
        return tr;
      }

      if (tr > 90 && tr <= 180) {
        return 90 - tr;
      }
    }

    return undefined;
  }
}; // Alignment encapsulates translation from style.alignment model to/from xlsx

var AlignmentXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(AlignmentXform, _BaseXform);

  var _super = _createSuper(AlignmentXform);

  function AlignmentXform() {
    _classCallCheck(this, AlignmentXform);

    return _super.apply(this, arguments);
  }

  _createClass(AlignmentXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.addRollback();
      xmlStream.openNode('alignment');
      var isValid = false;

      function add(name, value) {
        if (value) {
          xmlStream.addAttribute(name, value);
          isValid = true;
        }
      }

      add('horizontal', validation.horizontal(model.horizontal));
      add('vertical', validation.vertical(model.vertical));
      add('wrapText', validation.wrapText(model.wrapText) ? '1' : false);
      add('shrinkToFit', validation.shrinkToFit(model.shrinkToFit) ? '1' : false);
      add('indent', validation.indent(model.indent));
      add('textRotation', textRotationXform.toXml(model.textRotation));
      add('readingOrder', validation.readingOrder(model.readingOrder));
      xmlStream.closeNode();

      if (isValid) {
        xmlStream.commit();
      } else {
        xmlStream.rollback();
      }
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      var model = {};
      var valid = false;

      function add(truthy, name, value) {
        if (truthy) {
          model[name] = value;
          valid = true;
        }
      }

      add(node.attributes.horizontal, 'horizontal', node.attributes.horizontal);
      add(node.attributes.vertical, 'vertical', node.attributes.vertical === 'center' ? 'middle' : node.attributes.vertical);
      add(node.attributes.wrapText, 'wrapText', !!node.attributes.wrapText);
      add(node.attributes.shrinkToFit, 'shrinkToFit', !!node.attributes.shrinkToFit);
      add(node.attributes.indent, 'indent', parseInt(node.attributes.indent, 10));
      add(node.attributes.textRotation, 'textRotation', textRotationXform.toModel(node.attributes.textRotation));
      add(node.attributes.readingOrder, 'readingOrder', node.attributes.readingOrder === '2' ? 'rtl' : 'ltr');
      this.model = valid ? model : null;
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
      return 'alignment';
    }
  }]);

  return AlignmentXform;
}(BaseXform);

module.exports = AlignmentXform;
//# sourceMappingURL=alignment-xform.js.map
