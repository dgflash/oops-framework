"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var ListXform = require('../list-xform');

var AutoFilterXform = require('./auto-filter-xform');

var TableColumnXform = require('./table-column-xform');

var TableStyleInfoXform = require('./table-style-info-xform');

var TableXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(TableXform, _BaseXform);

  var _super = _createSuper(TableXform);

  function TableXform() {
    var _this;

    _classCallCheck(this, TableXform);

    _this = _super.call(this);
    _this.map = {
      autoFilter: new AutoFilterXform(),
      tableColumns: new ListXform({
        tag: 'tableColumns',
        count: true,
        empty: true,
        childXform: new TableColumnXform()
      }),
      tableStyleInfo: new TableStyleInfoXform()
    };
    return _this;
  }

  _createClass(TableXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      this.map.autoFilter.prepare(model);
      this.map.tableColumns.prepare(model.columns, options);
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode(this.tag, _objectSpread(_objectSpread({}, TableXform.TABLE_ATTRIBUTES), {}, {
        id: model.id,
        name: model.name,
        displayName: model.displayName || model.name,
        ref: model.tableRef,
        totalsRowCount: model.totalsRow ? '1' : undefined,
        totalsRowShown: model.totalsRow ? undefined : '1',
        headerRowCount: model.headerRow ? '1' : '0'
      }));
      this.map.autoFilter.render(xmlStream, model);
      this.map.tableColumns.render(xmlStream, model.columns);
      this.map.tableStyleInfo.render(xmlStream, model.style);
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      var name = node.name,
          attributes = node.attributes;

      switch (name) {
        case this.tag:
          this.reset();
          this.model = {
            name: attributes.name,
            displayName: attributes.displayName || attributes.name,
            tableRef: attributes.ref,
            totalsRow: attributes.totalsRowCount === '1',
            headerRow: attributes.headerRowCount === '1'
          };
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
      var _this2 = this;

      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case this.tag:
          this.model.columns = this.map.tableColumns.model;

          if (this.map.autoFilter.model) {
            this.model.autoFilterRef = this.map.autoFilter.model.autoFilterRef;
            this.map.autoFilter.model.columns.forEach(function (column, index) {
              _this2.model.columns[index].filterButton = column.filterButton;
            });
          }

          this.model.style = this.map.tableStyleInfo.model;
          return false;

        default:
          // could be some unrecognised tags
          return true;
      }
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      // fetch the dfxs from styles
      model.columns.forEach(function (column) {
        if (column.dxfId !== undefined) {
          column.style = options.styles.getDxfStyle(column.dxfId);
        }
      });
    }
  }, {
    key: "tag",
    get: function get() {
      return 'table';
    }
  }]);

  return TableXform;
}(BaseXform);

TableXform.TABLE_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr xr3',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision',
  'xmlns:xr3': 'http://schemas.microsoft.com/office/spreadsheetml/2016/revision3' // 'xr:uid': '{00000000-000C-0000-FFFF-FFFF00000000}',

};
module.exports = TableXform;
//# sourceMappingURL=table-xform.js.map
