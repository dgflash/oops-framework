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

/* eslint-disable max-classes-per-file */
var Enums = require('../../../doc/enums');

var XmlStream = require('../../../utils/xml-stream');

var BaseXform = require('../base-xform');

var StaticXform = require('../static-xform');

var ListXform = require('../list-xform');

var FontXform = require('./font-xform');

var FillXform = require('./fill-xform');

var BorderXform = require('./border-xform');

var NumFmtXform = require('./numfmt-xform');

var StyleXform = require('./style-xform');

var DxfXform = require('./dxf-xform'); // custom numfmt ids start here


var NUMFMT_BASE = 164; // =============================================================================
// StylesXform is used to generate and parse the styles.xml file
// it manages the collections of fonts, number formats, alignments, etc

var StylesXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(StylesXform, _BaseXform);

  var _super = _createSuper(StylesXform);

  function StylesXform(initialise) {
    var _this;

    _classCallCheck(this, StylesXform);

    _this = _super.call(this);
    _this.map = {
      numFmts: new ListXform({
        tag: 'numFmts',
        count: true,
        childXform: new NumFmtXform()
      }),
      fonts: new ListXform({
        tag: 'fonts',
        count: true,
        childXform: new FontXform(),
        $: {
          'x14ac:knownFonts': 1
        }
      }),
      fills: new ListXform({
        tag: 'fills',
        count: true,
        childXform: new FillXform()
      }),
      borders: new ListXform({
        tag: 'borders',
        count: true,
        childXform: new BorderXform()
      }),
      cellStyleXfs: new ListXform({
        tag: 'cellStyleXfs',
        count: true,
        childXform: new StyleXform()
      }),
      cellXfs: new ListXform({
        tag: 'cellXfs',
        count: true,
        childXform: new StyleXform({
          xfId: true
        })
      }),
      dxfs: new ListXform({
        tag: 'dxfs',
        always: true,
        count: true,
        childXform: new DxfXform()
      }),
      // for style manager
      numFmt: new NumFmtXform(),
      font: new FontXform(),
      fill: new FillXform(),
      border: new BorderXform(),
      style: new StyleXform({
        xfId: true
      }),
      cellStyles: StylesXform.STATIC_XFORMS.cellStyles,
      tableStyles: StylesXform.STATIC_XFORMS.tableStyles,
      extLst: StylesXform.STATIC_XFORMS.extLst
    };

    if (initialise) {
      // StylesXform also acts as style manager and is used to build up styles-model during worksheet processing
      _this.init();
    }

    return _this;
  }

  _createClass(StylesXform, [{
    key: "initIndex",
    value: function initIndex() {
      this.index = {
        style: {},
        numFmt: {},
        numFmtNextId: 164,
        // start custom format ids here
        font: {},
        border: {},
        fill: {}
      };
    }
  }, {
    key: "init",
    value: function init() {
      // Prepare for Style Manager role
      this.model = {
        styles: [],
        numFmts: [],
        fonts: [],
        borders: [],
        fills: [],
        dxfs: []
      };
      this.initIndex(); // default (zero) border

      this._addBorder({}); // add default (all zero) style


      this._addStyle({
        numFmtId: 0,
        fontId: 0,
        fillId: 0,
        borderId: 0,
        xfId: 0
      }); // add default fills


      this._addFill({
        type: 'pattern',
        pattern: 'none'
      });

      this._addFill({
        type: 'pattern',
        pattern: 'gray125'
      });

      this.weakMap = new WeakMap();
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      model = model || this.model; //
      //   <fonts count="2" x14ac:knownFonts="1">

      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('styleSheet', StylesXform.STYLESHEET_ATTRIBUTES);

      if (this.index) {
        // model has been built by style manager role (contains xml)
        if (model.numFmts && model.numFmts.length) {
          xmlStream.openNode('numFmts', {
            count: model.numFmts.length
          });
          model.numFmts.forEach(function (numFmtXml) {
            xmlStream.writeXml(numFmtXml);
          });
          xmlStream.closeNode();
        }

        if (!model.fonts.length) {
          // default (zero) font
          this._addFont({
            size: 11,
            color: {
              theme: 1
            },
            name: 'Calibri',
            family: 2,
            scheme: 'minor'
          });
        }

        xmlStream.openNode('fonts', {
          count: model.fonts.length,
          'x14ac:knownFonts': 1
        });
        model.fonts.forEach(function (fontXml) {
          xmlStream.writeXml(fontXml);
        });
        xmlStream.closeNode();
        xmlStream.openNode('fills', {
          count: model.fills.length
        });
        model.fills.forEach(function (fillXml) {
          xmlStream.writeXml(fillXml);
        });
        xmlStream.closeNode();
        xmlStream.openNode('borders', {
          count: model.borders.length
        });
        model.borders.forEach(function (borderXml) {
          xmlStream.writeXml(borderXml);
        });
        xmlStream.closeNode();
        this.map.cellStyleXfs.render(xmlStream, [{
          numFmtId: 0,
          fontId: 0,
          fillId: 0,
          borderId: 0,
          xfId: 0
        }]);
        xmlStream.openNode('cellXfs', {
          count: model.styles.length
        });
        model.styles.forEach(function (styleXml) {
          xmlStream.writeXml(styleXml);
        });
        xmlStream.closeNode();
      } else {
        // model is plain JSON and needs to be xformed
        this.map.numFmts.render(xmlStream, model.numFmts);
        this.map.fonts.render(xmlStream, model.fonts);
        this.map.fills.render(xmlStream, model.fills);
        this.map.borders.render(xmlStream, model.borders);
        this.map.cellStyleXfs.render(xmlStream, [{
          numFmtId: 0,
          fontId: 0,
          fillId: 0,
          borderId: 0,
          xfId: 0
        }]);
        this.map.cellXfs.render(xmlStream, model.styles);
      }

      StylesXform.STATIC_XFORMS.cellStyles.render(xmlStream);
      this.map.dxfs.render(xmlStream, model.dxfs);
      StylesXform.STATIC_XFORMS.tableStyles.render(xmlStream);
      StylesXform.STATIC_XFORMS.extLst.render(xmlStream);
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
        case 'styleSheet':
          this.initIndex();
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
      var _this2 = this;

      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case 'styleSheet':
          {
            this.model = {};

            var add = function add(propName, xform) {
              if (xform.model && xform.model.length) {
                _this2.model[propName] = xform.model;
              }
            };

            add('numFmts', this.map.numFmts);
            add('fonts', this.map.fonts);
            add('fills', this.map.fills);
            add('borders', this.map.borders);
            add('styles', this.map.cellXfs);
            add('dxfs', this.map.dxfs); // index numFmts

            this.index = {
              model: [],
              numFmt: []
            };

            if (this.model.numFmts) {
              var numFmtIndex = this.index.numFmt;
              this.model.numFmts.forEach(function (numFmt) {
                numFmtIndex[numFmt.id] = numFmt.formatCode;
              });
            }

            return false;
          }

        default:
          // not quite sure how we get here!
          return true;
      }
    } // add a cell's style model to the collection
    // each style property is processed and cross-referenced, etc.
    // the styleId is returned. Note: cellType is used when numFmt not defined

  }, {
    key: "addStyleModel",
    value: function addStyleModel(model, cellType) {
      if (!model) {
        return 0;
      } // if we have no default font, add it here now


      if (!this.model.fonts.length) {
        // default (zero) font
        this._addFont({
          size: 11,
          color: {
            theme: 1
          },
          name: 'Calibri',
          family: 2,
          scheme: 'minor'
        });
      } // if we have seen this style object before, assume it has the same styleId


      if (this.weakMap && this.weakMap.has(model)) {
        return this.weakMap.get(model);
      }

      var style = {};
      cellType = cellType || Enums.ValueType.Number;

      if (model.numFmt) {
        style.numFmtId = this._addNumFmtStr(model.numFmt);
      } else {
        switch (cellType) {
          case Enums.ValueType.Number:
            style.numFmtId = this._addNumFmtStr('General');
            break;

          case Enums.ValueType.Date:
            style.numFmtId = this._addNumFmtStr('mm-dd-yy');
            break;

          default:
            break;
        }
      }

      if (model.font) {
        style.fontId = this._addFont(model.font);
      }

      if (model.border) {
        style.borderId = this._addBorder(model.border);
      }

      if (model.fill) {
        style.fillId = this._addFill(model.fill);
      }

      if (model.alignment) {
        style.alignment = model.alignment;
      }

      if (model.protection) {
        style.protection = model.protection;
      }

      var styleId = this._addStyle(style);

      if (this.weakMap) {
        this.weakMap.set(model, styleId);
      }

      return styleId;
    } // given a styleId (i.e. s="n"), get the cell's style model
    // objects are shared where possible.

  }, {
    key: "getStyleModel",
    value: function getStyleModel(id) {
      // if the style doesn't exist return null
      var style = this.model.styles[id];
      if (!style) return null; // have we built this model before?

      var model = this.index.model[id];
      if (model) return model; // build a new model

      model = this.index.model[id] = {}; // -------------------------------------------------------
      // number format

      if (style.numFmtId) {
        var numFmt = this.index.numFmt[style.numFmtId] || NumFmtXform.getDefaultFmtCode(style.numFmtId);

        if (numFmt) {
          model.numFmt = numFmt;
        }
      }

      function addStyle(name, group, styleId) {
        if (styleId || styleId === 0) {
          var part = group[styleId];

          if (part) {
            model[name] = part;
          }
        }
      }

      addStyle('font', this.model.fonts, style.fontId);
      addStyle('border', this.model.borders, style.borderId);
      addStyle('fill', this.model.fills, style.fillId); // -------------------------------------------------------
      // alignment

      if (style.alignment) {
        model.alignment = style.alignment;
      } // -------------------------------------------------------
      // protection


      if (style.protection) {
        model.protection = style.protection;
      }

      return model;
    }
  }, {
    key: "addDxfStyle",
    value: function addDxfStyle(style) {
      this.model.dxfs.push(style);
      return this.model.dxfs.length - 1;
    }
  }, {
    key: "getDxfStyle",
    value: function getDxfStyle(id) {
      return this.model.dxfs[id];
    } // =========================================================================
    // Private Interface

  }, {
    key: "_addStyle",
    value: function _addStyle(style) {
      var xml = this.map.style.toXml(style);
      var index = this.index.style[xml];

      if (index === undefined) {
        index = this.index.style[xml] = this.model.styles.length;
        this.model.styles.push(xml);
      }

      return index;
    } // =========================================================================
    // Number Formats

  }, {
    key: "_addNumFmtStr",
    value: function _addNumFmtStr(formatCode) {
      // check if default format
      var index = NumFmtXform.getDefaultFmtId(formatCode);
      if (index !== undefined) return index; // check if already in

      index = this.index.numFmt[formatCode];
      if (index !== undefined) return index;
      index = this.index.numFmt[formatCode] = NUMFMT_BASE + this.model.numFmts.length;
      var xml = this.map.numFmt.toXml({
        id: index,
        formatCode: formatCode
      });
      this.model.numFmts.push(xml);
      return index;
    } // =========================================================================
    // Fonts

  }, {
    key: "_addFont",
    value: function _addFont(font) {
      var xml = this.map.font.toXml(font);
      var index = this.index.font[xml];

      if (index === undefined) {
        index = this.index.font[xml] = this.model.fonts.length;
        this.model.fonts.push(xml);
      }

      return index;
    } // =========================================================================
    // Borders

  }, {
    key: "_addBorder",
    value: function _addBorder(border) {
      var xml = this.map.border.toXml(border);
      var index = this.index.border[xml];

      if (index === undefined) {
        index = this.index.border[xml] = this.model.borders.length;
        this.model.borders.push(xml);
      }

      return index;
    } // =========================================================================
    // Fills

  }, {
    key: "_addFill",
    value: function _addFill(fill) {
      var xml = this.map.fill.toXml(fill);
      var index = this.index.fill[xml];

      if (index === undefined) {
        index = this.index.fill[xml] = this.model.fills.length;
        this.model.fills.push(xml);
      }

      return index;
    } // =========================================================================

  }]);

  return StylesXform;
}(BaseXform);

