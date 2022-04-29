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

var _ = require('../../../utils/under-dash');

var BaseXform = require('../base-xform');

function booleanToXml(model) {
  return model ? '1' : undefined;
}

function pageOrderToXml(model) {
  switch (model) {
    case 'overThenDown':
      return model;

    default:
      return undefined;
  }
}

function cellCommentsToXml(model) {
  switch (model) {
    case 'atEnd':
    case 'asDisplyed':
      return model;

    default:
      return undefined;
  }
}

function errorsToXml(model) {
  switch (model) {
    case 'dash':
    case 'blank':
    case 'NA':
      return model;

    default:
      return undefined;
  }
}

function pageSizeToModel(value) {
  return value !== undefined ? parseInt(value, 10) : undefined;
}

var PageSetupXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(PageSetupXform, _BaseXform);

  var _super = _createSuper(PageSetupXform);

  function PageSetupXform() {
    _classCallCheck(this, PageSetupXform);

    return _super.apply(this, arguments);
  }

  _createClass(PageSetupXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      if (model) {
        var attributes = {
          paperSize: model.paperSize,
          orientation: model.orientation,
          horizontalDpi: model.horizontalDpi,
          verticalDpi: model.verticalDpi,
          pageOrder: pageOrderToXml(model.pageOrder),
          blackAndWhite: booleanToXml(model.blackAndWhite),
          draft: booleanToXml(model.draft),
          cellComments: cellCommentsToXml(model.cellComments),
          errors: errorsToXml(model.errors),
          scale: model.scale,
          fitToWidth: model.fitToWidth,
          fitToHeight: model.fitToHeight,
          firstPageNumber: model.firstPageNumber,
          useFirstPageNumber: booleanToXml(model.firstPageNumber),
          usePrinterDefaults: booleanToXml(model.usePrinterDefaults),
          copies: model.copies
        };

        if (_.some(attributes, function (value) {
          return value !== undefined;
        })) {
          xmlStream.leafNode(this.tag, attributes);
        }
      }
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case this.tag:
          this.model = {
            paperSize: pageSizeToModel(node.attributes.paperSize),
            orientation: node.attributes.orientation || 'portrait',
            horizontalDpi: parseInt(node.attributes.horizontalDpi || '4294967295', 10),
            verticalDpi: parseInt(node.attributes.verticalDpi || '4294967295', 10),
            pageOrder: node.attributes.pageOrder || 'downThenOver',
            blackAndWhite: node.attributes.blackAndWhite === '1',
            draft: node.attributes.draft === '1',
            cellComments: node.attributes.cellComments || 'None',
            errors: node.attributes.errors || 'displayed',
            scale: parseInt(node.attributes.scale || '100', 10),
            fitToWidth: parseInt(node.attributes.fitToWidth || '1', 10),
            fitToHeight: parseInt(node.attributes.fitToHeight || '1', 10),
            firstPageNumber: parseInt(node.attributes.firstPageNumber || '1', 10),
            useFirstPageNumber: node.attributes.useFirstPageNumber === '1',
            usePrinterDefaults: node.attributes.usePrinterDefaults === '1',
            copies: parseInt(node.attributes.copies || '1', 10)
          };
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose() {
      return false;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'pageSetup';
    }
  }]);

  return PageSetupXform;
}(BaseXform);

module.exports = PageSetupXform;
//# sourceMappingURL=page-setup-xform.js.map
