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

var TextXform = require('./text-xform');

var FontXform = require('../style/font-xform');

var BaseXform = require('../base-xform'); // <r>
//   <rPr>
//     <sz val="11"/>
//     <color theme="1" tint="5"/>
//     <rFont val="Calibri"/>
//     <family val="2"/>
//     <scheme val="minor"/>
//   </rPr>
//   <t xml:space="preserve"> is </t>
// </r>


var RichTextXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(RichTextXform, _BaseXform);

  var _super = _createSuper(RichTextXform);

  function RichTextXform(model) {
    var _this;

    _classCallCheck(this, RichTextXform);

    _this = _super.call(this);
    _this.model = model;
    return _this;
  }

  _createClass(RichTextXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      model = model || this.model;
      xmlStream.openNode('r');

      if (model.font) {
        this.fontXform.render(xmlStream, model.font);
      }

      this.textXform.render(xmlStream, model.text);
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
        case 'r':
          this.model = {};
          return true;

        case 't':
          this.parser = this.textXform;
          this.parser.parseOpen(node);
          return true;

        case 'rPr':
          this.parser = this.fontXform;
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
      switch (name) {
        case 'r':
          return false;

        case 't':
          this.model.text = this.parser.model;
          this.parser = undefined;
          return true;

        case 'rPr':
          this.model.font = this.parser.model;
          this.parser = undefined;
          return true;

        default:
          if (this.parser) {
            this.parser.parseClose(name);
          }

          return true;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'r';
    }
  }, {
    key: "textXform",
    get: function get() {
      return this._textXform || (this._textXform = new TextXform());
    }
  }, {
    key: "fontXform",
    get: function get() {
      return this._fontXform || (this._fontXform = new FontXform(RichTextXform.FONT_OPTIONS));
    }
  }]);

  return RichTextXform;
}(BaseXform);

RichTextXform.FONT_OPTIONS = {
  tagName: 'rPr',
  fontNameTag: 'rFont'
};
module.exports = RichTextXform;
//# sourceMappingURL=rich-text-xform.js.map
