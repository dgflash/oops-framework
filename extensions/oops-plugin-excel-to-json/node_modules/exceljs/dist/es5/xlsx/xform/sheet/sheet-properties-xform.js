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

var ColorXform = require('../style/color-xform');

var PageSetupPropertiesXform = require('./page-setup-properties-xform');

var OutlinePropertiesXform = require('./outline-properties-xform');

var SheetPropertiesXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(SheetPropertiesXform, _BaseXform);

  var _super = _createSuper(SheetPropertiesXform);

  function SheetPropertiesXform() {
    var _this;

    _classCallCheck(this, SheetPropertiesXform);

    _this = _super.call(this);
    _this.map = {
      tabColor: new ColorXform('tabColor'),
      pageSetUpPr: new PageSetupPropertiesXform(),
      outlinePr: new OutlinePropertiesXform()
    };
    return _this;
  }

  _createClass(SheetPropertiesXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      if (model) {
        xmlStream.addRollback();
        xmlStream.openNode('sheetPr');
        var inner = false;
        inner = this.map.tabColor.render(xmlStream, model.tabColor) || inner;
        inner = this.map.pageSetUpPr.render(xmlStream, model.pageSetup) || inner;
        inner = this.map.outlinePr.render(xmlStream, model.outlineProperties) || inner;

        if (inner) {
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
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      if (node.name === this.tag) {
        this.reset();
        return true;
      }

      if (this.map[node.name]) {
        this.parser = this.map[node.name];
        this.parser.parseOpen(node);
        return true;
      }

      return false;
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      if (this.parser) {
        this.parser.parseText(text);
        return true;
      }

      return false;
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

      if (this.map.tabColor.model || this.map.pageSetUpPr.model || this.map.outlinePr.model) {
        this.model = {};

        if (this.map.tabColor.model) {
          this.model.tabColor = this.map.tabColor.model;
        }

        if (this.map.pageSetUpPr.model) {
          this.model.pageSetup = this.map.pageSetUpPr.model;
        }

        if (this.map.outlinePr.model) {
          this.model.outlineProperties = this.map.outlinePr.model;
        }
      } else {
        this.model = null;
      }

      return false;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'sheetPr';
    }
  }]);

  return SheetPropertiesXform;
}(BaseXform);

module.exports = SheetPropertiesXform;
//# sourceMappingURL=sheet-properties-xform.js.map
