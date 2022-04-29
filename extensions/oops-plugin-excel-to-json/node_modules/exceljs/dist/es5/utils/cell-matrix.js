"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('./under-dash');

var colCache = require('./col-cache');

var CellMatrix = /*#__PURE__*/function () {
  function CellMatrix(template) {
    _classCallCheck(this, CellMatrix);

    this.template = template;
    this.sheets = {};
  }

  _createClass(CellMatrix, [{
    key: "addCell",
    value: function addCell(addressStr) {
      this.addCellEx(colCache.decodeEx(addressStr));
    }
  }, {
    key: "getCell",
    value: function getCell(addressStr) {
      return this.findCellEx(colCache.decodeEx(addressStr), true);
    }
  }, {
    key: "findCell",
    value: function findCell(addressStr) {
      return this.findCellEx(colCache.decodeEx(addressStr), false);
    }
  }, {
    key: "findCellAt",
    value: function findCellAt(sheetName, rowNumber, colNumber) {
      var sheet = this.sheets[sheetName];
      var row = sheet && sheet[rowNumber];
      return row && row[colNumber];
    }
  }, {
    key: "addCellEx",
    value: function addCellEx(address) {
      if (address.top) {
        for (var row = address.top; row <= address.bottom; row++) {
          for (var col = address.left; col <= address.right; col++) {
            this.getCellAt(address.sheetName, row, col);
          }
        }
      } else {
        this.findCellEx(address, true);
      }
    }
  }, {
    key: "getCellEx",
    value: function getCellEx(address) {
      return this.findCellEx(address, true);
    }
  }, {
    key: "findCellEx",
    value: function findCellEx(address, create) {
      var sheet = this.findSheet(address, create);
      var row = this.findSheetRow(sheet, address, create);
      return this.findRowCell(row, address, create);
    }
  }, {
    key: "getCellAt",
    value: function getCellAt(sheetName, rowNumber, colNumber) {
      var sheet = this.sheets[sheetName] || (this.sheets[sheetName] = []);
      var row = sheet[rowNumber] || (sheet[rowNumber] = []);
      var cell = row[colNumber] || (row[colNumber] = {
        sheetName: sheetName,
        address: colCache.n2l(colNumber) + rowNumber,
        row: rowNumber,
        col: colNumber
      });
      return cell;
    }
  }, {
    key: "removeCellEx",
    value: function removeCellEx(address) {
      var sheet = this.findSheet(address);

      if (!sheet) {
        return;
      }

      var row = this.findSheetRow(sheet, address);

      if (!row) {
        return;
      }

      delete row[address.col];
    }
  }, {
    key: "forEachInSheet",
    value: function forEachInSheet(sheetName, callback) {
      var sheet = this.sheets[sheetName];

      if (sheet) {
        sheet.forEach(function (row, rowNumber) {
          if (row) {
            row.forEach(function (cell, colNumber) {
              if (cell) {
                callback(cell, rowNumber, colNumber);
              }
            });
          }
        });
      }
    }
  }, {
    key: "forEach",
    value: function forEach(callback) {
      var _this = this;

      _.each(this.sheets, function (sheet, sheetName) {
        _this.forEachInSheet(sheetName, callback);
      });
    }
  }, {
    key: "map",
    value: function map(callback) {
      var results = [];
      this.forEach(function (cell) {
        results.push(callback(cell));
      });
      return results;
    }
  }, {
    key: "findSheet",
    value: function findSheet(address, create) {
      var name = address.sheetName;

      if (this.sheets[name]) {
        return this.sheets[name];
      }

      if (create) {
        return this.sheets[name] = [];
      }

      return undefined;
    }
  }, {
    key: "findSheetRow",
    value: function findSheetRow(sheet, address, create) {
      var row = address.row;

      if (sheet && sheet[row]) {
        return sheet[row];
      }

      if (create) {
        return sheet[row] = [];
      }

      return undefined;
    }
  }, {
    key: "findRowCell",
    value: function findRowCell(row, address, create) {
      var col = address.col;

      if (row && row[col]) {
        return row[col];
      }

      if (create) {
        return row[col] = this.template ? Object.assign(address, JSON.parse(JSON.stringify(this.template))) : address;
      }

      return undefined;
    }
  }, {
    key: "spliceRows",
    value: function spliceRows(sheetName, start, numDelete, numInsert) {
      var sheet = this.sheets[sheetName];

      if (sheet) {
        var inserts = [];

        for (var i = 0; i < numInsert; i++) {
          inserts.push([]);
        }

        sheet.splice.apply(sheet, [start, numDelete].concat(inserts));
      }
    }
  }, {
    key: "spliceColumns",
    value: function spliceColumns(sheetName, start, numDelete, numInsert) {
      var sheet = this.sheets[sheetName];

      if (sheet) {
        var inserts = [];

        for (var i = 0; i < numInsert; i++) {
          inserts.push(null);
        }

        _.each(sheet, function (row) {
          row.splice.apply(row, [start, numDelete].concat(inserts));
        });
      }
    }
  }]);

  return CellMatrix;
}();

module.exports = CellMatrix;
//# sourceMappingURL=cell-matrix.js.map