StylesXform.STYLESHEET_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'x14ac x16r2',
  'xmlns:x14ac': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac',
  'xmlns:x16r2': 'http://schemas.microsoft.com/office/spreadsheetml/2015/02/main'
};
StylesXform.STATIC_XFORMS = {
  cellStyles: new StaticXform({
    tag: 'cellStyles',
    $: {
      count: 1
    },
    c: [{
      tag: 'cellStyle',
      $: {
        name: 'Normal',
        xfId: 0,
        builtinId: 0
      }
    }]
  }),
  dxfs: new StaticXform({
    tag: 'dxfs',
    $: {
      count: 0
    }
  }),
  tableStyles: new StaticXform({
    tag: 'tableStyles',
    $: {
      count: 0,
      defaultTableStyle: 'TableStyleMedium2',
      defaultPivotStyle: 'PivotStyleLight16'
    }
  }),
  extLst: new StaticXform({
    tag: 'extLst',
    c: [{
      tag: 'ext',
      $: {
        uri: '{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}',
        'xmlns:x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main'
      },
      c: [{
        tag: 'x14:slicerStyles',
        $: {
          defaultSlicerStyle: 'SlicerStyleLight1'
        }
      }]
    }, {
      tag: 'ext',
      $: {
        uri: '{9260A510-F301-46a8-8635-F512D64BE5F5}',
        'xmlns:x15': 'http://schemas.microsoft.com/office/spreadsheetml/2010/11/main'
      },
      c: [{
        tag: 'x15:timelineStyles',
        $: {
          defaultTimelineStyle: 'TimeSlicerStyleLight1'
        }
      }]
    }]
  })
}; // the stylemanager mock acts like StyleManager except that it always returns 0 or {}

