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

var AlignmentXform = require('./alignment-xform');

var BorderXform = require('./border-xform');

var FillXform = require('./fill-xform');

var FontXform = require('./font-xform');

var NumFmtXform = require('./numfmt-xform');

var ProtectionXform = require('./protection-xform'); // <xf numFmtId="[numFmtId]" fontId="[fontId]" fillId="[fillId]" borderId="[xf.borderId]" xfId="[xfId]">
//   Optional <alignment>
//   Optional <protection>
// </xf>
// Style assists translation from style model to/from xlsx


var DxfXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(DxfXform, _BaseXform);

  var _super = _createSuper(DxfXform);

  function DxfXform() {
    var _this;

    _classCallCheck(this, DxfXform);

    _this = _super.call(this);
    _this.map = {
      alignment: new AlignmentXform(),
      border: new BorderXform(),
      fill: new FillXform(),
      font: new FontXform(),
      numFmt: new NumFmtXform(),
      protection: new ProtectionXform()
    };
    return _this;
  }

  _createClass(DxfXform, [{
    key: "render",
    // how do we generate dxfid?
    value: function render(xmlStream, model) {
      xmlStream.openNode(this.tag);

      if (model.font) {
        this.map.font.render(xmlStream, model.font);
      }

      if (model.numFmt) {
        this.map.numFmt.render(xmlStream, model.numFmt);
      }

      if (model.fill) {
        this.map.fill.render(xmlStream, model.fill);
      }

      if (model.alignment) {
        this.map.alignment.render(xmlStream, model.alignment);
      }

      if (model.border) {
        this.map.border.render(xmlStream, model.border);
      }

      if (model.protection) {
        this.map.protection.render(xmlStream, model.protection);
      }

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
          // this node is often repeated. Need to reset children
          this.reset();
          return true;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
          }

          return true;
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
          this.parser = undefined;
        }

        return true;
      }

      if (name === this.tag) {
        this.model = {
          alignment: this.map.alignment.model,
          border: this.map.border.model,
          fill: this.map.fill.model,
          font: this.map.font.model,
          numFmt: this.map.numFmt.model,
          protection: this.map.protection.model
        };
        return false;
      }

      return true;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'dxf';
    }
  }]);

  return DxfXform;
}(BaseXform);

module.exports = DxfXform;
//# sourceMappingURL=dxf-xform.js.map
