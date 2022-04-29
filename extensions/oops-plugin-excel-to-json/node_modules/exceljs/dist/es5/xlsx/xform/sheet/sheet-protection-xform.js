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

function booleanToXml(model, value) {
  return model ? value : undefined;
}

function xmlToBoolean(value, equals) {
  return value === equals ? true : undefined;
}

var SheetProtectionXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(SheetProtectionXform, _BaseXform);

  var _super = _createSuper(SheetProtectionXform);

  function SheetProtectionXform() {
    _classCallCheck(this, SheetProtectionXform);

    return _super.apply(this, arguments);
  }

  _createClass(SheetProtectionXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      if (model) {
        var attributes = {
          sheet: booleanToXml(model.sheet, '1'),
          selectLockedCells: model.selectLockedCells === false ? '1' : undefined,
          selectUnlockedCells: model.selectUnlockedCells === false ? '1' : undefined,
          formatCells: booleanToXml(model.formatCells, '0'),
          formatColumns: booleanToXml(model.formatColumns, '0'),
          formatRows: booleanToXml(model.formatRows, '0'),
          insertColumns: booleanToXml(model.insertColumns, '0'),
          insertRows: booleanToXml(model.insertRows, '0'),
          insertHyperlinks: booleanToXml(model.insertHyperlinks, '0'),
          deleteColumns: booleanToXml(model.deleteColumns, '0'),
          deleteRows: booleanToXml(model.deleteRows, '0'),
          sort: booleanToXml(model.sort, '0'),
          autoFilter: booleanToXml(model.autoFilter, '0'),
          pivotTables: booleanToXml(model.pivotTables, '0')
        };

        if (model.sheet) {
          attributes.algorithmName = model.algorithmName;
          attributes.hashValue = model.hashValue;
          attributes.saltValue = model.saltValue;
          attributes.spinCount = model.spinCount;
          attributes.objects = booleanToXml(model.objects === false, '1');
          attributes.scenarios = booleanToXml(model.scenarios === false, '1');
        }

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
            sheet: xmlToBoolean(node.attributes.sheet, '1'),
            objects: node.attributes.objects === '1' ? false : undefined,
            scenarios: node.attributes.scenarios === '1' ? false : undefined,
            selectLockedCells: node.attributes.selectLockedCells === '1' ? false : undefined,
            selectUnlockedCells: node.attributes.selectUnlockedCells === '1' ? false : undefined,
            formatCells: xmlToBoolean(node.attributes.formatCells, '0'),
            formatColumns: xmlToBoolean(node.attributes.formatColumns, '0'),
            formatRows: xmlToBoolean(node.attributes.formatRows, '0'),
            insertColumns: xmlToBoolean(node.attributes.insertColumns, '0'),
            insertRows: xmlToBoolean(node.attributes.insertRows, '0'),
            insertHyperlinks: xmlToBoolean(node.attributes.insertHyperlinks, '0'),
            deleteColumns: xmlToBoolean(node.attributes.deleteColumns, '0'),
            deleteRows: xmlToBoolean(node.attributes.deleteRows, '0'),
            sort: xmlToBoolean(node.attributes.sort, '0'),
            autoFilter: xmlToBoolean(node.attributes.autoFilter, '0'),
            pivotTables: xmlToBoolean(node.attributes.pivotTables, '0')
          };

          if (node.attributes.algorithmName) {
            this.model.algorithmName = node.attributes.algorithmName;
            this.model.hashValue = node.attributes.hashValue;
            this.model.saltValue = node.attributes.saltValue;
            this.model.spinCount = parseInt(node.attributes.spinCount, 10);
          }

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
      return 'sheetProtection';
    }
  }]);

  return SheetProtectionXform;
}(BaseXform);

module.exports = SheetProtectionXform;
//# sourceMappingURL=sheet-protection-xform.js.map
