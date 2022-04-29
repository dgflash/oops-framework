"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('../../utils/under-dash');

var RelType = require('../../xlsx/rel-type');

var colCache = require('../../utils/col-cache');

var Encryptor = require('../../utils/encryptor');

var Dimensions = require('../../doc/range');

var StringBuf = require('../../utils/string-buf');

var Row = require('../../doc/row');

var Column = require('../../doc/column');

var SheetRelsWriter = require('./sheet-rels-writer');

var SheetCommentsWriter = require('./sheet-comments-writer');

var DataValidations = require('../../doc/data-validations');

var xmlBuffer = new StringBuf(); // ============================================================================================
// Xforms

var ListXform = require('../../xlsx/xform/list-xform');

var DataValidationsXform = require('../../xlsx/xform/sheet/data-validations-xform');

var SheetPropertiesXform = require('../../xlsx/xform/sheet/sheet-properties-xform');

var SheetFormatPropertiesXform = require('../../xlsx/xform/sheet/sheet-format-properties-xform');

var ColXform = require('../../xlsx/xform/sheet/col-xform');

var RowXform = require('../../xlsx/xform/sheet/row-xform');

var HyperlinkXform = require('../../xlsx/xform/sheet/hyperlink-xform');

var SheetViewXform = require('../../xlsx/xform/sheet/sheet-view-xform');

var SheetProtectionXform = require('../../xlsx/xform/sheet/sheet-protection-xform');

var PageMarginsXform = require('../../xlsx/xform/sheet/page-margins-xform');

var PageSetupXform = require('../../xlsx/xform/sheet/page-setup-xform');

var AutoFilterXform = require('../../xlsx/xform/sheet/auto-filter-xform');

var PictureXform = require('../../xlsx/xform/sheet/picture-xform');

var ConditionalFormattingsXform = require('../../xlsx/xform/sheet/cf/conditional-formattings-xform');

var HeaderFooterXform = require('../../xlsx/xform/sheet/header-footer-xform');

var RowBreaksXform = require('../../xlsx/xform/sheet/row-breaks-xform'); // since prepare and render are functional, we can use singletons


var xform = {
  dataValidations: new DataValidationsXform(),
  sheetProperties: new SheetPropertiesXform(),
  sheetFormatProperties: new SheetFormatPropertiesXform(),
  columns: new ListXform({
    tag: 'cols',
    length: false,
    childXform: new ColXform()
  }),
  row: new RowXform(),
  hyperlinks: new ListXform({
    tag: 'hyperlinks',
    length: false,
    childXform: new HyperlinkXform()
  }),
  sheetViews: new ListXform({
    tag: 'sheetViews',
    length: false,
    childXform: new SheetViewXform()
  }),
  sheetProtection: new SheetProtectionXform(),
  pageMargins: new PageMarginsXform(),
  pageSeteup: new PageSetupXform(),
  autoFilter: new AutoFilterXform(),
  picture: new PictureXform(),
  conditionalFormattings: new ConditionalFormattingsXform(),
  headerFooter: new HeaderFooterXform(),
  rowBreaks: new RowBreaksXform()
}; // ============================================================================================

