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

var DateXform = require('../simple/date-xform');

var StringXform = require('../simple/string-xform');

var IntegerXform = require('../simple/integer-xform');

var CoreXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(CoreXform, _BaseXform);

  var _super = _createSuper(CoreXform);

  function CoreXform() {
    var _this;

    _classCallCheck(this, CoreXform);

    _this = _super.call(this);
    _this.map = {
      'dc:creator': new StringXform({
        tag: 'dc:creator'
      }),
      'dc:title': new StringXform({
        tag: 'dc:title'
      }),
      'dc:subject': new StringXform({
        tag: 'dc:subject'
      }),
      'dc:description': new StringXform({
        tag: 'dc:description'
      }),
      'dc:identifier': new StringXform({
        tag: 'dc:identifier'
      }),
      'dc:language': new StringXform({
        tag: 'dc:language'
      }),
      'cp:keywords': new StringXform({
        tag: 'cp:keywords'
      }),
      'cp:category': new StringXform({
        tag: 'cp:category'
      }),
      'cp:lastModifiedBy': new StringXform({
        tag: 'cp:lastModifiedBy'
      }),
      'cp:lastPrinted': new DateXform({
        tag: 'cp:lastPrinted',
        format: CoreXform.DateFormat
      }),
      'cp:revision': new IntegerXform({
        tag: 'cp:revision'
      }),
      'cp:version': new StringXform({
        tag: 'cp:version'
      }),
      'cp:contentStatus': new StringXform({
        tag: 'cp:contentStatus'
      }),
      'cp:contentType': new StringXform({
        tag: 'cp:contentType'
      }),
      'dcterms:created': new DateXform({
        tag: 'dcterms:created',
        attrs: CoreXform.DateAttrs,
        format: CoreXform.DateFormat
      }),
      'dcterms:modified': new DateXform({
        tag: 'dcterms:modified',
        attrs: CoreXform.DateAttrs,
        format: CoreXform.DateFormat
      })
    };
    return _this;
  }

  _createClass(CoreXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('cp:coreProperties', CoreXform.CORE_PROPERTY_ATTRIBUTES);
      this.map['dc:creator'].render(xmlStream, model.creator);
      this.map['dc:title'].render(xmlStream, model.title);
      this.map['dc:subject'].render(xmlStream, model.subject);
      this.map['dc:description'].render(xmlStream, model.description);
      this.map['dc:identifier'].render(xmlStream, model.identifier);
      this.map['dc:language'].render(xmlStream, model.language);
      this.map['cp:keywords'].render(xmlStream, model.keywords);
      this.map['cp:category'].render(xmlStream, model.category);
      this.map['cp:lastModifiedBy'].render(xmlStream, model.lastModifiedBy);
      this.map['cp:lastPrinted'].render(xmlStream, model.lastPrinted);
      this.map['cp:revision'].render(xmlStream, model.revision);
      this.map['cp:version'].render(xmlStream, model.version);
      this.map['cp:contentStatus'].render(xmlStream, model.contentStatus);
      this.map['cp:contentType'].render(xmlStream, model.contentType);
      this.map['dcterms:created'].render(xmlStream, model.created);
      this.map['dcterms:modified'].render(xmlStream, model.modified);
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
        case 'cp:coreProperties':
        case 'coreProperties':
          return true;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
            return true;
          }

          throw new Error("Unexpected xml node in parseOpen: ".concat(JSON.stringify(node)));
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
        case 'cp:coreProperties':
        case 'coreProperties':
          this.model = {
            creator: this.map['dc:creator'].model,
            title: this.map['dc:title'].model,
            subject: this.map['dc:subject'].model,
            description: this.map['dc:description'].model,
            identifier: this.map['dc:identifier'].model,
            language: this.map['dc:language'].model,
            keywords: this.map['cp:keywords'].model,
            category: this.map['cp:category'].model,
            lastModifiedBy: this.map['cp:lastModifiedBy'].model,
            lastPrinted: this.map['cp:lastPrinted'].model,
            revision: this.map['cp:revision'].model,
            contentStatus: this.map['cp:contentStatus'].model,
            contentType: this.map['cp:contentType'].model,
            created: this.map['dcterms:created'].model,
            modified: this.map['dcterms:modified'].model
          };
          return false;

        default:
          throw new Error("Unexpected xml node in parseClose: ".concat(name));
      }
    }
  }]);

  return CoreXform;
}(BaseXform);

CoreXform.DateFormat = function (dt) {
  return dt.toISOString().replace(/[.]\d{3}/, '');
};

CoreXform.DateAttrs = {
  'xsi:type': 'dcterms:W3CDTF'
};
CoreXform.CORE_PROPERTY_ATTRIBUTES = {
  'xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
  'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
  'xmlns:dcterms': 'http://purl.org/dc/terms/',
  'xmlns:dcmitype': 'http://purl.org/dc/dcmitype/',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
};
module.exports = CoreXform;
//# sourceMappingURL=core-xform.js.map
