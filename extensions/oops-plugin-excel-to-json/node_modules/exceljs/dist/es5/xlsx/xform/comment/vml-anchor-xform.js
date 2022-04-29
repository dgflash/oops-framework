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

var BaseXform = require('../base-xform'); // render the triangle in the cell for the comment


var VmlAnchorXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(VmlAnchorXform, _BaseXform);

  var _super = _createSuper(VmlAnchorXform);

  function VmlAnchorXform() {
    _classCallCheck(this, VmlAnchorXform);

    return _super.apply(this, arguments);
  }

  _createClass(VmlAnchorXform, [{
    key: "getAnchorRect",
    value: function getAnchorRect(anchor) {
      var l = Math.floor(anchor.left);
      var lf = Math.floor((anchor.left - l) * 68);
      var t = Math.floor(anchor.top);
      var tf = Math.floor((anchor.top - t) * 18);
      var r = Math.floor(anchor.right);
      var rf = Math.floor((anchor.right - r) * 68);
      var b = Math.floor(anchor.bottom);
      var bf = Math.floor((anchor.bottom - b) * 18);
      return [l, lf, t, tf, r, rf, b, bf];
    }
  }, {
    key: "getDefaultRect",
    value: function getDefaultRect(ref) {
      var l = ref.col;
      var lf = 6;
      var t = Math.max(ref.row - 2, 0);
      var tf = 14;
      var r = l + 2;
      var rf = 2;
      var b = t + 4;
      var bf = 16;
      return [l, lf, t, tf, r, rf, b, bf];
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      var rect = model.anchor ? this.getAnchorRect(model.anchor) : this.getDefaultRect(model.refAddress);
      xmlStream.leafNode('x:Anchor', null, rect.join(', '));
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case this.tag:
          this.text = '';
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      this.text = text;
    }
  }, {
    key: "parseClose",
    value: function parseClose() {
      return false;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'x:Anchor';
    }
  }]);

  return VmlAnchorXform;
}(BaseXform);

module.exports = VmlAnchorXform;
//# sourceMappingURL=vml-anchor-xform.js.map
