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

var XmlStream = require('../../../utils/xml-stream');

var BaseXform = require('../base-xform');

var StringXform = require('../simple/string-xform');

var AppHeadingPairsXform = require('./app-heading-pairs-xform');

var AppTitleOfPartsXform = require('./app-titles-of-parts-xform');

var AppXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(AppXform, _BaseXform);

  var _super = _createSuper(AppXform);

  function AppXform() {
    var _this;

    _classCallCheck(this, AppXform);

    _this = _super.call(this);
    _this.map = {
      Company: new StringXform({
        tag: 'Company'
      }),
      Manager: new StringXform({
        tag: 'Manager'
      }),
      HeadingPairs: new AppHeadingPairsXform(),
      TitleOfParts: new AppTitleOfPartsXform()
    };
    return _this;
  }

  _createClass(AppXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('Properties', AppXform.PROPERTY_ATTRIBUTES);
      xmlStream.leafNode('Application', undefined, 'Microsoft Excel');
      xmlStream.leafNode('DocSecurity', undefined, '0');
      xmlStream.leafNode('ScaleCrop', undefined, 'false');
      this.map.HeadingPairs.render(xmlStream, model.worksheets);
      this.map.TitleOfParts.render(xmlStream, model.worksheets);
      this.map.Company.render(xmlStream, model.company || '');
      this.map.Manager.render(xmlStream, model.manager);
      xmlStream.leafNode('LinksUpToDate', undefined, 'false');
      xmlStream.leafNode('SharedDoc', undefined, 'false');
      xmlStream.leafNode('HyperlinksChanged', undefined, 'false');
      xmlStream.leafNode('AppVersion', undefined, '16.0300');
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
        case 'Properties':
          return true;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
            return true;
          } // there's a lot we don't bother to parse


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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case 'Properties':
          this.model = {
            worksheets: this.map.TitleOfParts.model,
            company: this.map.Company.model,
            manager: this.map.Manager.model
          };
          return false;

        default:
          return true;
      }
    }
  }]);

  return AppXform;
}(BaseXform);

AppXform.DateFormat = function (dt) {
  return dt.toISOString().replace(/[.]\d{3,6}/, '');
};

AppXform.DateAttrs = {
  'xsi:type': 'dcterms:W3CDTF'
};
AppXform.PROPERTY_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties',
  'xmlns:vt': 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes'
};
module.exports = AppXform;
//# sourceMappingURL=app-xform.js.map
