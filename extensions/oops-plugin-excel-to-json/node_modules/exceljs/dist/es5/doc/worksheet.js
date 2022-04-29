"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('../utils/under-dash');

var colCache = require('../utils/col-cache');

var Range = require('./range');

var Row = require('./row');

var Column = require('./column');

var Enums = require('./enums');

var Image = require('./image');

var Table = require('./table');

var DataValidations = require('./data-validations');

var Encryptor = require('../utils/encryptor'); // Worksheet requirements
//  Operate as sheet inside workbook or standalone
//  Load and Save from file and stream
//  Access/Add/Delete individual cells
//  Manage column widths and row heights


var Worksheet = /*#__PURE__*/function () {
  function Worksheet(options) {
    _classCallCheck(this, Worksheet);

    options = options || {}; // in a workbook, each sheet will have a number

    this.id = options.id;
    this.orderNo = options.orderNo; // and a name

    this.name = options.name || "Sheet".concat(this.id); // add a state

    this.state = options.state || 'visible'; // rows allows access organised by row. Sparse array of arrays indexed by row-1, col
    // Note: _rows is zero based. Must subtract 1 to go from cell.row to index

    this._rows = []; // column definitions

    this._columns = null; // column keys (addRow convenience): key ==> this._collumns index

    this._keys = {}; // keep record of all merges

    this._merges = {}; // record of all row and column pageBreaks

    this.rowBreaks = [];
    this._workbook = options.workbook; // for tabColor, default row height, outline levels, etc

    this.properties = Object.assign({}, {
      defaultRowHeight: 15,
      dyDescent: 55,
      outlineLevelCol: 0,
      outlineLevelRow: 0
    }, options.properties); // for all things printing

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
      firstPageNumber: undefined,
      horizontalCentered: false,
      verticalCentered: false,
      rowBreaks: null,
      colBreaks: null
    }, options.pageSetup);
    this.headerFooter = Object.assign({}, {
      differentFirst: false,
      differentOddEven: false,
      oddHeader: null,
      oddFooter: null,
      evenHeader: null,
      evenFooter: null,
      firstHeader: null,
      firstFooter: null
    }, options.headerFooter);
    this.dataValidations = new DataValidations(); // for freezepanes, split, zoom, gridlines, etc

    this.views = options.views || [];
    this.autoFilter = options.autoFilter || null; // for images, etc

    this._media = []; // worksheet protection

    this.sheetProtection = null; // for tables

    this.tables = {};
    this.conditionalFormattings = [];
  }

  _createClass(Worksheet, [{
    key: "destroy",
    // when you're done with this worksheet, call this to remove from workbook
    value: function destroy() {
      this._workbook.removeWorksheetEx(this);
    } // Get the bounding range of the cells in this worksheet

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
    } // get a single column by col number. If it doesn't exist, create it and any gaps before it

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
    }
  }, {
    key: "spliceColumns",
    value: function spliceColumns(start, count) {
      var _this = this;

      var rows = this._rows;
      var nRows = rows.length;

      for (var _len = arguments.length, inserts = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        inserts[_key - 2] = arguments[_key];
      }

      if (inserts.length > 0) {
        var _loop = function _loop(i) {
          var rowArguments = [start, count]; // eslint-disable-next-line no-loop-func

          inserts.forEach(function (insert) {
            rowArguments.push(insert[i] || null);
          });

          var row = _this.getRow(i + 1); // eslint-disable-next-line prefer-spread


          row.splice.apply(row, rowArguments);
        };

        // must iterate over all rows whether they exist yet or not
        for (var i = 0; i < nRows; i++) {
          _loop(i);
        }
      } else {
        // nothing to insert, so just splice all rows
        this._rows.forEach(function (r) {
          if (r) {
            r.splice(start, count);
          }
        });
      } // splice column definitions


      var nExpand = inserts.length - count;
      var nKeep = start + count;
      var nEnd = this._columns.length;

      if (nExpand < 0) {
        for (var _i = start + inserts.length; _i <= nEnd; _i++) {
          this.getColumn(_i).defn = this.getColumn(_i - nExpand).defn;
        }
      } else if (nExpand > 0) {
        for (var _i2 = nEnd; _i2 >= nKeep; _i2--) {
          this.getColumn(_i2 + nExpand).defn = this.getColumn(_i2).defn;
        }
      }

      for (var _i3 = start; _i3 < start + inserts.length; _i3++) {
        this.getColumn(_i3).defn = null;
      } // account for defined names


      this.workbook.definedNames.spliceColumns(this.name, start, count, inserts.length);
    }
  }, {
    key: "_commitRow",
    // =========================================================================
    // Rows
    value: function _commitRow() {// nop - allows streaming reader to fill a document
    }
  }, {
    key: "findRow",
    // find a row (if exists) by row number
    value: function findRow(r) {
      return this._rows[r - 1];
    } // find multiple rows (if exists) by row number

  }, {
    key: "findRows",
    value: function findRows(start, length) {
      return this._rows.slice(start - 1, start - 1 + length);
    }
  }, {
    key: "getRow",
    // get a row by row number.
    value: function getRow(r) {
      var row = this._rows[r - 1];

      if (!row) {
        row = this._rows[r - 1] = new Row(this, r);
      }

      return row;
    } // get multiple rows by row number.

  }, {
    key: "getRows",
    value: function getRows(start, length) {
      if (length < 1) return undefined;
      var rows = [];

      for (var i = start; i < start + length; i++) {
        rows.push(this.getRow(i));
      }

      return rows;
    }
  }, {
    key: "addRow",
    value: function addRow(value) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'n';
      var rowNo = this._nextRow;
      var row = this.getRow(rowNo);
      row.values = value;

      this._setStyleOption(rowNo, style[0] === 'i' ? style : 'n');

      return row;
    }
  }, {
    key: "addRows",
    value: function addRows(value) {
      var _this2 = this;

      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'n';
      var rows = [];
      value.forEach(function (row) {
        rows.push(_this2.addRow(row, style));
      });
      return rows;
    }
  }, {
    key: "insertRow",
    value: function insertRow(pos, value) {
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'n';
      this.spliceRows(pos, 0, value);

      this._setStyleOption(pos, style);

      return this.getRow(pos);
    }
  }, {
    key: "insertRows",
    value: function insertRows(pos, values) {
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'n';
      this.spliceRows.apply(this, [pos, 0].concat(_toConsumableArray(values)));

      if (style !== 'n') {
        // copy over the styles
        for (var i = 0; i < values.length; i++) {
          if (style[0] === 'o' && this.findRow(values.length + pos + i) !== undefined) {
            this._copyStyle(values.length + pos + i, pos + i, style[1] === '+');
          } else if (style[0] === 'i' && this.findRow(pos - 1) !== undefined) {
            this._copyStyle(pos - 1, pos + i, style[1] === '+');
          }
        }
      }

      return this.getRows(pos, values.length);
    } // set row at position to same style as of either pervious row (option 'i') or next row (option 'o')

  }, {
    key: "_setStyleOption",
    value: function _setStyleOption(pos) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'n';

      if (style[0] === 'o' && this.findRow(pos + 1) !== undefined) {
        this._copyStyle(pos + 1, pos, style[1] === '+');
      } else if (style[0] === 'i' && this.findRow(pos - 1) !== undefined) {
        this._copyStyle(pos - 1, pos, style[1] === '+');
      }
    }
  }, {
    key: "_copyStyle",
    value: function _copyStyle(src, dest) {
      var styleEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var rSrc = this.getRow(src);
      var rDst = this.getRow(dest);
      rDst.style = Object.freeze(_objectSpread({}, rSrc.style)); // eslint-disable-next-line no-loop-func

      rSrc.eachCell({
        includeEmpty: styleEmpty
      }, function (cell, colNumber) {
        rDst.getCell(colNumber).style = Object.freeze(_objectSpread({}, cell.style));
      });
      rDst.height = rSrc.height;
    }
  }, {
    key: "duplicateRow",
    value: function duplicateRow(rowNum, count) {
      var _this3 = this;

      var insert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // create count duplicates of rowNum
      // either inserting new or overwriting existing rows
      var rSrc = this._rows[rowNum - 1];
      var inserts = new Array(count).fill(rSrc.values);
      this.spliceRows.apply(this, [rowNum + 1, insert ? 0 : count].concat(_toConsumableArray(inserts))); // now copy styles...

      var _loop2 = function _loop2(i) {
        var rDst = _this3._rows[rowNum + i];
        rDst.style = rSrc.style;
        rDst.height = rSrc.height; // eslint-disable-next-line no-loop-func

        rSrc.eachCell({
          includeEmpty: true
        }, function (cell, colNumber) {
          rDst.getCell(colNumber).style = cell.style;
        });
      };

      for (var i = 0; i < count; i++) {
        _loop2(i);
      }
    }
  }, {
    key: "spliceRows",
    value: function spliceRows(start, count) {
      var _this4 = this;

      // same problem as row.splice, except worse.
      var nKeep = start + count;

      for (var _len2 = arguments.length, inserts = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        inserts[_key2 - 2] = arguments[_key2];
      }

      var nInserts = inserts.length;
      var nExpand = nInserts - count;
      var nEnd = this._rows.length;
      var i;
      var rSrc;

      if (nExpand < 0) {
        // remove rows
        for (i = nKeep; i <= nEnd; i++) {
          rSrc = this._rows[i - 1];

          if (rSrc) {
            (function () {
              var rDst = _this4.getRow(i + nExpand);

              rDst.values = rSrc.values;
              rDst.style = rSrc.style;
              rDst.height = rSrc.height; // eslint-disable-next-line no-loop-func

              rSrc.eachCell({
                includeEmpty: true
              }, function (cell, colNumber) {
                rDst.getCell(colNumber).style = cell.style;
              });
              _this4._rows[i - 1] = undefined;
            })();
          } else {
            this._rows[i + nExpand - 1] = undefined;
          }
        }
      } else if (nExpand > 0) {
        // insert new cells
        for (i = nEnd; i >= nKeep; i--) {
          rSrc = this._rows[i - 1];

          if (rSrc) {
            (function () {
              var rDst = _this4.getRow(i + nExpand);

              rDst.values = rSrc.values;
              rDst.style = rSrc.style;
              rDst.height = rSrc.height; // eslint-disable-next-line no-loop-func

              rSrc.eachCell({
                includeEmpty: true
              }, function (cell, colNumber) {
                rDst.getCell(colNumber).style = cell.style; // remerge cells accounting for insert offset

                if (cell._value.constructor.name === 'MergeValue') {
                  var cellToBeMerged = _this4.getRow(cell._row._number + nInserts).getCell(colNumber);

                  var prevMaster = cell._value._master;

                  var newMaster = _this4.getRow(prevMaster._row._number + nInserts).getCell(prevMaster._column._number);

                  cellToBeMerged.merge(newMaster);
                }
              });
            })();
          } else {
            this._rows[i + nExpand - 1] = undefined;
          }
        }
      } // now copy over the new values


      for (i = 0; i < nInserts; i++) {
        var rDst = this.getRow(start + i);
        rDst.style = {};
        rDst.values = inserts[i];
      } // account for defined names


      this.workbook.definedNames.spliceRows(this.name, start, count, nInserts);
    } // iterate over every row in the worksheet, including maybe empty rows

  }, {
    key: "eachRow",
    value: function eachRow(options, iteratee) {
      if (!iteratee) {
        iteratee = options;
        options = undefined;
      }

      if (options && options.includeEmpty) {
        var n = this._rows.length;

        for (var i = 1; i <= n; i++) {
          iteratee(this.getRow(i), i);
        }
      } else {
        this._rows.forEach(function (row) {
          if (row && row.hasValues) {
            iteratee(row, row.number);
          }
        });
      }
    } // return all rows as sparse array

  }, {
    key: "getSheetValues",
    value: function getSheetValues() {
      var rows = [];

      this._rows.forEach(function (row) {
        if (row) {
          rows[row.number] = row.values;
        }
      });

      return rows;
    } // =========================================================================
    // Cells
    // returns the cell at [r,c] or address given by r. If not found, return undefined

  }, {
    key: "findCell",
    value: function findCell(r, c) {
      var address = colCache.getAddress(r, c);
      var row = this._rows[address.row - 1];
      return row ? row.findCell(address.col) : undefined;
    } // return the cell at [r,c] or address given by r. If not found, create a new one.

  }, {
    key: "getCell",
    value: function getCell(r, c) {
      var address = colCache.getAddress(r, c);
      var row = this.getRow(address.row);
      return row.getCellEx(address);
    } // =========================================================================
    // Merge
    // convert the range defined by ['tl:br'], [tl,br] or [t,l,b,r] into a single 'merged' cell

  }, {
    key: "mergeCells",
    value: function mergeCells() {
      for (var _len3 = arguments.length, cells = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        cells[_key3] = arguments[_key3];
      }

      var dimensions = new Range(cells);

      this._mergeCellsInternal(dimensions);
    }
  }, {
    key: "mergeCellsWithoutStyle",
    value: function mergeCellsWithoutStyle() {
      for (var _len4 = arguments.length, cells = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        cells[_key4] = arguments[_key4];
      }

      var dimensions = new Range(cells);

      this._mergeCellsInternal(dimensions, true);
    }
  }, {
    key: "_mergeCellsInternal",
    value: function _mergeCellsInternal(dimensions, ignoreStyle) {
      // check cells aren't already merged
      _.each(this._merges, function (merge) {
        if (merge.intersects(dimensions)) {
          throw new Error('Cannot merge already merged cells');
        }
      }); // apply merge


      var master = this.getCell(dimensions.top, dimensions.left);

      for (var i = dimensions.top; i <= dimensions.bottom; i++) {
        for (var j = dimensions.left; j <= dimensions.right; j++) {
          // merge all but the master cell
          if (i > dimensions.top || j > dimensions.left) {
            this.getCell(i, j).merge(master, ignoreStyle);
          }
        }
      } // index merge


      this._merges[master.address] = dimensions;
    }
  }, {
    key: "_unMergeMaster",
    value: function _unMergeMaster(master) {
      // master is always top left of a rectangle
      var merge = this._merges[master.address];

      if (merge) {
        for (var i = merge.top; i <= merge.bottom; i++) {
          for (var j = merge.left; j <= merge.right; j++) {
            this.getCell(i, j).unmerge();
          }
        }

        delete this._merges[master.address];
      }
    }
  }, {
    key: "unMergeCells",
    // scan the range defined by ['tl:br'], [tl,br] or [t,l,b,r] and if any cell is part of a merge,
    // un-merge the group. Note this function can affect multiple merges and merge-blocks are
    // atomic - either they're all merged or all un-merged.
    value: function unMergeCells() {
      for (var _len5 = arguments.length, cells = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        cells[_key5] = arguments[_key5];
      }

      var dimensions = new Range(cells); // find any cells in that range and unmerge them

      for (var i = dimensions.top; i <= dimensions.bottom; i++) {
        for (var j = dimensions.left; j <= dimensions.right; j++) {
          var cell = this.findCell(i, j);

          if (cell) {
            if (cell.type === Enums.ValueType.Merge) {
              // this cell merges to another master
              this._unMergeMaster(cell.master);
            } else if (this._merges[cell.address]) {
              // this cell is a master
              this._unMergeMaster(cell);
            }
          }
        }
      }
    } // ===========================================================================
    // Shared/Array Formula

  }, {
    key: "fillFormula",
    value: function fillFormula(range, formula, results) {
      var shareType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'shared';
      // Define formula for top-left cell and share to rest
      var decoded = colCache.decode(range);
      var top = decoded.top,
          left = decoded.left,
          bottom = decoded.bottom,
          right = decoded.right;
      var width = right - left + 1;
      var masterAddress = colCache.encodeAddress(top, left);
      var isShared = shareType === 'shared'; // work out result accessor

      var getResult;

      if (typeof results === 'function') {
        getResult = results;
      } else if (Array.isArray(results)) {
        if (Array.isArray(results[0])) {
          getResult = function getResult(row, col) {
            return results[row - top][col - left];
          };
        } else {
          // eslint-disable-next-line no-mixed-operators
          getResult = function getResult(row, col) {
            return results[(row - top) * width + (col - left)];
          };
        }
      } else {
        getResult = function getResult() {
          return undefined;
        };
      }

      var first = true;

      for (var r = top; r <= bottom; r++) {
        for (var c = left; c <= right; c++) {
          if (first) {
            this.getCell(r, c).value = {
              shareType: shareType,
              formula: formula,
              ref: range,
              result: getResult(r, c)
            };
            first = false;
          } else {
            this.getCell(r, c).value = isShared ? {
              sharedFormula: masterAddress,
              result: getResult(r, c)
            } : getResult(r, c);
          }
        }
      }
    } // =========================================================================
    // Images

  }, {
    key: "addImage",
    value: function addImage(imageId, range) {
      var model = {
        type: 'image',
        imageId: imageId,
        range: range
      };

      this._media.push(new Image(this, model));
    }
  }, {
    key: "getImages",
    value: function getImages() {
      return this._media.filter(function (m) {
        return m.type === 'image';
      });
    }
  }, {
    key: "addBackgroundImage",
    value: function addBackgroundImage(imageId) {
      var model = {
        type: 'background',
        imageId: imageId
      };

      this._media.push(new Image(this, model));
    }
  }, {
    key: "getBackgroundImageId",
    value: function getBackgroundImageId() {
      var image = this._media.find(function (m) {
        return m.type === 'background';
      });

      return image && image.imageId;
    } // =========================================================================
    // Worksheet Protection

  }, {
    key: "protect",
    value: function protect(password, options) {
      var _this5 = this;

      // TODO: make this function truly async
      // perhaps marshal to worker thread or something
      return new Promise(function (resolve) {
        _this5.sheetProtection = {
          sheet: true
        };

        if (options && 'spinCount' in options) {
          // force spinCount to be integer >= 0
          options.spinCount = Number.isFinite(options.spinCount) ? Math.round(Math.max(0, options.spinCount)) : 100000;
        }

        if (password) {
          _this5.sheetProtection.algorithmName = 'SHA-512';
          _this5.sheetProtection.saltValue = Encryptor.randomBytes(16).toString('base64');
          _this5.sheetProtection.spinCount = options && 'spinCount' in options ? options.spinCount : 100000; // allow user specified spinCount

          _this5.sheetProtection.hashValue = Encryptor.convertPasswordToHash(password, 'SHA512', _this5.sheetProtection.saltValue, _this5.sheetProtection.spinCount);
        }

        if (options) {
          _this5.sheetProtection = Object.assign(_this5.sheetProtection, options);

          if (!password && 'spinCount' in options) {
            delete _this5.sheetProtection.spinCount;
          }
        }

        resolve();
      });
    }
  }, {
    key: "unprotect",
    value: function unprotect() {
      this.sheetProtection = null;
    } // =========================================================================
    // Tables

  }, {
    key: "addTable",
    value: function addTable(model) {
      var table = new Table(this, model);
      this.tables[model.name] = table;
      return table;
    }
  }, {
    key: "getTable",
    value: function getTable(name) {
      return this.tables[name];
    }
  }, {
    key: "removeTable",
    value: function removeTable(name) {
      delete this.tables[name];
    }
  }, {
    key: "getTables",
    value: function getTables() {
      return Object.values(this.tables);
    } // ===========================================================================
    // Conditional Formatting

  }, {
    key: "addConditionalFormatting",
    value: function addConditionalFormatting(cf) {
      this.conditionalFormattings.push(cf);
    }
  }, {
    key: "removeConditionalFormatting",
    value: function removeConditionalFormatting(filter) {
      if (typeof filter === 'number') {
        this.conditionalFormattings.splice(filter, 1);
      } else if (filter instanceof Function) {
        this.conditionalFormattings = this.conditionalFormattings.filter(filter);
      } else {
        this.conditionalFormattings = [];
      }
    } // ===========================================================================
    // Deprecated

  }, {
    key: "_parseRows",
    value: function _parseRows(model) {
      var _this6 = this;

      this._rows = [];
      model.rows.forEach(function (rowModel) {
        var row = new Row(_this6, rowModel.number);
        _this6._rows[row.number - 1] = row;
        row.model = rowModel;
      });
    }
  }, {
    key: "_parseMergeCells",
    value: function _parseMergeCells(model) {
      var _this7 = this;

      _.each(model.mergeCells, function (merge) {
        // Do not merge styles when importing an Excel file
        // since each cell may have different styles intentionally.
        _this7.mergeCellsWithoutStyle(merge);
      });
    }
  }, {
    key: "workbook",
    get: function get() {
      return this._workbook;
    }
  }, {
    key: "dimensions",
    get: function get() {
      var dimensions = new Range();

      this._rows.forEach(function (row) {
        if (row) {
          var rowDims = row.dimensions;

          if (rowDims) {
            dimensions.expand(row.number, rowDims.min, row.number, rowDims.max);
          }
        }
      });

      return dimensions;
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
      var _this8 = this;

      // calculate max header row count
      this._headerRowCount = value.reduce(function (pv, cv) {
        var headerCount = cv.header && 1 || cv.headers && cv.headers.length || 0;
        return Math.max(pv, headerCount);
      }, 0); // construct Column objects

      var count = 1;
      var columns = this._columns = [];
      value.forEach(function (defn) {
        var column = new Column(_this8, count++, false);
        columns.push(column);
        column.defn = defn;
      });
    }
  }, {
    key: "lastColumn",
    get: function get() {
      return this.getColumn(this.columnCount);
    }
  }, {
    key: "columnCount",
    get: function get() {
      var maxCount = 0;
      this.eachRow(function (row) {
        maxCount = Math.max(maxCount, row.cellCount);
      });
      return maxCount;
    }
  }, {
    key: "actualColumnCount",
    get: function get() {
      // performance nightmare - for each row, counts all the columns used
      var counts = [];
      var count = 0;
      this.eachRow(function (row) {
        row.eachCell(function (_ref) {
          var col = _ref.col;

          if (!counts[col]) {
            counts[col] = true;
            count++;
          }
        });
      });
      return count;
    }
  }, {
    key: "_lastRowNumber",
    get: function get() {
      // need to cope with results of splice
      var rows = this._rows;
      var n = rows.length;

      while (n > 0 && rows[n - 1] === undefined) {
        n--;
      }

      return n;
    }
  }, {
    key: "_nextRow",
    get: function get() {
      return this._lastRowNumber + 1;
    }
  }, {
    key: "lastRow",
    get: function get() {
      if (this._rows.length) {
        return this._rows[this._rows.length - 1];
      }

      return undefined;
    }
  }, {
    key: "rowCount",
    get: function get() {
      return this._lastRowNumber;
    }
  }, {
    key: "actualRowCount",
    get: function get() {
      // counts actual rows that have actual data
      var count = 0;
      this.eachRow(function () {
        count++;
      });
      return count;
    }
  }, {
    key: "hasMerges",
    get: function get() {
      // return true if this._merges has a merge object
      return _.some(this._merges, Boolean);
    }
  }, {
    key: "tabColor",
    get: function get() {
      // eslint-disable-next-line no-console
      console.trace('worksheet.tabColor property is now deprecated. Please use worksheet.properties.tabColor');
      return this.properties.tabColor;
    },
    set: function set(value) {
      // eslint-disable-next-line no-console
      console.trace('worksheet.tabColor property is now deprecated. Please use worksheet.properties.tabColor');
      this.properties.tabColor = value;
    } // ===========================================================================
    // Model

  }, {
    key: "model",
    get: function get() {
      var model = {
        id: this.id,
        name: this.name,
        dataValidations: this.dataValidations.model,
        properties: this.properties,
        state: this.state,
        pageSetup: this.pageSetup,
        headerFooter: this.headerFooter,
        rowBreaks: this.rowBreaks,
        views: this.views,
        autoFilter: this.autoFilter,
        media: this._media.map(function (medium) {
          return medium.model;
        }),
        sheetProtection: this.sheetProtection,
        tables: Object.values(this.tables).map(function (table) {
          return table.model;
        }),
        conditionalFormattings: this.conditionalFormattings
      }; // =================================================
      // columns

      model.cols = Column.toModel(this.columns); // ==========================================================
      // Rows

      var rows = model.rows = [];
      var dimensions = model.dimensions = new Range();

      this._rows.forEach(function (row) {
        var rowModel = row && row.model;

        if (rowModel) {
          dimensions.expand(rowModel.number, rowModel.min, rowModel.number, rowModel.max);
          rows.push(rowModel);
        }
      }); // ==========================================================
      // Merges


      model.merges = [];

      _.each(this._merges, function (merge) {
        model.merges.push(merge.range);
      });

      return model;
    },
    set: function set(value) {
      var _this9 = this;

      this.name = value.name;
      this._columns = Column.fromModel(this, value.cols);

      this._parseRows(value);

      this._parseMergeCells(value);

      this.dataValidations = new DataValidations(value.dataValidations);
      this.properties = value.properties;
      this.pageSetup = value.pageSetup;
      this.headerFooter = value.headerFooter;
      this.views = value.views;
      this.autoFilter = value.autoFilter;
      this._media = value.media.map(function (medium) {
        return new Image(_this9, medium);
      });
      this.sheetProtection = value.sheetProtection;
      this.tables = value.tables.reduce(function (tables, table) {
        var t = new Table();
        t.model = table;
        tables[table.name] = t;
        return tables;
      }, {});
      this.conditionalFormattings = value.conditionalFormattings;
    }
  }]);

  return Worksheet;
}();

module.exports = Worksheet;
//# sourceMappingURL=worksheet.js.map
