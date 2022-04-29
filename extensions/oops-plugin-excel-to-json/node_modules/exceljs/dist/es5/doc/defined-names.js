'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('../utils/under-dash');

var colCache = require('../utils/col-cache');

var CellMatrix = require('../utils/cell-matrix');

var Range = require('./range');

var rangeRegexp = /[$](\w+)[$](\d+)(:[$](\w+)[$](\d+))?/;

var DefinedNames = /*#__PURE__*/function () {
  function DefinedNames() {
    _classCallCheck(this, DefinedNames);

    this.matrixMap = {};
  }

  _createClass(DefinedNames, [{
    key: "getMatrix",
    value: function getMatrix(name) {
      var matrix = this.matrixMap[name] || (this.matrixMap[name] = new CellMatrix());
      return matrix;
    } // add a name to a cell. locStr in the form SheetName!$col$row or SheetName!$c1$r1:$c2:$r2

  }, {
    key: "add",
    value: function add(locStr, name) {
      var location = colCache.decodeEx(locStr);
      this.addEx(location, name);
    }
  }, {
    key: "addEx",
    value: function addEx(location, name) {
      var matrix = this.getMatrix(name);

      if (location.top) {
        for (var col = location.left; col <= location.right; col++) {
          for (var row = location.top; row <= location.bottom; row++) {
            var address = {
              sheetName: location.sheetName,
              address: colCache.n2l(col) + row,
              row: row,
              col: col
            };
            matrix.addCellEx(address);
          }
        }
      } else {
        matrix.addCellEx(location);
      }
    }
  }, {
    key: "remove",
    value: function remove(locStr, name) {
      var location = colCache.decodeEx(locStr);
      this.removeEx(location, name);
    }
  }, {
    key: "removeEx",
    value: function removeEx(location, name) {
      var matrix = this.getMatrix(name);
      matrix.removeCellEx(location);
    }
  }, {
    key: "removeAllNames",
    value: function removeAllNames(location) {
      _.each(this.matrixMap, function (matrix) {
        matrix.removeCellEx(location);
      });
    }
  }, {
    key: "forEach",
    value: function forEach(callback) {
      _.each(this.matrixMap, function (matrix, name) {
        matrix.forEach(function (cell) {
          callback(name, cell);
        });
      });
    } // get all the names of a cell

  }, {
    key: "getNames",
    value: function getNames(addressStr) {
      return this.getNamesEx(colCache.decodeEx(addressStr));
    }
  }, {
    key: "getNamesEx",
    value: function getNamesEx(address) {
      return _.map(this.matrixMap, function (matrix, name) {
        return matrix.findCellEx(address) && name;
      }).filter(Boolean);
    }
  }, {
    key: "_explore",
    value: function _explore(matrix, cell) {
      cell.mark = false;
      var sheetName = cell.sheetName;
      var range = new Range(cell.row, cell.col, cell.row, cell.col, sheetName);
      var x;
      var y; // grow vertical - only one col to worry about

      function vGrow(yy, edge) {
        var c = matrix.findCellAt(sheetName, yy, cell.col);

        if (!c || !c.mark) {
          return false;
        }

        range[edge] = yy;
        c.mark = false;
        return true;
      }

      for (y = cell.row - 1; vGrow(y, 'top'); y--) {
        ;
      }

      for (y = cell.row + 1; vGrow(y, 'bottom'); y++) {
        ;
      } // grow horizontal - ensure all rows can grow


      function hGrow(xx, edge) {
        var cells = [];

        for (y = range.top; y <= range.bottom; y++) {
          var c = matrix.findCellAt(sheetName, y, xx);

          if (c && c.mark) {
            cells.push(c);
          } else {
            return false;
          }
        }

        range[edge] = xx;

        for (var i = 0; i < cells.length; i++) {
          cells[i].mark = false;
        }

        return true;
      }

      for (x = cell.col - 1; hGrow(x, 'left'); x--) {
        ;
      }

      for (x = cell.col + 1; hGrow(x, 'right'); x++) {
        ;
      }

      return range;
    }
  }, {
    key: "getRanges",
    value: function getRanges(name, matrix) {
      var _this = this;

      matrix = matrix || this.matrixMap[name];

      if (!matrix) {
        return {
          name: name,
          ranges: []
        };
      } // mark and sweep!


      matrix.forEach(function (cell) {
        cell.mark = true;
      });
      var ranges = matrix.map(function (cell) {
        return cell.mark && _this._explore(matrix, cell);
      }).filter(Boolean).map(function (range) {
        return range.$shortRange;
      });
      return {
        name: name,
        ranges: ranges
      };
    }
  }, {
    key: "normaliseMatrix",
    value: function normaliseMatrix(matrix, sheetName) {
      // some of the cells might have shifted on specified sheet
      // need to reassign rows, cols
      matrix.forEachInSheet(sheetName, function (cell, row, col) {
        if (cell) {
          if (cell.row !== row || cell.col !== col) {
            cell.row = row;
            cell.col = col;
            cell.address = colCache.n2l(col) + row;
          }
        }
      });
    }
  }, {
    key: "spliceRows",
    value: function spliceRows(sheetName, start, numDelete, numInsert) {
      var _this2 = this;

      _.each(this.matrixMap, function (matrix) {
        matrix.spliceRows(sheetName, start, numDelete, numInsert);

        _this2.normaliseMatrix(matrix, sheetName);
      });
    }
  }, {
    key: "spliceColumns",
    value: function spliceColumns(sheetName, start, numDelete, numInsert) {
      var _this3 = this;

      _.each(this.matrixMap, function (matrix) {
        matrix.spliceColumns(sheetName, start, numDelete, numInsert);

        _this3.normaliseMatrix(matrix, sheetName);
      });
    }
  }, {
    key: "model",
    get: function get() {
      var _this4 = this;

      // To get names per cell - just iterate over all names finding cells if they exist
      return _.map(this.matrixMap, function (matrix, name) {
        return _this4.getRanges(name, matrix);
      }).filter(function (definedName) {
        return definedName.ranges.length;
      });
    },
    set: function set(value) {
      // value is [ { name, ranges }, ... ]
      var matrixMap = this.matrixMap = {};
      value.forEach(function (definedName) {
        var matrix = matrixMap[definedName.name] = new CellMatrix();
        definedName.ranges.forEach(function (rangeStr) {
          if (rangeRegexp.test(rangeStr.split('!').pop() || '')) {
            matrix.addCell(rangeStr);
          }
        });
      });
    }
  }]);

  return DefinedNames;
}();

module.exports = DefinedNames;
//# sourceMappingURL=defined-names.js.map