var WorksheetWriter = /*#__PURE__*/function () {
  function WorksheetWriter(options) {
    _classCallCheck(this, WorksheetWriter);

    // in a workbook, each sheet will have a number
    this.id = options.id; // and a name

    this.name = options.name || "Sheet".concat(this.id); // add a state

    this.state = options.state || 'visible'; // rows are stored here while they need to be worked on.
    // when they are committed, they will be deleted.

    this._rows = []; // column definitions

    this._columns = null; // column keys (addRow convenience): key ==> this._columns index

    this._keys = {}; // keep a record of all row and column pageBreaks

    this._merges = [];

    this._merges.add = function () {}; // ignore cell instruction
    // keep record of all hyperlinks


    this._sheetRelsWriter = new SheetRelsWriter(options);
    this._sheetCommentsWriter = new SheetCommentsWriter(this, this._sheetRelsWriter, options); // keep a record of dimensions

    this._dimensions = new Dimensions(); // first uncommitted row

    this._rowZero = 1; // committed flag

    this.committed = false; // for data validations

    this.dataValidations = new DataValidations(); // for sharing formulae

    this._formulae = {};
    this._siFormulae = 0; // keep a record of conditionalFormattings

    this.conditionalFormatting = []; // keep a record of all row and column pageBreaks

    this.rowBreaks = []; // for default row height, outline levels, etc

    this.properties = Object.assign({}, {
      defaultRowHeight: 15,
      dyDescent: 55,
      outlineLevelCol: 0,
      outlineLevelRow: 0
    }, options.properties);
    this.headerFooter = Object.assign({}, {
      differentFirst: false,
      differentOddEven: false,
      oddHeader: null,
      oddFooter: null,
      evenHeader: null,
      evenFooter: null,
      firstHeader: null,
      firstFooter: null
    }, options.headerFooter); // for all things printing

    this.pageSetup = Object.assign({}, {
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3
      },
      orientation: 'portrait',
      horizontalDpi: 4294967295,
      verticalDpi: 4294967295,
      fitToPage: !!(options.pageSetup && (options.pageSetup.fitToWidth || options.pageSetup.fitToHeight) && !options.pageSetup.scale),
      pageOrder: 'downThenOver',
      blackAndWhite: false,
      draft: false,
      cellComments: 'None',
      errors: 'displayed',
      scale: 100,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: undefined,
      showRowColHeaders: false,
      showGridLines: false,
      horizontalCentered: false,
      verticalCentered: false,
      rowBreaks: null,
      colBreaks: null
    }, options.pageSetup); // using shared strings creates a smaller xlsx file but may use more memory

    this.useSharedStrings = options.useSharedStrings || false;
    this._workbook = options.workbook;
    this.hasComments = false; // views

    this._views = options.views || []; // auto filter

    this.autoFilter = options.autoFilter || null;
    this._media = []; // worksheet protection

    this.sheetProtection = null; // start writing to stream now

    this._writeOpenWorksheet();

    this.startedData = false;
  }

  _createClass(WorksheetWriter, [{
    key: "destroy",
    // destroy - not a valid operation for a streaming writer
    // even though some streamers might be able to, it's a bad idea.
    value: function destroy() {
      throw new Error('Invalid Operation: destroy');
    }
  }, {
    key: "commit",
    value: function commit() {
      var _this = this;

      if (this.committed) {
        return;
      } // commit all rows


      this._rows.forEach(function (cRow) {
        if (cRow) {
          // write the row to the stream
          _this._writeRow(cRow);
        }
      }); // we _cannot_ accept new rows from now on


      this._rows = null;

      if (!this.startedData) {
        this._writeOpenSheetData();
      }

      this._writeCloseSheetData();

      this._writeAutoFilter();

      this._writeMergeCells(); // for some reason, Excel can't handle dimensions at the bottom of the file
      // this._writeDimensions();


      this._writeHyperlinks();

      this._writeConditionalFormatting();

      this._writeDataValidations();

      this._writeSheetProtection();

      this._writePageMargins();

      this._writePageSetup();

      this._writeBackground();

      this._writeHeaderFooter();

      this._writeRowBreaks(); // Legacy Data tag for comments


      this._writeLegacyData();

      this._writeCloseWorksheet(); // signal end of stream to workbook


      this.stream.end();

      this._sheetCommentsWriter.commit(); // also commit the hyperlinks if any


      this._sheetRelsWriter.commit();

      this.committed = true;
    } // return the current dimensions of the writer

  }, {
    key: "getColumnKey",
    value: function getColumnKey(key) {
      return this._keys[key];
    }
  }, {
    key: "setColumnKey",
    value: function setColumnKey(key, value) {
      this._keys[key] = value;
    }
  }, {
    key: "deleteColumnKey",
    value: function deleteColumnKey(key) {
      delete this._keys[key];
    }
  }, {
    key: "eachColumnKey",
    value: function eachColumnKey(f) {
      _.each(this._keys, f);
    } // get a single column by col number. If it doesn't exist, it and any gaps before it
    // are created.

  }, {
    key: "getColumn",
    value: function getColumn(c) {
      if (typeof c === 'string') {
        // if it matches a key'd column, return that
        var col = this._keys[c];
        if (col) return col; // otherwise, assume letter

        c = colCache.l2n(c);
      }

      if (!this._columns) {
        this._columns = [];
      }

      if (c > this._columns.length) {
        var n = this._columns.length + 1;

        while (n <= c) {
          this._columns.push(new Column(this, n++));
        }
      }

      return this._columns[c - 1];
    } // =========================================================================
    // Rows

  }, {
    key: "eachRow",
    // iterate over every uncommitted row in the worksheet, including maybe empty rows
    value: function eachRow(options, iteratee) {
      if (!iteratee) {
        iteratee = options;
        options = undefined;
      }

      if (options && options.includeEmpty) {
        var n = this._nextRow;

        for (var i = this._rowZero; i < n; i++) {
          iteratee(this.getRow(i), i);
        }
      } else {
        this._rows.forEach(function (row) {
          if (row.hasValues) {
            iteratee(row, row.number);
          }
        });
      }
    }
  }, {
    key: "_commitRow",
    value: function _commitRow(cRow) {
      // since rows must be written in order, we commit all rows up till and including cRow
      var found = false;

      while (this._rows.length && !found) {
        var row = this._rows.shift();

        this._rowZero++;

        if (row) {
          this._writeRow(row);

          found = row.number === cRow.number;
          this._rowZero = row.number + 1;
        }
      }
    }
  }, {
    key: "findRow",
    // find a row (if exists) by row number
    value: function findRow(rowNumber) {
      var index = rowNumber - this._rowZero;
      return this._rows[index];
    }
  }, {
    key: "getRow",
    value: function getRow(rowNumber) {
      var index = rowNumber - this._rowZero; // may fail if rows have been comitted

      if (index < 0) {
        throw new Error('Out of bounds: this row has been committed');
      }

      var row = this._rows[index];

      if (!row) {
        this._rows[index] = row = new Row(this, rowNumber);
      }

      return row;
    }
  }, {
    key: "addRow",
    value: function addRow(value) {
      var row = new Row(this, this._nextRow);
      this._rows[row.number - this._rowZero] = row;
      row.values = value;
      return row;
    } // ================================================================================
    // Cells
    // returns the cell at [r,c] or address given by r. If not found, return undefined

  }, {
    key: "findCell",
    value: function findCell(r, c) {
      var address = colCache.getAddress(r, c);
      var row = this.findRow(address.row);
      return row ? row.findCell(address.column) : undefined;
    } // return the cell at [r,c] or address given by r. If not found, create a new one.

  }, {
    key: "getCell",
    value: function getCell(r, c) {
      var address = colCache.getAddress(r, c);
      var row = this.getRow(address.row);
      return row.getCellEx(address);
    }
  }, {
    key: "mergeCells",
    value: function mergeCells() {
      for (var _len = arguments.length, cells = new Array(_len), _key = 0; _key < _len; _key++) {
        cells[_key] = arguments[_key];
      }

      // may fail if rows have been comitted
      var dimensions = new Dimensions(cells); // check cells aren't already merged

      this._merges.forEach(function (merge) {
        if (merge.intersects(dimensions)) {
          throw new Error('Cannot merge already merged cells');
        }
      }); // apply merge


      var master = this.getCell(dimensions.top, dimensions.left);

      for (var i = dimensions.top; i <= dimensions.bottom; i++) {
        for (var j = dimensions.left; j <= dimensions.right; j++) {
          if (i > dimensions.top || j > dimensions.left) {
            this.getCell(i, j).merge(master);
          }
        }
      } // index merge


      this._merges.push(dimensions);
    } // ===========================================================================
    // Conditional Formatting

  }, {
    key: "addConditionalFormatting",
    value: function addConditionalFormatting(cf) {
      this.conditionalFormatting.push(cf);
    }
  }, {
    key: "removeConditionalFormatting",
    value: function removeConditionalFormatting(filter) {
      if (typeof filter === 'number') {
        this.conditionalFormatting.splice(filter, 1);
      } else if (filter instanceof Function) {
        this.conditionalFormatting = this.conditionalFormatting.filter(filter);
      } else {
        this.conditionalFormatting = [];
      }
    } // =========================================================================

  }, {
    key: "addBackgroundImage",
    value: function addBackgroundImage(imageId) {
      this._background = {
        imageId: imageId
      };
    }
  }, {
    key: "getBackgroundImageId",
    value: function getBackgroundImageId() {
      return this._background && this._background.imageId;
    } // =========================================================================
    // Worksheet Protection

  }, {
    key: "protect",
    value: function protect(password, options) {
      var _this2 = this;

      // TODO: make this function truly async
      // perhaps marshal to worker thread or something
      return new Promise(function (resolve) {
        _this2.sheetProtection = {
          sheet: true
        };

        if (options && 'spinCount' in options) {
          // force spinCount to be integer >= 0
          options.spinCount = Number.isFinite(options.spinCount) ? Math.round(Math.max(0, options.spinCount)) : 100000;
        }

        if (password) {
          _this2.sheetProtection.algorithmName = 'SHA-512';
          _this2.sheetProtection.saltValue = Encryptor.randomBytes(16).toString('base64');
          _this2.sheetProtection.spinCount = options && 'spinCount' in options ? options.spinCount : 100000; // allow user specified spinCount

          _this2.sheetProtection.hashValue = Encryptor.convertPasswordToHash(password, 'SHA512', _this2.sheetProtection.saltValue, _this2.sheetProtection.spinCount);
        }

        if (options) {
          _this2.sheetProtection = Object.assign(_this2.sheetProtection, options);

          if (!password && 'spinCount' in options) {
            delete _this2.sheetProtection.spinCount;
          }
        }

        resolve();
      });
    }
  }, {
    key: "unprotect",
    value: function unprotect() {
      this.sheetProtection = null;
    } // ================================================================================

  }, {
    key: "_write",
    value: function _write(text) {
      xmlBuffer.reset();
      xmlBuffer.addText(text);
      this.stream.write(xmlBuffer);
    }
  }, {
    key: "_writeSheetProperties",
    value: function _writeSheetProperties(xmlBuf, properties, pageSetup) {
      var sheetPropertiesModel = {
        outlineProperties: properties && properties.outlineProperties,
        tabColor: properties && properties.tabColor,
        pageSetup: pageSetup && pageSetup.fitToPage ? {
          fitToPage: pageSetup.fitToPage
        } : undefined
      };
      xmlBuf.addText(xform.sheetProperties.toXml(sheetPropertiesModel));
    }
  }, {
    key: "_writeSheetFormatProperties",
    value: function _writeSheetFormatProperties(xmlBuf, properties) {
      var sheetFormatPropertiesModel = properties ? {
        defaultRowHeight: properties.defaultRowHeight,
        dyDescent: properties.dyDescent,
        outlineLevelCol: properties.outlineLevelCol,
        outlineLevelRow: properties.outlineLevelRow
      } : undefined;

      if (properties.defaultColWidth) {
        sheetFormatPropertiesModel.defaultColWidth = properties.defaultColWidth;
      }

      xmlBuf.addText(xform.sheetFormatProperties.toXml(sheetFormatPropertiesModel));
    }
  }, {
    key: "_writeOpenWorksheet",
    value: function _writeOpenWorksheet() {
      xmlBuffer.reset();
      xmlBuffer.addText('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
      xmlBuffer.addText('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' + ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"' + ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"' + ' mc:Ignorable="x14ac"' + ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">');

      this._writeSheetProperties(xmlBuffer, this.properties, this.pageSetup);

      xmlBuffer.addText(xform.sheetViews.toXml(this.views));

      this._writeSheetFormatProperties(xmlBuffer, this.properties);

      this.stream.write(xmlBuffer);
    }
  }, {
    key: "_writeColumns",
    value: function _writeColumns() {
      var cols = Column.toModel(this.columns);

      if (cols) {
        xform.columns.prepare(cols, {
          styles: this._workbook.styles
        });
        this.stream.write(xform.columns.toXml(cols));
      }
    }
  }, {
    key: "_writeOpenSheetData",
    value: function _writeOpenSheetData() {
      this._write('<sheetData>');
    }
  }, {
    key: "_writeRow",
    value: function _writeRow(row) {
      if (!this.startedData) {
        this._writeColumns();

        this._writeOpenSheetData();

        this.startedData = true;
      }

      if (row.hasValues || row.height) {
        var model = row.model;
        var options = {
          styles: this._workbook.styles,
          sharedStrings: this.useSharedStrings ? this._workbook.sharedStrings : undefined,
          hyperlinks: this._sheetRelsWriter.hyperlinksProxy,
          merges: this._merges,
          formulae: this._formulae,
          siFormulae: this._siFormulae,
          comments: []
        };
        xform.row.prepare(model, options);
        this.stream.write(xform.row.toXml(model));

        if (options.comments.length) {
          this.hasComments = true;

          this._sheetCommentsWriter.addComments(options.comments);
        }
      }
    }
  }, {
    key: "_writeCloseSheetData",
    value: function _writeCloseSheetData() {
      this._write('</sheetData>');
    }
  }, {
    key: "_writeMergeCells",
    value: function _writeMergeCells() {
      if (this._merges.length) {
        xmlBuffer.reset();
        xmlBuffer.addText("<mergeCells count=\"".concat(this._merges.length, "\">"));

        this._merges.forEach(function (merge) {
          xmlBuffer.addText("<mergeCell ref=\"".concat(merge, "\"/>"));
        });

        xmlBuffer.addText('</mergeCells>');
        this.stream.write(xmlBuffer);
      }
    }
  }, {
    key: "_writeHyperlinks",
    value: function _writeHyperlinks() {
      // eslint-disable-next-line no-underscore-dangle
      this.stream.write(xform.hyperlinks.toXml(this._sheetRelsWriter._hyperlinks));
    }
  }, {
    key: "_writeConditionalFormatting",
    value: function _writeConditionalFormatting() {
      var options = {
        styles: this._workbook.styles
      };
      xform.conditionalFormattings.prepare(this.conditionalFormatting, options);
      this.stream.write(xform.conditionalFormattings.toXml(this.conditionalFormatting));
    }
  }, {
    key: "_writeRowBreaks",
    value: function _writeRowBreaks() {
      this.stream.write(xform.rowBreaks.toXml(this.rowBreaks));
    }
  }, {
    key: "_writeDataValidations",
    value: function _writeDataValidations() {
      this.stream.write(xform.dataValidations.toXml(this.dataValidations.model));
    }
  }, {
    key: "_writeSheetProtection",
    value: function _writeSheetProtection() {
      this.stream.write(xform.sheetProtection.toXml(this.sheetProtection));
    }
  }, {
    key: "_writePageMargins",
    value: function _writePageMargins() {
      this.stream.write(xform.pageMargins.toXml(this.pageSetup.margins));
    }
  }, {
    key: "_writePageSetup",
    value: function _writePageSetup() {
      this.stream.write(xform.pageSeteup.toXml(this.pageSetup));
    }
  }, {
    key: "_writeHeaderFooter",
    value: function _writeHeaderFooter() {
      this.stream.write(xform.headerFooter.toXml(this.headerFooter));
    }
  }, {
    key: "_writeAutoFilter",
    value: function _writeAutoFilter() {
      this.stream.write(xform.autoFilter.toXml(this.autoFilter));
    }
  }, {
    key: "_writeBackground",
    value: function _writeBackground() {
      if (this._background) {
        if (this._background.imageId !== undefined) {
          var image = this._workbook.getImage(this._background.imageId);

          var pictureId = this._sheetRelsWriter.addMedia({
            Target: "../media/".concat(image.name),
            Type: RelType.Image
          });

          this._background = _objectSpread(_objectSpread({}, this._background), {}, {
            rId: pictureId
          });
        }

        this.stream.write(xform.picture.toXml({
          rId: this._background.rId
        }));
      }
    }
  }, {
    key: "_writeLegacyData",
    value: function _writeLegacyData() {
      if (this.hasComments) {
        xmlBuffer.reset();
        xmlBuffer.addText("<legacyDrawing r:id=\"".concat(this._sheetCommentsWriter.vmlRelId, "\"/>"));
        this.stream.write(xmlBuffer);
      }
    }
  }, {
    key: "_writeDimensions",
    value: function _writeDimensions() {// for some reason, Excel can't handle dimensions at the bottom of the file
      // and we don't know the dimensions until the commit, so don't write them.
      // this._write('<dimension ref="' + this._dimensions + '"/>');
    }
  }, {
    key: "_writeCloseWorksheet",
    value: function _writeCloseWorksheet() {
      this._write('</worksheet>');
    }
  }, {
    key: "workbook",
    get: function get() {
      return this._workbook;
    }
  }, {
    key: "stream",
    get: function get() {
      if (!this._stream) {
        // eslint-disable-next-line no-underscore-dangle
        this._stream = this._workbook._openStream("/xl/worksheets/sheet".concat(this.id, ".xml")); // pause stream to prevent 'data' events

        this._stream.pause();
      }

      return this._stream;
    }
  }, {
    key: "dimensions",
    get: function get() {
      return this._dimensions;
    }
  }, {
    key: "views",
    get: function get() {
      return this._views;
    } // =========================================================================
    // Columns
    // get the current columns array.

  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    } // set the columns from an array of column definitions.
    // Note: any headers defined will overwrite existing values.
    ,
    set: function set(value) {
      var _this3 = this;

      // calculate max header row count
      this._headerRowCount = value.reduce(function (pv, cv) {
        var headerCount = cv.header && 1 || cv.headers && cv.headers.length || 0;
        return Math.max(pv, headerCount);
      }, 0); // construct Column objects

      var count = 1;
      var columns = this._columns = [];
      value.forEach(function (defn) {
        var column = new Column(_this3, count++, false);
        columns.push(column);
        column.defn = defn;
      });
    }
  }, {
    key: "_nextRow",
    get: function get() {
      return this._rowZero + this._rows.length;
    }
  }, {
    key: "lastRow",
    get: function get() {
      // returns last uncommitted row
      if (this._rows.length) {
        return this._rows[this._rows.length - 1];
      }

      return undefined;
    }
  }]);

  return WorksheetWriter;
}();

module.exports = WorksheetWriter;
//# sourceMappingURL=worksheet-writer.js.map
