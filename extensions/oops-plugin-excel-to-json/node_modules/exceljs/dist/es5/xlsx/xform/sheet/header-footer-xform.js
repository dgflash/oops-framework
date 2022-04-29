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

var HeaderFooterXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(HeaderFooterXform, _BaseXform);

  var _super = _createSuper(HeaderFooterXform);

  function HeaderFooterXform() {
    _classCallCheck(this, HeaderFooterXform);

    return _super.apply(this, arguments);
  }

  _createClass(HeaderFooterXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      if (model) {
        xmlStream.addRollback();
        var createTag = false;
        xmlStream.openNode('headerFooter');

        if (model.differentFirst) {
          xmlStream.addAttribute('differentFirst', '1');
          createTag = true;
        }

        if (model.differentOddEven) {
          xmlStream.addAttribute('differentOddEven', '1');
          createTag = true;
        }

        if (model.oddHeader && typeof model.oddHeader === 'string') {
          xmlStream.leafNode('oddHeader', null, model.oddHeader);
          createTag = true;
        }

        if (model.oddFooter && typeof model.oddFooter === 'string') {
          xmlStream.leafNode('oddFooter', null, model.oddFooter);
          createTag = true;
        }

        if (model.evenHeader && typeof model.evenHeader === 'string') {
          xmlStream.leafNode('evenHeader', null, model.evenHeader);
          createTag = true;
        }

        if (model.evenFooter && typeof model.evenFooter === 'string') {
          xmlStream.leafNode('evenFooter', null, model.evenFooter);
          createTag = true;
        }

        if (model.firstHeader && typeof model.firstHeader === 'string') {
          xmlStream.leafNode('firstHeader', null, model.firstHeader);
          createTag = true;
        }

        if (model.firstFooter && typeof model.firstFooter === 'string') {
          xmlStream.leafNode('firstFooter', null, model.firstFooter);
          createTag = true;
        }

        if (createTag) {
          xmlStream.closeNode();
          xmlStream.commit();
        } else {
          xmlStream.rollback();
        }
      }
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case 'headerFooter':
          this.model = {};

          if (node.attributes.differentFirst) {
            this.model.differentFirst = parseInt(node.attributes.differentFirst, 0) === 1;
          }

          if (node.attributes.differentOddEven) {
            this.model.differentOddEven = parseInt(node.attributes.differentOddEven, 0) === 1;
          }

          return true;

        case 'oddHeader':
          this.currentNode = 'oddHeader';
          return true;

        case 'oddFooter':
          this.currentNode = 'oddFooter';
          return true;

        case 'evenHeader':
          this.currentNode = 'evenHeader';
          return true;

        case 'evenFooter':
          this.currentNode = 'evenFooter';
          return true;

        case 'firstHeader':
          this.currentNode = 'firstHeader';
          return true;

        case 'firstFooter':
          this.currentNode = 'firstFooter';
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      switch (this.currentNode) {
        case 'oddHeader':
          this.model.oddHeader = text;
          break;

        case 'oddFooter':
          this.model.oddFooter = text;
          break;

        case 'evenHeader':
          this.model.evenHeader = text;
          break;

        case 'evenFooter':
          this.model.evenFooter = text;
          break;

        case 'firstHeader':
          this.model.firstHeader = text;
          break;

        case 'firstFooter':
          this.model.firstFooter = text;
          break;

        default:
          break;
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose() {
      switch (this.currentNode) {
        case 'oddHeader':
        case 'oddFooter':
        case 'evenHeader':
        case 'evenFooter':
        case 'firstHeader':
        case 'firstFooter':
          this.currentNode = undefined;
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'headerFooter';
    }
  }]);

  return HeaderFooterXform;
}(BaseXform);

module.exports = HeaderFooterXform;
//# sourceMappingURL=header-footer-xform.js.map
