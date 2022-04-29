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

var BaseXform = require('../base-xform'); // used for rendering the [Content_Types].xml file
// not used for parsing


var ContentTypesXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(ContentTypesXform, _BaseXform);

  var _super = _createSuper(ContentTypesXform);

  function ContentTypesXform() {
    _classCallCheck(this, ContentTypesXform);

    return _super.apply(this, arguments);
  }

  _createClass(ContentTypesXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('Types', ContentTypesXform.PROPERTY_ATTRIBUTES);
      var mediaHash = {};
      (model.media || []).forEach(function (medium) {
        if (medium.type === 'image') {
          var imageType = medium.extension;

          if (!mediaHash[imageType]) {
            mediaHash[imageType] = true;
            xmlStream.leafNode('Default', {
              Extension: imageType,
              ContentType: "image/".concat(imageType)
            });
          }
        }
      });
      xmlStream.leafNode('Default', {
        Extension: 'rels',
        ContentType: 'application/vnd.openxmlformats-package.relationships+xml'
      });
      xmlStream.leafNode('Default', {
        Extension: 'xml',
        ContentType: 'application/xml'
      });
      xmlStream.leafNode('Override', {
        PartName: '/xl/workbook.xml',
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'
      });
      model.worksheets.forEach(function (worksheet) {
        var name = "/xl/worksheets/sheet".concat(worksheet.id, ".xml");
        xmlStream.leafNode('Override', {
          PartName: name,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'
        });
      });
      xmlStream.leafNode('Override', {
        PartName: '/xl/theme/theme1.xml',
        ContentType: 'application/vnd.openxmlformats-officedocument.theme+xml'
      });
      xmlStream.leafNode('Override', {
        PartName: '/xl/styles.xml',
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml'
      });
      var hasSharedStrings = model.sharedStrings && model.sharedStrings.count;

      if (hasSharedStrings) {
        xmlStream.leafNode('Override', {
          PartName: '/xl/sharedStrings.xml',
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml'
        });
      }

      if (model.tables) {
        model.tables.forEach(function (table) {
          xmlStream.leafNode('Override', {
            PartName: "/xl/tables/".concat(table.target),
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml'
          });
        });
      }

      if (model.drawings) {
        model.drawings.forEach(function (drawing) {
          xmlStream.leafNode('Override', {
            PartName: "/xl/drawings/".concat(drawing.name, ".xml"),
            ContentType: 'application/vnd.openxmlformats-officedocument.drawing+xml'
          });
        });
      }

      if (model.commentRefs) {
        xmlStream.leafNode('Default', {
          Extension: 'vml',
          ContentType: 'application/vnd.openxmlformats-officedocument.vmlDrawing'
        });
        model.commentRefs.forEach(function (_ref) {
          var commentName = _ref.commentName;
          xmlStream.leafNode('Override', {
            PartName: "/xl/".concat(commentName, ".xml"),
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml'
          });
        });
      }

      xmlStream.leafNode('Override', {
        PartName: '/docProps/core.xml',
        ContentType: 'application/vnd.openxmlformats-package.core-properties+xml'
      });
      xmlStream.leafNode('Override', {
        PartName: '/docProps/app.xml',
        ContentType: 'application/vnd.openxmlformats-officedocument.extended-properties+xml'
      });
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen() {
      return false;
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose() {
      return false;
    }
  }]);

  return ContentTypesXform;
}(BaseXform);

ContentTypesXform.PROPERTY_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/package/2006/content-types'
};
module.exports = ContentTypesXform;
//# sourceMappingURL=content-types-xform.js.map
