"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var CompositeXform = require('../../composite-xform');

var CfvoExtXform = require('./cfvo-ext-xform');

var CfIconExtXform = require('./cf-icon-ext-xform');

var IconSetExtXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(IconSetExtXform, _CompositeXform);

  var _super = _createSuper(IconSetExtXform);

  function IconSetExtXform() {
    var _this;

    _classCallCheck(this, IconSetExtXform);

    _this = _super.call(this);
    _this.map = {
      'x14:cfvo': _this.cfvoXform = new CfvoExtXform(),
      'x14:cfIcon': _this.cfIconXform = new CfIconExtXform()
    };
    return _this;
  }

  _createClass(IconSetExtXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var _this2 = this;

      xmlStream.openNode(this.tag, {
        iconSet: BaseXform.toStringAttribute(model.iconSet),
        reverse: BaseXform.toBoolAttribute(model.reverse, false),
        showValue: BaseXform.toBoolAttribute(model.showValue, true),
        custom: BaseXform.toBoolAttribute(model.icons, false)
      });
      model.cfvo.forEach(function (cfvo) {
        _this2.cfvoXform.render(xmlStream, cfvo);
      });

      if (model.icons) {
        model.icons.forEach(function (icon, i) {
          icon.iconId = i;

          _this2.cfIconXform.render(xmlStream, icon);
        });
      }

      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel(_ref) {
      var attributes = _ref.attributes;
      return {
        cfvo: [],
        iconSet: BaseXform.toStringValue(attributes.iconSet, '3TrafficLights'),
        reverse: BaseXform.toBoolValue(attributes.reverse, false),
        showValue: BaseXform.toBoolValue(attributes.showValue, true)
      };
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      var _name$split = name.split(':'),
          _name$split2 = _slicedToArray(_name$split, 2),
          prop = _name$split2[1];

      switch (prop) {
        case 'cfvo':
          this.model.cfvo.push(parser.model);
          break;

        case 'cfIcon':
          if (!this.model.icons) {
            this.model.icons = [];
          }

          this.model.icons.push(parser.model);
          break;

        default:
          this.model[prop] = parser.model;
          break;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'x14:iconSet';
    }
  }]);

  return IconSetExtXform;
}(CompositeXform);

module.exports = IconSetExtXform;
//# sourceMappingURL=icon-set-ext-xform.js.map
