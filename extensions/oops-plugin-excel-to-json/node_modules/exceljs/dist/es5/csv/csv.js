"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var fastCsv = require('fast-csv');

var customParseFormat = require('dayjs/plugin/customParseFormat');

var utc = require('dayjs/plugin/utc');

var dayjs = require('dayjs').extend(customParseFormat).extend(utc);

var StreamBuf = require('../utils/stream-buf');

var _require = require('../utils/utils'),
    exists = _require.fs.exists;
/* eslint-disable quote-props */


var SpecialValues = {
  true: true,
  false: false,
  '#N/A': {
    error: '#N/A'
  },
  '#REF!': {
    error: '#REF!'
  },
  '#NAME?': {
    error: '#NAME?'
  },
  '#DIV/0!': {
    error: '#DIV/0!'
  },
  '#NULL!': {
    error: '#NULL!'
  },
  '#VALUE!': {
    error: '#VALUE!'
  },
  '#NUM!': {
    error: '#NUM!'
  }
};
/* eslint-ensable quote-props */

var CSV = /*#__PURE__*/function () {
  function CSV(workbook) {
    _classCallCheck(this, CSV);

    this.workbook = workbook;
    this.worksheet = null;
  }

  _createClass(CSV, [{
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filename, options) {
        var stream, worksheet;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = options || {};
                _context.next = 3;
                return exists(filename);

              case 3:
                if (_context.sent) {
                  _context.next = 5;
                  break;
                }

                throw new Error("File not found: ".concat(filename));

              case 5:
                stream = fs.createReadStream(filename);
                _context.next = 8;
                return this.read(stream, options);

              case 8:
                worksheet = _context.sent;
                stream.close();
                return _context.abrupt("return", worksheet);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function readFile(_x, _x2) {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }()
  }, {
    key: "read",
    value: function read(stream, options) {
      var _this = this;

      options = options || {};
      return new Promise(function (resolve, reject) {
        var worksheet = _this.workbook.addWorksheet(options.sheetName);

        var dateFormats = options.dateFormats || ['YYYY-MM-DD[T]HH:mm:ssZ', 'YYYY-MM-DD[T]HH:mm:ss', 'MM-DD-YYYY', 'YYYY-MM-DD'];

        var map = options.map || function (datum) {
          if (datum === '') {
            return null;
          }

          var datumNumber = Number(datum);

          if (!Number.isNaN(datumNumber) && datumNumber !== Infinity) {
            return datumNumber;
          }

          var dt = dateFormats.reduce(function (matchingDate, currentDateFormat) {
            if (matchingDate) {
              return matchingDate;
            }

            var dayjsObj = dayjs(datum, currentDateFormat, true);

            if (dayjsObj.isValid()) {
              return dayjsObj;
            }

            return null;
          }, null);

          if (dt) {
            return new Date(dt.valueOf());
          }

          var special = SpecialValues[datum];

          if (special !== undefined) {
            return special;
          }

          return datum;
        };

        var csvStream = fastCsv.parse(options.parserOptions).on('data', function (data) {
          worksheet.addRow(data.map(map));
        }).on('end', function () {
          csvStream.emit('worksheet', worksheet);
        });
        csvStream.on('worksheet', resolve).on('error', reject);
        stream.pipe(csvStream);
      });
    }
    /**
     * @deprecated since version 4.0. You should use `CSV#read` instead. Please follow upgrade instruction: https://github.com/exceljs/exceljs/blob/master/UPGRADE-4.0.md
     */

  }, {
    key: "createInputStream",
    value: function createInputStream() {
      throw new Error('`CSV#createInputStream` is deprecated. You should use `CSV#read` instead. This method will be removed in version 5.0. Please follow upgrade instruction: https://github.com/exceljs/exceljs/blob/master/UPGRADE-4.0.md');
    }
  }, {
    key: "write",
    value: function write(stream, options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        options = options || {}; // const encoding = options.encoding || 'utf8';
        // const separator = options.separator || ',';
        // const quoteChar = options.quoteChar || '\'';

        var worksheet = _this2.workbook.getWorksheet(options.sheetName || options.sheetId);

        var csvStream = fastCsv.format(options.formatterOptions);
        stream.on('finish', function () {
          resolve();
        });
        csvStream.on('error', reject);
        csvStream.pipe(stream);
        var _options = options,
            dateFormat = _options.dateFormat,
            dateUTC = _options.dateUTC;

        var map = options.map || function (value) {
          if (value) {
            if (value.text || value.hyperlink) {
              return value.hyperlink || value.text || '';
            }

            if (value.formula || value.result) {
              return value.result || '';
            }

            if (value instanceof Date) {
              if (dateFormat) {
                return dateUTC ? dayjs.utc(value).format(dateFormat) : dayjs(value).format(dateFormat);
              }

              return dateUTC ? dayjs.utc(value).format() : dayjs(value).format();
            }

            if (value.error) {
              return value.error;
            }

            if (_typeof(value) === 'object') {
              return JSON.stringify(value);
            }
          }

          return value;
        };

        var includeEmptyRows = options.includeEmptyRows === undefined || options.includeEmptyRows;
        var lastRow = 1;

        if (worksheet) {
          worksheet.eachRow(function (row, rowNumber) {
            if (includeEmptyRows) {
              while (lastRow++ < rowNumber - 1) {
                csvStream.write([]);
              }
            }

            var values = row.values;
            values.shift();
            csvStream.write(values.map(map));
            lastRow = rowNumber;
          });
        }

        csvStream.end();
      });
    }
  }, {
    key: "writeFile",
    value: function writeFile(filename, options) {
      options = options || {};
      var streamOptions = {
        encoding: options.encoding || 'utf8'
      };
      var stream = fs.createWriteStream(filename, streamOptions);
      return this.write(stream, options);
    }
  }, {
    key: "writeBuffer",
    value: function () {
      var _writeBuffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
        var stream;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                stream = new StreamBuf();
                _context2.next = 3;
                return this.write(stream, options);

              case 3:
                return _context2.abrupt("return", stream.read());

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function writeBuffer(_x3) {
        return _writeBuffer.apply(this, arguments);
      }

      return writeBuffer;
    }()
  }]);

  return CSV;
}();

module.exports = CSV;
//# sourceMappingURL=csv.js.map
