'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('../utils/under-dash');

var Enums = require('./enums');

var colCache = require('../utils/col-cache');

var DEFAULT_COLUMN_WIDTH = 9; // Column defines the column properties for 1 column.
// This includes header rows, widths, key, (style), etc.
// Worksheet will condense the columns as appropriate during serialization

var Column = /*#__PURE__*/function () {
  function Column(worksheet, number, defn) {
    _classCallCheck(this, Column);

    this._worksheet = worksheet;
    this._number = number;

    if (defn !== false) {
      // sometimes defn will follow
      this.defn = defn;
    }
  }

  _createClass(Column, [{
    key: "toString",
    value: function toString() {
      return JSON.stringify({
        key: this.key,
        width: this.width,
        headers: this.headers.length ? this.headers : undefined
      });
    }
  }, {
    key: "equivalentTo",
    value: function equivalentTo(other) {
      return this.width === other.width && this.hidden === other.hidden && this.outlineLevel === other.outlineLevel && _.isEqual(this.style, other.style);
    }
  }, {
    key: "eachCell",
    value: function eachCell(options, iteratee) {
      var colNumber = this.number;

      if (!iteratee) {
        iteratee = options;
        options = null;
      }

      this._worksheet.eachRow(options, function (row, rowNumber) {
        iteratee(row.getCell(colNumber), rowNumber);
      });
    }
  }, {
    key: "_applyStyle",
    // =========================================================================
    // styles
    value: function _applyStyle(name, value) {
      this.style[name] = value;
      this.eachCell(function (cell) {
        cell[name] = value;
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
    key: "letter",
    get: function get() {
      return colCache.n2l(this._number);
    }
  }, {
    key: "isCustomWidth",
    get: function get() {
      return this.width !== undefined && this.width !== DEFAULT_COLUMN_WIDTH;
    }
  }, {
    key: "defn",
    get: function get() {
      return {
        header: this._header,
        key: this.key,
        width: this.width,
        style: this.style,
        hidden: this.hidden,
        outlineLevel: this.outlineLevel
      };
    },
    set: function set(value) {
      if (value) {
        this.key = value.key;
        this.width = value.width !== undefined ? value.width : DEFAULT_COLUMN_WIDTH;
        this.outlineLevel = value.outlineLevel;

        if (value.style) {
          this.style = value.style;
        } else {
          this.style = {};
        } // headers must be set after style


        this.header = value.header;
        this._hidden = !!value.hidden;
      } else {
        delete this._header;
        delete this._key;
        delete this.width;
        this.style = {};
        this.outlineLevel = 0;
      }
    }
  }, {
    key: "headers",
    get: function get() {
      return this._header && this._header instanceof Array ? this._header : [this._header];
    }
  }, {
    key: "header",
    get: function get() {
      return this._header;
    },
    set: function set(value) {
      var _this = this;

      if (value !== undefined) {
        this._header = value;
        this.headers.forEach(function (text, index) {
          _this._worksheet.getCell(index + 1, _this.number).value = text;
        });
      } else {
        this._header = undefined;
      }
    }
  }, {
    key: "key",
    get: function get() {
      return this._key;
    },
    set: function set(value) {
      var column = this._key && this._worksheet.getColumnKey(this._key);

      if (column === this) {
        this._worksheet.deleteColumnKey(this._key);
      }

      this._key = value;

      if (value) {
        this._worksheet.setColumnKey(this._key, this);
      }
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
      return !!(this._outlineLevel && this._outlineLevel >= this._worksheet.properties.outlineLevelCol);
    }
  }, {
    key: "isDefault",
    get: function get() {
      if (this.isCustomWidth) {
        return false;
      }

      if (this.hidden) {
        return false;
      }

      if (this.outlineLevel) {
        return false;
      }

      var s = this.style;

      if (s && (s.font || s.numFmt || s.alignment || s.border || s.fill || s.protection)) {
        return false;
      }

      return true;
    }
  }, {
    key: "headerCount",
    get: function get() {
      return this.headers.length;
    }
  }, {
    key: "values",
    get: function get() {
      var v = [];
      this.eachCell(function (cell, rowNumber) {
        if (cell && cell.type !== Enums.ValueType.Null) {
          v[rowNumber] = cell.value;
        }
      });
      return v;
    },
    set: function set(v) {
      var _this2 = this;

      if (!v) {
        return;
      }

      var colNumber = this.number;
      var offset = 0;

      if (v.hasOwnProperty('0')) {
        // assume contiguous array, start at row 1
        offset = 1;
      }

      v.forEach(function (value, index) {
        _this2._worksheet.getCell(index + offset, colNumber).value = value;
      });
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
    } // =============================================================================
    // static functions

  }], [{
    key: "toModel",
    value: function toModel(columns) {
      // Convert array of Column into compressed list cols
      var cols = [];
      var col = null;

      if (columns) {
        columns.forEach(function (column, index) {
          if (column.isDefault) {
            if (col) {
              col = null;
            }
          } else if (!col || !column.equivalentTo(col)) {
            col = {
              min: index + 1,
              max: index + 1,
              width: column.width !== undefined ? column.width : DEFAULT_COLUMN_WIDTH,
              style: column.style,
              isCustomWidth: column.isCustomWidth,
              hidden: column.hidden,
              outlineLevel: column.outlineLevel,
              collapsed: column.collapsed
            };
            cols.push(col);
          } else {
            col.max = index + 1;
          }
        });
      }

      return cols.length ? cols : undefined;
    }
  }, {
    key: "fromModel",
    value: function fromModel(worksheet, cols) {
      cols = cols || [];
      var columns = [];
      var count = 1;
      var index = 0;

      while (index < cols.length) {
        var col = cols[index++];

        while (count < col.min) {
          columns.push(new Column(worksheet, count++));
        }

        while (count <= col.max) {
          columns.push(new Column(worksheet, count++, col));
        }
      }

      return columns.length ? columns : null;
    }
  }]);

  return Column;
}();

module.exports = Column;
//# sourceMappingURL=column.js.map
