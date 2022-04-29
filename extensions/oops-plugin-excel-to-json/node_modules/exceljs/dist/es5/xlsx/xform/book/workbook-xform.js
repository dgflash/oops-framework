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

var BaseXform = require('../base-xform');

var StaticXform = require('../static-xform');

var ListXform = require('../list-xform');

var DefinedNameXform = require('./defined-name-xform');

var SheetXform = require('./sheet-xform');

var WorkbookViewXform = require('./workbook-view-xform');

var WorkbookPropertiesXform = require('./workbook-properties-xform');

var WorkbookCalcPropertiesXform = require('./workbook-calc-properties-xform');

var WorkbookXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(WorkbookXform, _BaseXform);

  var _super = _createSuper(WorkbookXform);

  function WorkbookXform() {
    var _this;

    _classCallCheck(this, WorkbookXform);

    _this = _super.call(this);
    _this.map = {
      fileVersion: WorkbookXform.STATIC_XFORMS.fileVersion,
      workbookPr: new WorkbookPropertiesXform(),
      bookViews: new ListXform({
        tag: 'bookViews',
        count: false,
        childXform: new WorkbookViewXform()
      }),
      sheets: new ListXform({
        tag: 'sheets',
        count: false,
        childXform: new SheetXform()
      }),
      definedNames: new ListXform({
        tag: 'definedNames',
        count: false,
        childXform: new DefinedNameXform()
      }),
      calcPr: new WorkbookCalcPropertiesXform()
    };
    return _this;
  }

  _createClass(WorkbookXform, [{
    key: "prepare",
    value: function prepare(model) {
      model.sheets = model.worksheets; // collate all the print areas from all of the sheets and add them to the defined names

      var printAreas = [];
      var index = 0; // sheets is sparse array - calc index manually

      model.sheets.forEach(function (sheet) {
        if (sheet.pageSetup && sheet.pageSetup.printArea) {
          sheet.pageSetup.printArea.split('&&').forEach(function (printArea) {
            var printAreaComponents = printArea.split(':');
            var definedName = {
              name: '_xlnm.Print_Area',
              ranges: ["'".concat(sheet.name, "'!$").concat(printAreaComponents[0], ":$").concat(printAreaComponents[1])],
              localSheetId: index
            };
            printAreas.push(definedName);
          });
        }

        if (sheet.pageSetup && (sheet.pageSetup.printTitlesRow || sheet.pageSetup.printTitlesColumn)) {
          var ranges = [];

          if (sheet.pageSetup.printTitlesColumn) {
            var titlesColumns = sheet.pageSetup.printTitlesColumn.split(':');
            ranges.push("'".concat(sheet.name, "'!$").concat(titlesColumns[0], ":$").concat(titlesColumns[1]));
          }

          if (sheet.pageSetup.printTitlesRow) {
            var titlesRows = sheet.pageSetup.printTitlesRow.split(':');
            ranges.push("'".concat(sheet.name, "'!$").concat(titlesRows[0], ":$").concat(titlesRows[1]));
          }

          var definedName = {
            name: '_xlnm.Print_Titles',
            ranges: ranges,
            localSheetId: index
          };
          printAreas.push(definedName);
        }

        index++;
      });

      if (printAreas.length) {
        model.definedNames = model.definedNames.concat(printAreas);
      }

      (model.media || []).forEach(function (medium, i) {
        // assign name
        medium.name = medium.type + (i + 1);
      });
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('workbook', WorkbookXform.WORKBOOK_ATTRIBUTES);
      this.map.fileVersion.render(xmlStream);
      this.map.workbookPr.render(xmlStream, model.properties);
      this.map.bookViews.render(xmlStream, model.views);
      this.map.sheets.render(xmlStream, model.sheets);
      this.map.definedNames.render(xmlStream, model.definedNames);
      this.map.calcPr.render(xmlStream, model.calcProperties);
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
        case 'workbook':
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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case 'workbook':
          this.model = {
            sheets: this.map.sheets.model,
            properties: this.map.workbookPr.model || {},
            views: this.map.bookViews.model,
            calcProperties: {}
          };

          if (this.map.definedNames.model) {
            this.model.definedNames = this.map.definedNames.model;
          }

          return false;

        default:
          // not quite sure how we get here!
          return true;
      }
    }
  }, {
    key: "reconcile",
    value: function reconcile(model) {
      var rels = (model.workbookRels || []).reduce(function (map, rel) {
        map[rel.Id] = rel;
        return map;
      }, {}); // reconcile sheet ids, rIds and names

      var worksheets = [];
      var worksheet;
      var index = 0;
      (model.sheets || []).forEach(function (sheet) {
        var rel = rels[sheet.rId];

        if (!rel) {
          return;
        } // if rel.Target start with `[space]/xl/` or `/xl/` , then it will be replaced with `''` and spliced behind `xl/`,
        // otherwise it will be spliced directly behind `xl/`. i.g.


        worksheet = model.worksheetHash["xl/".concat(rel.Target.replace(/^(\s|\/xl\/)+/, ''))]; // If there are "chartsheets" in the file, rel.Target will
        // come out as chartsheets/sheet1.xml or similar here, and
        // that won't be in model.worksheetHash.
        // As we don't have the infrastructure to support chartsheets,
        // we will ignore them for now:

        if (worksheet) {
          worksheet.name = sheet.name;
          worksheet.id = sheet.id;
          worksheet.state = sheet.state;
          worksheets[index++] = worksheet;
        }
      }); // reconcile print areas

      var definedNames = [];

      _.each(model.definedNames, function (definedName) {
        if (definedName.name === '_xlnm.Print_Area') {
          worksheet = worksheets[definedName.localSheetId];

          if (worksheet) {
            if (!worksheet.pageSetup) {
              worksheet.pageSetup = {};
            }

            var range = colCache.decodeEx(definedName.ranges[0]);
            worksheet.pageSetup.printArea = worksheet.pageSetup.printArea ? "".concat(worksheet.pageSetup.printArea, "&&").concat(range.dimensions) : range.dimensions;
          }
        } else if (definedName.name === '_xlnm.Print_Titles') {
          worksheet = worksheets[definedName.localSheetId];

          if (worksheet) {
            if (!worksheet.pageSetup) {
              worksheet.pageSetup = {};
            }

            var rangeString = definedName.ranges.join(',');
            var dollarRegex = /\$/g;
            var rowRangeRegex = /\$\d+:\$\d+/;
            var rowRangeMatches = rangeString.match(rowRangeRegex);

            if (rowRangeMatches && rowRangeMatches.length) {
              var _range = rowRangeMatches[0];
              worksheet.pageSetup.printTitlesRow = _range.replace(dollarRegex, '');
            }

            var columnRangeRegex = /\$[A-Z]+:\$[A-Z]+/;
            var columnRangeMatches = rangeString.match(columnRangeRegex);

            if (columnRangeMatches && columnRangeMatches.length) {
              var _range2 = columnRangeMatches[0];
              worksheet.pageSetup.printTitlesColumn = _range2.replace(dollarRegex, '');
            }
          }
        } else {
          definedNames.push(definedName);
        }
      });

      model.definedNames = definedNames; // used by sheets to build their image models

      model.media.forEach(function (media, i) {
        media.index = i;
      });
    }
  }]);

  return WorkbookXform;
}(BaseXform);

WorkbookXform.WORKBOOK_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'x15',
  'xmlns:x15': 'http://schemas.microsoft.com/office/spreadsheetml/2010/11/main'
};
WorkbookXform.STATIC_XFORMS = {
  fileVersion: new StaticXform({
    tag: 'fileVersion',
    $: {
      appName: 'xl',
      lastEdited: 5,
      lowestEdited: 5,
      rupBuild: 9303
    }
  })
};
module.exports = WorkbookXform;
//# sourceMappingURL=workbook-xform.js.map