var StylesXformMock = /*#__PURE__*/function (_StylesXform) {
  _inherits(StylesXformMock, _StylesXform);

  var _super2 = _createSuper(StylesXformMock);

  function StylesXformMock() {
    var _this3;

    _classCallCheck(this, StylesXformMock);

    _this3 = _super2.call(this);
    _this3.model = {
      styles: [{
        numFmtId: 0,
        fontId: 0,
        fillId: 0,
        borderId: 0,
        xfId: 0
      }],
      numFmts: [],
      fonts: [{
        size: 11,
        color: {
          theme: 1
        },
        name: 'Calibri',
        family: 2,
        scheme: 'minor'
      }],
      borders: [{}],
      fills: [{
        type: 'pattern',
        pattern: 'none'
      }, {
        type: 'pattern',
        pattern: 'gray125'
      }]
    };
    return _this3;
  } // =========================================================================
  // Style Manager Interface
  // override normal behaviour - consume and dispose


  _createClass(StylesXformMock, [{
    key: "parseStream",
    value: function parseStream(stream) {
      stream.autodrain();
      return Promise.resolve();
    } // add a cell's style model to the collection
    // each style property is processed and cross-referenced, etc.
    // the styleId is returned. Note: cellType is used when numFmt not defined

  }, {
    key: "addStyleModel",
    value: function addStyleModel(model, cellType) {
      switch (cellType) {
        case Enums.ValueType.Date:
          return this.dateStyleId;

        default:
          return 0;
      }
    }
  }, {
    key: "getStyleModel",
    // given a styleId (i.e. s="n"), get the cell's style model
    // objects are shared where possible.
    value: function getStyleModel()
    /* id */
    {
      return {};
    }
  }, {
    key: "dateStyleId",
    get: function get() {
      if (!this._dateStyleId) {
        var dateStyle = {
          numFmtId: NumFmtXform.getDefaultFmtId('mm-dd-yy')
        };
        this._dateStyleId = this.model.styles.length;
        this.model.styles.push(dateStyle);
      }

      return this._dateStyleId;
    }
  }]);

  return StylesXformMock;
}(StylesXform);

StylesXform.Mock = StylesXformMock;
module.exports = StylesXform;
//# sourceMappingURL=styles-xform.js.map
