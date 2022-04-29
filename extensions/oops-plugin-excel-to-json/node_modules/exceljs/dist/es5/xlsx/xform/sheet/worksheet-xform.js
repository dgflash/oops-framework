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

var colCache = require('../../../utils/col-cache');

var XmlStream = require('../../../utils/xml-stream');

var RelType = require('../../rel-type');

var Merges = require('./merges');

var BaseXform = require('../base-xform');

var ListXform = require('../list-xform');

var RowXform = require('./row-xform');

var ColXform = require('./col-xform');

var DimensionXform = require('./dimension-xform');

var HyperlinkXform = require('./hyperlink-xform');

var MergeCellXform = require('./merge-cell-xform');

var DataValidationsXform = require('./data-validations-xform');

var SheetPropertiesXform = require('./sheet-properties-xform');

var SheetFormatPropertiesXform = require('./sheet-format-properties-xform');

var SheetViewXform = require('./sheet-view-xform');

var SheetProtectionXform = require('./sheet-protection-xform');

var PageMarginsXform = require('./page-margins-xform');

var PageSetupXform = require('./page-setup-xform');

var PrintOptionsXform = require('./print-options-xform');

var AutoFilterXform = require('./auto-filter-xform');

var PictureXform = require('./picture-xform');

var DrawingXform = require('./drawing-xform');

var TablePartXform = require('./table-part-xform');

var RowBreaksXform = require('./row-breaks-xform');

var HeaderFooterXform = require('./header-footer-xform');

var ConditionalFormattingsXform = require('./cf/conditional-formattings-xform');

var ExtListXform = require('./ext-lst-xform');

var mergeRule = function mergeRule(rule, extRule) {
  Object.keys(extRule).forEach(function (key) {
    var value = rule[key];
    var extValue = extRule[key];

    if (value === undefined && extValue !== undefined) {
      rule[key] = extValue;
    }
  });
};

var mergeConditionalFormattings = function mergeConditionalFormattings(model, extModel) {
  // conditional formattings are rendered in worksheet.conditionalFormatting and also in
  // worksheet.extLst.ext.x14:conditionalFormattings
  // some (e.g. dataBar) are even spread across both!
  if (!extModel || !extModel.length) {
    return model;
  }

  if (!model || !model.length) {
    return extModel;
  } // index model rules by x14Id


  var cfMap = {};
  var ruleMap = {};
  model.forEach(function (cf) {
    cfMap[cf.ref] = cf;
    cf.rules.forEach(function (rule) {
      var x14Id = rule.x14Id;

      if (x14Id) {
        ruleMap[x14Id] = rule;
      }
    });
  });
  extModel.forEach(function (extCf) {
    extCf.rules.forEach(function (extRule) {
      var rule = ruleMap[extRule.x14Id];

      if (rule) {
        // merge with matching rule
        mergeRule(rule, extRule);
      } else if (cfMap[extCf.ref]) {
        // reuse existing cf ref
        cfMap[extCf.ref].rules.push(extRule);
      } else {
        // create new cf
        model.push({
          ref: extCf.ref,
          rules: [extRule]
        });
      }
    });
  }); // need to cope with rules in extModel that don't exist in model

  return model;
};

var WorkSheetXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(WorkSheetXform, _BaseXform);

  var _super = _createSuper(WorkSheetXform);

  function WorkSheetXform(options) {
    var _this;

    _classCallCheck(this, WorkSheetXform);

    _this = _super.call(this);

    var _ref = options || {},
        maxRows = _ref.maxRows,
        maxCols = _ref.maxCols;

    _this.map = {
      sheetPr: new SheetPropertiesXform(),
      dimension: new DimensionXform(),
      sheetViews: new ListXform({
        tag: 'sheetViews',
        count: false,
        childXform: new SheetViewXform()
      }),
      sheetFormatPr: new SheetFormatPropertiesXform(),
      cols: new ListXform({
        tag: 'cols',
        count: false,
        childXform: new ColXform()
      }),
      sheetData: new ListXform({
        tag: 'sheetData',
        count: false,
        empty: true,
        childXform: new RowXform({
          maxItems: maxCols
        }),
        maxItems: maxRows
      }),
      autoFilter: new AutoFilterXform(),
      mergeCells: new ListXform({
        tag: 'mergeCells',
        count: true,
        childXform: new MergeCellXform()
      }),
      rowBreaks: new RowBreaksXform(),
      hyperlinks: new ListXform({
        tag: 'hyperlinks',
        count: false,
        childXform: new HyperlinkXform()
      }),
      pageMargins: new PageMarginsXform(),
      dataValidations: new DataValidationsXform(),
      pageSetup: new PageSetupXform(),
      headerFooter: new HeaderFooterXform(),
      printOptions: new PrintOptionsXform(),
      picture: new PictureXform(),
      drawing: new DrawingXform(),
      sheetProtection: new SheetProtectionXform(),
      tableParts: new ListXform({
        tag: 'tableParts',
        count: true,
        childXform: new TablePartXform()
      }),
      conditionalFormatting: new ConditionalFormattingsXform(),
      extLst: new ExtListXform()
    };
    return _this;
  }

  _createClass(WorkSheetXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      var _this2 = this;

      options.merges = new Merges();
      model.hyperlinks = options.hyperlinks = [];
      model.comments = options.comments = [];
      options.formulae = {};
      options.siFormulae = 0;
      this.map.cols.prepare(model.cols, options);
      this.map.sheetData.prepare(model.rows, options);
      this.map.conditionalFormatting.prepare(model.conditionalFormattings, options);
      model.mergeCells = options.merges.mergeCells; // prepare relationships

      var rels = model.rels = [];

      function nextRid(r) {
        return "rId".concat(r.length + 1);
      }

      model.hyperlinks.forEach(function (hyperlink) {
        var rId = nextRid(rels);
        hyperlink.rId = rId;
        rels.push({
          Id: rId,
          Type: RelType.Hyperlink,
          Target: hyperlink.target,
          TargetMode: 'External'
        });
      }); // prepare comment relationships

      if (model.comments.length > 0) {
        var comment = {
          Id: nextRid(rels),
          Type: RelType.Comments,
          Target: "../comments".concat(model.id, ".xml")
        };
        rels.push(comment);
        var vmlDrawing = {
          Id: nextRid(rels),
          Type: RelType.VmlDrawing,
          Target: "../drawings/vmlDrawing".concat(model.id, ".vml")
        };
        rels.push(vmlDrawing);
        model.comments.forEach(function (item) {
          item.refAddress = colCache.decodeAddress(item.ref);
        });
        options.commentRefs.push({
          commentName: "comments".concat(model.id),
          vmlDrawing: "vmlDrawing".concat(model.id)
        });
      }

      var drawingRelsHash = [];
      var bookImage;
      model.media.forEach(function (medium) {
        if (medium.type === 'background') {
          var rId = nextRid(rels);
          bookImage = options.media[medium.imageId];
          rels.push({
            Id: rId,
            Type: RelType.Image,
            Target: "../media/".concat(bookImage.name, ".").concat(bookImage.extension)
          });
          model.background = {
            rId: rId
          };
          model.image = options.media[medium.imageId];
        } else if (medium.type === 'image') {
          var drawing = model.drawing;
          bookImage = options.media[medium.imageId];

          if (!drawing) {
            drawing = model.drawing = {
              rId: nextRid(rels),
              name: "drawing".concat(++options.drawingsCount),
              anchors: [],
              rels: []
            };
            options.drawings.push(drawing);
            rels.push({
              Id: drawing.rId,
              Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing',
              Target: "../drawings/".concat(drawing.name, ".xml")
            });
          }

          var rIdImage = _this2.preImageId === medium.imageId ? drawingRelsHash[medium.imageId] : drawingRelsHash[drawing.rels.length];

          if (!rIdImage) {
            rIdImage = nextRid(drawing.rels);
            drawingRelsHash[drawing.rels.length] = rIdImage;
            drawing.rels.push({
              Id: rIdImage,
              Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
              Target: "../media/".concat(bookImage.name, ".").concat(bookImage.extension)
            });
          }

          var anchor = {
            picture: {
              rId: rIdImage
            },
            range: medium.range
          };

          if (medium.hyperlinks && medium.hyperlinks.hyperlink) {
            var rIdHyperLink = nextRid(drawing.rels);
            drawingRelsHash[drawing.rels.length] = rIdHyperLink;
            anchor.picture.hyperlinks = {
              tooltip: medium.hyperlinks.tooltip,
              rId: rIdHyperLink
            };
            drawing.rels.push({
              Id: rIdHyperLink,
              Type: RelType.Hyperlink,
              Target: medium.hyperlinks.hyperlink,
              TargetMode: 'External'
            });
          }

          _this2.preImageId = medium.imageId;
          drawing.anchors.push(anchor);
        }
      }); // prepare tables

      model.tables.forEach(function (table) {
        // relationships
        var rId = nextRid(rels);
        table.rId = rId;
        rels.push({
          Id: rId,
          Type: RelType.Table,
          Target: "../tables/".concat(table.target)
        }); // dynamic styles

        table.columns.forEach(function (column) {
          var style = column.style;

          if (style) {
            column.dxfId = options.styles.addDxfStyle(style);
          }
        });
      }); // prepare ext items

      this.map.extLst.prepare(model, options);
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('worksheet', WorkSheetXform.WORKSHEET_ATTRIBUTES);
      var sheetFormatPropertiesModel = model.properties ? {
        defaultRowHeight: model.properties.defaultRowHeight,
        dyDescent: model.properties.dyDescent,
        outlineLevelCol: model.properties.outlineLevelCol,
        outlineLevelRow: model.properties.outlineLevelRow
      } : undefined;

      if (model.properties && model.properties.defaultColWidth) {
        sheetFormatPropertiesModel.defaultColWidth = model.properties.defaultColWidth;
      }

      var sheetPropertiesModel = {
        outlineProperties: model.properties && model.properties.outlineProperties,
        tabColor: model.properties && model.properties.tabColor,
        pageSetup: model.pageSetup && model.pageSetup.fitToPage ? {
          fitToPage: model.pageSetup.fitToPage
        } : undefined
      };
      var pageMarginsModel = model.pageSetup && model.pageSetup.margins;
      var printOptionsModel = {
        showRowColHeaders: model.pageSetup && model.pageSetup.showRowColHeaders,
        showGridLines: model.pageSetup && model.pageSetup.showGridLines,
        horizontalCentered: model.pageSetup && model.pageSetup.horizontalCentered,
        verticalCentered: model.pageSetup && model.pageSetup.verticalCentered
      };
      var sheetProtectionModel = model.sheetProtection;
      this.map.sheetPr.render(xmlStream, sheetPropertiesModel);
      this.map.dimension.render(xmlStream, model.dimensions);
      this.map.sheetViews.render(xmlStream, model.views);
      this.map.sheetFormatPr.render(xmlStream, sheetFormatPropertiesModel);
      this.map.cols.render(xmlStream, model.cols);
      this.map.sheetData.render(xmlStream, model.rows);
      this.map.sheetProtection.render(xmlStream, sheetProtectionModel); // Note: must be after sheetData and before autoFilter

      this.map.autoFilter.render(xmlStream, model.autoFilter);
      this.map.mergeCells.render(xmlStream, model.mergeCells);
      this.map.conditionalFormatting.render(xmlStream, model.conditionalFormattings); // Note: must be before dataValidations

      this.map.dataValidations.render(xmlStream, model.dataValidations); // For some reason hyperlinks have to be after the data validations

      this.map.hyperlinks.render(xmlStream, model.hyperlinks);
      this.map.printOptions.render(xmlStream, printOptionsModel); // Note: must be before pageMargins

      this.map.pageMargins.render(xmlStream, pageMarginsModel);
      this.map.pageSetup.render(xmlStream, model.pageSetup);
      this.map.headerFooter.render(xmlStream, model.headerFooter);
      this.map.rowBreaks.render(xmlStream, model.rowBreaks);
      this.map.drawing.render(xmlStream, model.drawing); // Note: must be after rowBreaks

      this.map.picture.render(xmlStream, model.background); // Note: must be after drawing

      this.map.tableParts.render(xmlStream, model.tables);
      this.map.extLst.render(xmlStream, model);

      if (model.rels) {
        // add a <legacyDrawing /> node for each comment
        model.rels.forEach(function (rel) {
          if (rel.Type === RelType.VmlDrawing) {
            xmlStream.leafNode('legacyDrawing', {
              'r:id': rel.Id
            });
          }
        });
      }

      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      if (node.name === 'worksheet') {
        _.each(this.map, function (xform) {
          xform.reset();
        });

        return true;
      }

      this.parser = this.map[node.name];

      if (this.parser) {
        this.parser.parseOpen(node);
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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case 'worksheet':
          {
            var properties = this.map.sheetFormatPr.model || {};

            if (this.map.sheetPr.model && this.map.sheetPr.model.tabColor) {
              properties.tabColor = this.map.sheetPr.model.tabColor;
            }

            if (this.map.sheetPr.model && this.map.sheetPr.model.outlineProperties) {
              properties.outlineProperties = this.map.sheetPr.model.outlineProperties;
            }

            var sheetProperties = {
              fitToPage: this.map.sheetPr.model && this.map.sheetPr.model.pageSetup && this.map.sheetPr.model.pageSetup.fitToPage || false,
              margins: this.map.pageMargins.model
            };
            var pageSetup = Object.assign(sheetProperties, this.map.pageSetup.model, this.map.printOptions.model);
            var conditionalFormattings = mergeConditionalFormattings(this.map.conditionalFormatting.model, this.map.extLst.model && this.map.extLst.model['x14:conditionalFormattings']);
            this.model = {
              dimensions: this.map.dimension.model,
              cols: this.map.cols.model,
              rows: this.map.sheetData.model,
              mergeCells: this.map.mergeCells.model,
              hyperlinks: this.map.hyperlinks.model,
              dataValidations: this.map.dataValidations.model,
              properties: properties,
              views: this.map.sheetViews.model,
              pageSetup: pageSetup,
              headerFooter: this.map.headerFooter.model,
              background: this.map.picture.model,
              drawing: this.map.drawing.model,
              tables: this.map.tableParts.model,
              conditionalFormattings: conditionalFormattings
            };

            if (this.map.autoFilter.model) {
              this.model.autoFilter = this.map.autoFilter.model;
            }

            if (this.map.sheetProtection.model) {
              this.model.sheetProtection = this.map.sheetProtection.model;
            }

            return false;
          }

        default:
          // not quite sure how we get here!
          return true;
      }
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      // options.merges = new Merges();
      // options.merges.reconcile(model.mergeCells, model.rows);
      var rels = (model.relationships || []).reduce(function (h, rel) {
        h[rel.Id] = rel;

        if (rel.Type === RelType.Comments) {
          model.comments = options.comments[rel.Target].comments;
        }

        if (rel.Type === RelType.VmlDrawing && model.comments && model.comments.length) {
          var vmlComment = options.vmlDrawings[rel.Target].comments;
          model.comments.forEach(function (comment, index) {
            comment.note = Object.assign({}, comment.note, vmlComment[index]);
          });
        }

        return h;
      }, {});
      options.commentsMap = (model.comments || []).reduce(function (h, comment) {
        if (comment.ref) {
          h[comment.ref] = comment;
        }

        return h;
      }, {});
      options.hyperlinkMap = (model.hyperlinks || []).reduce(function (h, hyperlink) {
        if (hyperlink.rId) {
          h[hyperlink.address] = rels[hyperlink.rId].Target;
        }

        return h;
      }, {});
      options.formulae = {}; // compact the rows and cells

      model.rows = model.rows && model.rows.filter(Boolean) || [];
      model.rows.forEach(function (row) {
        row.cells = row.cells && row.cells.filter(Boolean) || [];
      });
      this.map.cols.reconcile(model.cols, options);
      this.map.sheetData.reconcile(model.rows, options);
      this.map.conditionalFormatting.reconcile(model.conditionalFormattings, options);
      model.media = [];

      if (model.drawing) {
        var drawingRel = rels[model.drawing.rId];
        var match = drawingRel.Target.match(/\/drawings\/([a-zA-Z0-9]+)[.][a-zA-Z]{3,4}$/);

        if (match) {
          var drawingName = match[1];
          var drawing = options.drawings[drawingName];
          drawing.anchors.forEach(function (anchor) {
            if (anchor.medium) {
              var image = {
                type: 'image',
                imageId: anchor.medium.index,
                range: anchor.range,
                hyperlinks: anchor.picture.hyperlinks
              };
              model.media.push(image);
            }
          });
        }
      }

      var backgroundRel = model.background && rels[model.background.rId];

      if (backgroundRel) {
        var target = backgroundRel.Target.split('/media/')[1];
        var imageId = options.mediaIndex && options.mediaIndex[target];

        if (imageId !== undefined) {
          model.media.push({
            type: 'background',
            imageId: imageId
          });
        }
      }

      model.tables = (model.tables || []).map(function (tablePart) {
        var rel = rels[tablePart.rId];
        return options.tables[rel.Target];
      });
      delete model.relationships;
      delete model.hyperlinks;
      delete model.comments;
    }
  }]);

  return WorkSheetXform;
}(BaseXform);

WorkSheetXform.WORKSHEET_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'x14ac',
  'xmlns:x14ac': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac'
};
module.exports = WorkSheetXform;
//# sourceMappingURL=worksheet-xform.js.map
