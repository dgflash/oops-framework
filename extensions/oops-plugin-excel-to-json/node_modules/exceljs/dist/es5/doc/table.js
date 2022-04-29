"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable max-classes-per-file */
var colCache = require('../utils/col-cache');

var Column = /*#__PURE__*/function () {
  // wrapper around column model, allowing access and manipulation
  function Column(table, column, index) {
    _classCallCheck(this, Column);

    this.table = table;
    this.column = column;
    this.index = index;
  }

  _createClass(Column, [{
    key: "_set",
    value: function _set(name, value) {
      this.table.cacheState();
      this.column[name] = value;
    }
    /* eslint-disable lines-between-class-members */

  }, {
    key: "name",
    get: function get() {
      return this.column.name;
    },
    set: function set(value) {
      this._set('name', value);
    }
  }, {
    key: "filterButton",
    get: function get() {
      return this.column.filterButton;
    },
    set: function set(value) {
      this.column.filterButton = value;
    }
  }, {
    key: "style",
    get: function get() {
      return this.column.style;
    },
    set: function set(value) {
      this.column.style = value;
    }
  }, {
    key: "totalsRowLabel",
    get: function get() {
      return this.column.totalsRowLabel;
    },
    set: function set(value) {
      this._set('totalsRowLabel', value);
    }
  }, {
    key: "totalsRowFunction",
    get: function get() {
      return this.column.totalsRowFunction;
    },
    set: function set(value) {
      this._set('totalsRowFunction', value);
    }
  }, {
    key: "totalsRowResult",
    get: function get() {
      return this.column.totalsRowResult;
    },
    set: function set(value) {
      this._set('totalsRowResult', value);
    }
  }, {
    key: "totalsRowFormula",
    get: function get() {
      return this.column.totalsRowFormula;
    },
    set: function set(value) {
      this._set('totalsRowFormula', value);
    }
    /* eslint-enable lines-between-class-members */

  }]);

  return Column;
}();

