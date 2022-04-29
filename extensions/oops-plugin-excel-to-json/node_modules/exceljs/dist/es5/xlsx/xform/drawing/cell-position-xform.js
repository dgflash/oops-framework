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

var IntegerXform = require('../simple/integer-xform');

var CellPositionXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(CellPositionXform, _BaseXform);

  var _super = _createSuper(CellPositionXform);

  function CellPositionXform(options) {
    var _this;

    _classCallCheck(this, CellPositionXform);

    _this = _super.call(this);
    _this.tag = options.tag;
    _this.map = {
      'xdr:col': new IntegerXform({
        tag: 'xdr:col',
        zero: true
      }),
      'xdr:colOff': new IntegerXform({
        tag: 'xdr:colOff',
        zero: true
      }),
      'xdr:row': new IntegerXform({
        tag: 'xdr:row',
        zero: true
      }),
      'xdr:rowOff': new IntegerXform({
        tag: 'xdr:rowOff',
        zero: true
      })
    };
    return _this;
  }

  _createClass(CellPositionXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode(this.tag);
      this.map['xdr:col'].render(xmlStream, model.nativeCol);
      this.map['xdr:colOff'].render(xmlStream, model.nativeColOff);
      this.map['xdr:row'].render(xmlStream, model.nativeRow);
      this.map['xdr:rowOff'].render(xmlStream, model.nativeRowOff);
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      switch (node.name) {
        case this.tag:
          this.reset();
          break;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
          }

          break;
      }

      return true;
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
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case this.tag:
          this.model = {
            nativeCol: this.map['xdr:col'].model,
            nativeColOff: this.map['xdr:colOff'].model,
            nativeRow: this.map['xdr:row'].model,
            nativeRowOff: this.map['xdr:rowOff'].model
          };
          return false;

        default:
          // not quite sure how we get here!
          return true;
      }
    }
  }]);

  return CellPositionXform;
}(BaseXform);

module.exports = CellPositionXform;
//# sourceMappingURL=cell-position-xform.js.map
