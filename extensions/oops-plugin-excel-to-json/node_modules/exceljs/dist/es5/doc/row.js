'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('../utils/under-dash');

var Enums = require('./enums');

var colCache = require('../utils/col-cache');

var Cell = require('./cell');

var Row = /*#__PURE__*/function () {
  function Row(worksheet, number) {
    _classCallCheck(this, Row);

    this._worksheet = worksheet;
    this._number = number;
    this._cells = [];
    this.style = {};
    this.outlineLevel = 0;
  } // return the row number


  _createClass(Row, [{
    key: "commit",
    // Inform Streaming Writer that this row (and all rows before it) are complete
    // and ready to write. Has no effect on Worksheet document
    value: function commit() {
      this._worksheet._commitRow(this); // eslint-disable-line no-underscore-dangle

    } // helps GC by breaking cyclic references

  }, {
    key: "destroy",
    value: function destroy() {
      delete this._worksheet;
      delete this._cells;
      delete this.style;
    }
  }, {
    key: "findCell",
    value: function findCell(colNumber) {
      return this._cells[colNumber - 1];
    } // given {address, row, col}, find or create new cell

  }, {
    key: "getCellEx",
    value: function getCellEx(address) {
      var cell = this._cells[address.col - 1];

      if (!cell) {
        var column = this._worksheet.getColumn(address.col);

        cell = new Cell(this, column, address.address);
        this._cells[address.col - 1] = cell;
      }

      return cell;
    } // get cell by key, letter or column number

  }, {
    key: "getCell",
    value: function getCell(col) {
      if (typeof col === 'string') {
        // is it a key?
        var column = this._worksheet.getColumnKey(col);

        if (column) {
          col = column.number;
        } else {
          col = colCache.l2n(col);
        }
      }

      return this._cells[col - 1] || this.getCellEx({
        address: colCache.encodeAddress(this._number, col),
        row: this._number,
        col: col
      });
    } // remove cell(s) and shift all higher cells down by count

  }, {
    key: "splice",
    value: function splice(start, count) {
      var nKeep = start + count;

      for (var _len = arguments.length, inserts = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        inserts[_key - 2] = arguments[_key];
      }

      var nExpand = inserts.length - count;
      var nEnd = this._cells.length;
      var i;
      var cSrc;
      var cDst;

      if (nExpand < 0) {
        // remove cells
        for (i = start + inserts.length; i <= nEnd; i++) {
          cDst = this._cells[i - 1];
          cSrc = this._cells[i - nExpand - 1];

          if (cSrc) {
            cDst = this.getCell(i);
            cDst.value = cSrc.value;
            cDst.style = cSrc.style; // eslint-disable-next-line no-underscore-dangle

            cDst._comment = cSrc._comment;
          } else if (cDst) {
            cDst.value = null;
            cDst.style = {}; // eslint-disable-next-line no-underscore-dangle

            cDst._comment = undefined;
          }
        }
      } else if (nExpand > 0) {
        // insert new cells
        for (i = nEnd; i >= nKeep; i--) {
          cSrc = this._cells[i - 1];

          if (cSrc) {
            cDst = this.getCell(i + nExpand);
            cDst.value = cSrc.value;
            cDst.style = cSrc.style; // eslint-disable-next-line no-underscore-dangle

            cDst._comment = cSrc._comment;
          } else {
            this._cells[i + nExpand - 1] = undefined;
          }
        }
      } // now add the new values


      for (i = 0; i < inserts.length; i++) {
        cDst = this.getCell(start + i);
        cDst.value = inserts[i];
        cDst.style = {}; // eslint-disable-next-line no-underscore-dangle

        cDst._comment = undefined;
      }
    } // Iterate over all non-null cells in this row

  }, {
    key: "eachCell",
    value: function eachCell(options, iteratee) {
      if (!iteratee) {
        iteratee = options;
        options = null;
      }

      if (options && options.includeEmpty) {
        var n = this._cells.length;

        for (var i = 1; i <= n; i++) {
          iteratee(this.getCell(i), i);
        }
      } else {
        this._cells.forEach(function (cell, index) {
          if (cell && cell.type !== Enums.ValueType.Null) {
            iteratee(cell, index + 1);
          }
        });
      }
    } // ===========================================================================
    // Page Breaks

  }, {
    key: "addPageBreak",
    value: function addPageBreak(lft, rght) {
      var ws = this._worksheet;
      var left = Math.max(0, lft - 1) || 0;
      var right = Math.max(0, rght - 1) || 16838;
      var pb = {
        id: this._number,
        max: right,
        man: 1
      };
      if (left) pb.min = left;
      ws.rowBreaks.push(pb);
    } // return a sparse array of cell values

  }, {
    key: "_applyStyle",
    // =========================================================================
    // styles
    value: function _applyStyle(name, value) {
      this.style[name] = value;

      this._cells.forEach(function (cell) {
        if (cell) {
          cell[name] = value;
        }
      });

      return value;
    }
  }, {
    key: "number",
    get: function get() {
      return this._number;
    }
  }, {
    key: "worksheet",
    get: function get() {
      return this._worksheet;
    }
  }, {
    key: "values",
    get: function get() {
      var values = [];

      this._cells.forEach(function (cell) {
        if (cell && cell.type !== Enums.ValueType.Null) {
          values[cell.col] = cell.value;
        }
      });

      return values;
    } // set the values by contiguous or sparse array, or by key'd object literal
    ,
    set: function set(value) {
      var _this = this;

      // this operation is not additive - any prior cells are removed
      this._cells = [];

      if (!value) {// empty row
      } else if (value instanceof Array) {
        var offset = 0;

        if (value.hasOwnProperty('0')) {
          // contiguous array - start at column 1
          offset = 1;
        }

        value.forEach(function (item, index) {
          if (item !== undefined) {
            _this.getCellEx({
              address: colCache.encodeAddress(_this._number, index + offset),
              row: _this._number,
              col: index + offset
            }).value = item;
          }
        });
      } else {
        // assume object with column keys
        this._worksheet.eachColumnKey(function (column, key) {
          if (value[key] !== undefined) {
            _this.getCellEx({
              address: colCache.encodeAddress(_this._number, column.number),
              row: _this._number,
              col: column.number
            }).value = value[key];
          }
        });
      }
    } // returns true if the row includes at least one cell with a value

  }, {
    key: "hasValues",
    get: function get() {
      return _.some(this._cells, function (cell) {
        return cell && cell.type !== Enums.ValueType.Null;
      });
    }
  }, {
    key: "cellCount",
    get: function get() {
      return this._cells.length;
    }
  }, {
    key: "actualCellCount",
    get: function get() {
      var count = 0;
      this.eachCell(function () {
        count++;
      });
      return count;
    } // get the min and max column number for the non-null cells in this row or null

  }, {
    key: "dimensions",
    get: function get() {
      var min = 0;
      var max = 0;

      this._cells.forEach(function (cell) {
        if (cell && cell.type !== Enums.ValueType.Null) {
          if (!min || min > cell.col) {
            min = cell.col;
          }

          if (max < cell.col) {
            max = cell.col;
          }
        }
      });

      return min > 0 ? {
        min: min,
        max: max
      } : null;
    }
  }, {
    key: "numFmt",
    get: function get() {
      return this.style.numFmt;
    },
    set: function set(value) {
      this._applyStyle('numFmt', value);
    }
  }, {
    key: "font",
    get: function get() {
      return this.style.font;
    },
    set: function set(value) {
      this._applyStyle('font', value);
    }
  }, {
    key: "alignment",
    get: function get() {
      return this.style.alignment;
    },
    set: function set(value) {
      this._applyStyle('alignment', value);
    }
  }, {
    key: "protection",
    get: function get() {
      return this.style.protection;
    },
    set: function set(value) {
      this._applyStyle('protection', value);
    }
  }, {
    key: "border",
    get: function get() {
      return this.style.border;
    },
    set: function set(value) {
      this._applyStyle('border', value);
    }
  }, {
    key: "fill",
    get: function get() {
      return this.style.fill;
    },
    set: function set(value) {
      this._applyStyle('fill', value);
    }
  }, {
    key: "hidden",
    get: function get() {
      return !!this._hidden;
    },
    set: function set(value) {
      this._hidden = value;
    }
  }, {
    key: "outlineLevel",
    get: function get() {
      return this._outlineLevel || 0;
    },
    set: function set(value) {
      this._outlineLevel = value;
    }
  }, {
    key: "collapsed",
    get: function get() {
      return !!(this._outlineLevel && this._outlineLevel >= this._worksheet.properties.outlineLevelRow);
    } // =========================================================================

  }, {
    key: "model",
    get: function get() {
      var cells = [];
      var min = 0;
      var max = 0;

      this._cells.forEach(function (cell) {
        if (cell) {
          var cellModel = cell.model;

          if (cellModel) {
            if (!min || min > cell.col) {
              min = cell.col;
            }

            if (max < cell.col) {
              max = cell.col;
            }

            cells.push(cellModel);
          }
        }
      });

      return this.height || cells.length ? {
        cells: cells,
        number: this.number,
        min: min,
        max: max,
        height: this.height,
        style: this.style,
        hidden: this.hidden,
        outlineLevel: this.outlineLevel,
        collapsed: this.collapsed
      } : null;
    },
    set: function set(value) {
      var _this2 = this;

      if (value.number !== this._number) {
        throw new Error('Invalid row number in model');
      }

      this._cells = [];
      var previousAddress;
      value.cells.forEach(function (cellModel) {
        switch (cellModel.type) {
          case Cell.Types.Merge:
            // special case - don't add this types
            break;

          default:
            {
              var address;

              if (cellModel.address) {
                address = colCache.decodeAddress(cellModel.address);
              } else if (previousAddress) {
                // This is a <c> element without an r attribute
                // Assume that it's the cell for the next column
                var _previousAddress = previousAddress,
                    row = _previousAddress.row;
                var col = previousAddress.col + 1;
                address = {
                  row: row,
                  col: col,
                  address: colCache.encodeAddress(row, col),
                  $col$row: "$".concat(colCache.n2l(col), "$").concat(row)
                };
              }

              previousAddress = address;

              var cell = _this2.getCellEx(address);

              cell.model = cellModel;
              break;
            }
        }
      });

      if (value.height) {
        this.height = value.height;
      } else {
        delete this.height;
      }

      this.hidden = value.hidden;
      this.outlineLevel = value.outlineLevel || 0;
      this.style = value.style && JSON.parse(JSON.stringify(value.style)) || {};
    }
  }]);

  return Row;
}();

module.exports = Row;
//# sourceMappingURL=row.js.map