var Table = /*#__PURE__*/function () {
  function Table(worksheet, table) {
    _classCallCheck(this, Table);

    this.worksheet = worksheet;

    if (table) {
      this.table = table; // check things are ok first

      this.validate();
      this.store();
    }
  }

  _createClass(Table, [{
    key: "getFormula",
    value: function getFormula(column) {
      // get the correct formula to apply to the totals row
      switch (column.totalsRowFunction) {
        case 'none':
          return null;

        case 'average':
          return "SUBTOTAL(101,".concat(this.table.name, "[").concat(column.name, "])");

        case 'countNums':
          return "SUBTOTAL(102,".concat(this.table.name, "[").concat(column.name, "])");

        case 'count':
          return "SUBTOTAL(103,".concat(this.table.name, "[").concat(column.name, "])");

        case 'max':
          return "SUBTOTAL(104,".concat(this.table.name, "[").concat(column.name, "])");

        case 'min':
          return "SUBTOTAL(105,".concat(this.table.name, "[").concat(column.name, "])");

        case 'stdDev':
          return "SUBTOTAL(106,".concat(this.table.name, "[").concat(column.name, "])");

        case 'var':
          return "SUBTOTAL(107,".concat(this.table.name, "[").concat(column.name, "])");

        case 'sum':
          return "SUBTOTAL(109,".concat(this.table.name, "[").concat(column.name, "])");

        case 'custom':
          return column.totalsRowFormula;

        default:
          throw new Error("Invalid Totals Row Function: ".concat(column.totalsRowFunction));
      }
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this = this;

      var table = this.table; // set defaults and check is valid

      var assign = function assign(o, name, dflt) {
        if (o[name] === undefined) {
          o[name] = dflt;
        }
      };

      assign(table, 'headerRow', true);
      assign(table, 'totalsRow', false);
      assign(table, 'style', {});
      assign(table.style, 'theme', 'TableStyleMedium2');
      assign(table.style, 'showFirstColumn', false);
      assign(table.style, 'showLastColumn', false);
      assign(table.style, 'showRowStripes', false);
      assign(table.style, 'showColumnStripes', false);

      var assert = function assert(test, message) {
        if (!test) {
          throw new Error(message);
        }
      };

      assert(table.ref, 'Table must have ref');
      assert(table.columns, 'Table must have column definitions');
      assert(table.rows, 'Table must have row definitions');
      table.tl = colCache.decodeAddress(table.ref);
      var _table$tl = table.tl,
          row = _table$tl.row,
          col = _table$tl.col;
      assert(row > 0, 'Table must be on valid row');
      assert(col > 0, 'Table must be on valid col');
      var width = this.width,
          filterHeight = this.filterHeight,
          tableHeight = this.tableHeight; // autoFilterRef is a range that includes optional headers only

      table.autoFilterRef = colCache.encode(row, col, row + filterHeight - 1, col + width - 1); // tableRef is a range that includes optional headers and totals

      table.tableRef = colCache.encode(row, col, row + tableHeight - 1, col + width - 1);
      table.columns.forEach(function (column, i) {
        assert(column.name, "Column ".concat(i, " must have a name"));

        if (i === 0) {
          assign(column, 'totalsRowLabel', 'Total');
        } else {
          assign(column, 'totalsRowFunction', 'none');
          column.totalsRowFormula = _this.getFormula(column);
        }
      });
    }
  }, {
    key: "store",
    value: function store() {
      var _this2 = this;

      // where the table needs to store table data, headers, footers in
      // the sheet...
      var assignStyle = function assignStyle(cell, style) {
        if (style) {
          Object.keys(style).forEach(function (key) {
            cell[key] = style[key];
          });
        }
      };

      var worksheet = this.worksheet,
          table = this.table;
      var _table$tl2 = table.tl,
          row = _table$tl2.row,
          col = _table$tl2.col;
      var count = 0;

      if (table.headerRow) {
        var r = worksheet.getRow(row + count++);
        table.columns.forEach(function (column, j) {
          var style = column.style,
              name = column.name;
          var cell = r.getCell(col + j);
          cell.value = name;
          assignStyle(cell, style);
        });
      }

      table.rows.forEach(function (data) {
        var r = worksheet.getRow(row + count++);
        data.forEach(function (value, j) {
          var cell = r.getCell(col + j);
          cell.value = value;
          assignStyle(cell, table.columns[j].style);
        });
      });

      if (table.totalsRow) {
        var _r = worksheet.getRow(row + count++);

        table.columns.forEach(function (column, j) {
          var cell = _r.getCell(col + j);

          if (j === 0) {
            cell.value = column.totalsRowLabel;
          } else {
            var formula = _this2.getFormula(column);

            if (formula) {
              cell.value = {
                formula: column.totalsRowFormula,
                result: column.totalsRowResult
              };
            } else {
              cell.value = null;
            }
          }

          assignStyle(cell, column.style);
        });
      }
    }
  }, {
    key: "load",
    value: function load(worksheet) {
      var _this3 = this;

      // where the table will read necessary features from a loaded sheet
      var table = this.table;
      var _table$tl3 = table.tl,
          row = _table$tl3.row,
          col = _table$tl3.col;
      var count = 0;

      if (table.headerRow) {
        var r = worksheet.getRow(row + count++);
        table.columns.forEach(function (column, j) {
          var cell = r.getCell(col + j);
          cell.value = column.name;
        });
      }

      table.rows.forEach(function (data) {
        var r = worksheet.getRow(row + count++);
        data.forEach(function (value, j) {
          var cell = r.getCell(col + j);
          cell.value = value;
        });
      });

      if (table.totalsRow) {
        var _r2 = worksheet.getRow(row + count++);

        table.columns.forEach(function (column, j) {
          var cell = _r2.getCell(col + j);

          if (j === 0) {
            cell.value = column.totalsRowLabel;
          } else {
            var formula = _this3.getFormula(column);

            if (formula) {
              cell.value = {
                formula: column.totalsRowFormula,
                result: column.totalsRowResult
              };
            }
          }
        });
      }
    }
  }, {
    key: "cacheState",
    // ================================================================
    // TODO: Mutating methods
    value: function cacheState() {
      if (!this._cache) {
        this._cache = {
          ref: this.ref,
          width: this.width,
          tableHeight: this.tableHeight
        };
      }
    }
  }, {
    key: "commit",
    value: function commit() {
      // changes may have been made that might have on-sheet effects
      if (!this._cache) {
        return;
      } // check things are ok first


      this.validate();
      var ref = colCache.decodeAddress(this._cache.ref);

      if (this.ref !== this._cache.ref) {
        // wipe out whole table footprint at previous location
        for (var i = 0; i < this._cache.tableHeight; i++) {
          var row = this.worksheet.getRow(ref.row + i);

          for (var j = 0; j < this._cache.width; j++) {
            var cell = row.getCell(ref.col + j);
            cell.value = null;
          }
        }
      } else {
        // clear out below table if it has shrunk
        for (var _i = this.tableHeight; _i < this._cache.tableHeight; _i++) {
          var _row = this.worksheet.getRow(ref.row + _i);

          for (var _j = 0; _j < this._cache.width; _j++) {
            var _cell = _row.getCell(ref.col + _j);

            _cell.value = null;
          }
        } // clear out to right of table if it has lost columns


        for (var _i2 = 0; _i2 < this.tableHeight; _i2++) {
          var _row2 = this.worksheet.getRow(ref.row + _i2);

          for (var _j2 = this.width; _j2 < this._cache.width; _j2++) {
            var _cell2 = _row2.getCell(ref.col + _j2);

            _cell2.value = null;
          }
        }
      }

      this.store();
    }
  }, {
    key: "addRow",
    value: function addRow(values, rowNumber) {
      // Add a row of data, either insert at rowNumber or append
      this.cacheState();

      if (rowNumber === undefined) {
        this.table.rows.push(values);
      } else {
        this.table.rows.splice(rowNumber, 0, values);
      }
    }
  }, {
    key: "removeRows",
    value: function removeRows(rowIndex) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // Remove a rows of data
      this.cacheState();
      this.table.rows.splice(rowIndex, count);
    }
  }, {
    key: "getColumn",
    value: function getColumn(colIndex) {
      var column = this.table.columns[colIndex];
      return new Column(this, column, colIndex);
    }
  }, {
    key: "addColumn",
    value: function addColumn(column, values, colIndex) {
      // Add a new column, including column defn and values
      // Inserts at colNumber or adds to the right
      this.cacheState();

      if (colIndex === undefined) {
        this.table.columns.push(column);
        this.table.rows.forEach(function (row, i) {
          row.push(values[i]);
        });
      } else {
        this.table.columns.splice(colIndex, 0, column);
        this.table.rows.forEach(function (row, i) {
          row.splice(colIndex, 0, values[i]);
        });
      }
    }
  }, {
    key: "removeColumns",
    value: function removeColumns(colIndex) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // Remove a column with data
      this.cacheState();
      this.table.columns.splice(colIndex, count);
      this.table.rows.forEach(function (row) {
        row.splice(colIndex, count);
      });
    }
  }, {
    key: "_assign",
    value: function _assign(target, prop, value) {
      this.cacheState();
      target[prop] = value;
    }
    /* eslint-disable lines-between-class-members */

  }, {
    key: "width",
    get: function get() {
      // width of the table
      return this.table.columns.length;
    }
  }, {
    key: "height",
    get: function get() {
      // height of the table data
      return this.table.rows.length;
    }
  }, {
    key: "filterHeight",
    get: function get() {
      // height of the table data plus optional header row
      return this.height + (this.table.headerRow ? 1 : 0);
    }
  }, {
    key: "tableHeight",
    get: function get() {
      // full height of the table on the sheet
      return this.filterHeight + (this.table.totalsRow ? 1 : 0);
    }
  }, {
    key: "model",
    get: function get() {
      return this.table;
    },
    set: function set(value) {
      this.table = value;
    }
  }, {
    key: "ref",
    get: function get() {
      return this.table.ref;
    },
    set: function set(value) {
      this._assign(this.table, 'ref', value);
    }
  }, {
    key: "name",
    get: function get() {
      return this.table.name;
    },
    set: function set(value) {
      this.table.name = value;
    }
  }, {
    key: "displayName",
    get: function get() {
      return this.table.displyName || this.table.name;
    }
  }, {
    key: "displayNamename",
    set: function set(value) {
      this.table.displayName = value;
    }
  }, {
    key: "headerRow",
    get: function get() {
      return this.table.headerRow;
    },
    set: function set(value) {
      this._assign(this.table, 'headerRow', value);
    }
  }, {
    key: "totalsRow",
    get: function get() {
      return this.table.totalsRow;
    },
    set: function set(value) {
      this._assign(this.table, 'totalsRow', value);
    }
  }, {
    key: "theme",
    get: function get() {
      return this.table.style.name;
    },
    set: function set(value) {
      this.table.style.name = value;
    }
  }, {
    key: "showFirstColumn",
    get: function get() {
      return this.table.style.showFirstColumn;
    },
    set: function set(value) {
      this.table.style.showFirstColumn = value;
    }
  }, {
    key: "showLastColumn",
    get: function get() {
      return this.table.style.showLastColumn;
    },
    set: function set(value) {
      this.table.style.showLastColumn = value;
    }
  }, {
    key: "showRowStripes",
    get: function get() {
      return this.table.style.showRowStripes;
    },
    set: function set(value) {
      this.table.style.showRowStripes = value;
    }
  }, {
    key: "showColumnStripes",
    get: function get() {
      return this.table.style.showColumnStripes;
    },
    set: function set(value) {
      this.table.style.showColumnStripes = value;
    }
    /* eslint-enable lines-between-class-members */

  }]);

  return Table;
}();

module.exports = Table;
//# sourceMappingURL=table.js.map
