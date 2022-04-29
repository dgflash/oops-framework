'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Worksheet = require('./worksheet');

var DefinedNames = require('./defined-names');

var XLSX = require('../xlsx/xlsx');

var CSV = require('../csv/csv'); // Workbook requirements
//  Load and Save from file and stream
//  Access/Add/Delete individual worksheets
//  Manage String table, Hyperlink table, etc.
//  Manage scaffolding for contained objects to write to/read from


var Workbook = /*#__PURE__*/function () {
  function Workbook() {
    _classCallCheck(this, Workbook);

    this.category = '';
    this.company = '';
    this.created = new Date();
    this.description = '';
    this.keywords = '';
    this.manager = '';
    this.modified = this.created;
    this.properties = {};
    this.calcProperties = {};
    this._worksheets = [];
    this.subject = '';
    this.title = '';
    this.views = [];
    this.media = [];
    this._definedNames = new DefinedNames();
  }

  _createClass(Workbook, [{
    key: "addWorksheet",
    value: function addWorksheet(name, options) {
      var id = this.nextId;

      if (name && name.length > 31) {
        // eslint-disable-next-line no-console
        console.warn("Worksheet name ".concat(name, " exceeds 31 chars. This will be truncated"));
      } // Illegal character in worksheet name: asterisk (*), question mark (?),
      // colon (:), forward slash (/ \), or bracket ([])


      if (/[*?:/\\[\]]/.test(name)) {
        throw new Error("Worksheet name ".concat(name, " cannot include any of the following characters: * ? : \\ / [ ]"));
      }

      if (/(^')|('$)/.test(name)) {
        throw new Error("The first or last character of worksheet name cannot be a single quotation mark: ".concat(name));
      }

      name = (name || "sheet".concat(id)).substring(0, 31);

      if (this._worksheets.find(function (ws) {
        return ws && ws.name.toLowerCase() === name.toLowerCase();
      })) {
        throw new Error("Worksheet name already exists: ".concat(name));
      } // if options is a color, call it tabColor (and signal deprecated message)


      if (options) {
        if (typeof options === 'string') {
          // eslint-disable-next-line no-console
          console.trace('tabColor argument is now deprecated. Please use workbook.addWorksheet(name, {properties: { tabColor: { argb: "rbg value" } }');
          options = {
            properties: {
              tabColor: {
                argb: options
              }
            }
          };
        } else if (options.argb || options.theme || options.indexed) {
          // eslint-disable-next-line no-console
          console.trace('tabColor argument is now deprecated. Please use workbook.addWorksheet(name, {properties: { tabColor: { ... } }');
          options = {
            properties: {
              tabColor: options
            }
          };
        }
      }

      var lastOrderNo = this._worksheets.reduce(function (acc, ws) {
        return (ws && ws.orderNo) > acc ? ws.orderNo : acc;
      }, 0);

      var worksheetOptions = Object.assign({}, options, {
        id: id,
        name: name,
        orderNo: lastOrderNo + 1,
        workbook: this
      });
      var worksheet = new Worksheet(worksheetOptions);
      this._worksheets[id] = worksheet;
      return worksheet;
    }
  }, {
    key: "removeWorksheetEx",
    value: function removeWorksheetEx(worksheet) {
      delete this._worksheets[worksheet.id];
    }
  }, {
    key: "removeWorksheet",
    value: function removeWorksheet(id) {
      var worksheet = this.getWorksheet(id);

      if (worksheet) {
        worksheet.destroy();
      }
    }
  }, {
    key: "getWorksheet",
    value: function getWorksheet(id) {
      if (id === undefined) {
        return this._worksheets.find(Boolean);
      }

      if (typeof id === 'number') {
        return this._worksheets[id];
      }

      if (typeof id === 'string') {
        return this._worksheets.find(function (worksheet) {
          return worksheet && worksheet.name === id;
        });
      }

      return undefined;
    }
  }, {
    key: "eachSheet",
    value: function eachSheet(iteratee) {
      this.worksheets.forEach(function (sheet) {
        iteratee(sheet, sheet.id);
      });
    }
  }, {
    key: "clearThemes",
    value: function clearThemes() {
      // Note: themes are not an exposed feature, meddle at your peril!
      this._themes = undefined;
    }
  }, {
    key: "addImage",
    value: function addImage(image) {
      // TODO:  validation?
      var id = this.media.length;
      this.media.push(Object.assign({}, image, {
        type: 'image'
      }));
      return id;
    }
  }, {
    key: "getImage",
    value: function getImage(id) {
      return this.media[id];
    }
  }, {
    key: "xlsx",
    get: function get() {
      if (!this._xlsx) this._xlsx = new XLSX(this);
      return this._xlsx;
    }
  }, {
    key: "csv",
    get: function get() {
      if (!this._csv) this._csv = new CSV(this);
      return this._csv;
    }
  }, {
    key: "nextId",
    get: function get() {
      // find the next unique spot to add worksheet
      for (var i = 1; i < this._worksheets.length; i++) {
        if (!this._worksheets[i]) {
          return i;
        }
      }

      return this._worksheets.length || 1;
    }
  }, {
    key: "worksheets",
    get: function get() {
      // return a clone of _worksheets
      return this._worksheets.slice(1).sort(function (a, b) {
        return a.orderNo - b.orderNo;
      }).filter(Boolean);
    }
  }, {
    key: "definedNames",
    get: function get() {
      return this._definedNames;
    }
  }, {
    key: "model",
    get: function get() {
      return {
        creator: this.creator || 'Unknown',
        lastModifiedBy: this.lastModifiedBy || 'Unknown',
        lastPrinted: this.lastPrinted,
        created: this.created,
        modified: this.modified,
        properties: this.properties,
        worksheets: this.worksheets.map(function (worksheet) {
          return worksheet.model;
        }),
        sheets: this.worksheets.map(function (ws) {
          return ws.model;
        }).filter(Boolean),
        definedNames: this._definedNames.model,
        views: this.views,
        company: this.company,
        manager: this.manager,
        title: this.title,
        subject: this.subject,
        keywords: this.keywords,
        category: this.category,
        description: this.description,
        language: this.language,
        revision: this.revision,
        contentStatus: this.contentStatus,
        themes: this._themes,
        media: this.media,
        calcProperties: this.calcProperties
      };
    },
    set: function set(value) {
      var _this = this;

      this.creator = value.creator;
      this.lastModifiedBy = value.lastModifiedBy;
      this.lastPrinted = value.lastPrinted;
      this.created = value.created;
      this.modified = value.modified;
      this.company = value.company;
      this.manager = value.manager;
      this.title = value.title;
      this.subject = value.subject;
      this.keywords = value.keywords;
      this.category = value.category;
      this.description = value.description;
      this.language = value.language;
      this.revision = value.revision;
      this.contentStatus = value.contentStatus;
      this.properties = value.properties;
      this.calcProperties = value.calcProperties;
      this._worksheets = [];
      value.worksheets.forEach(function (worksheetModel) {
        var id = worksheetModel.id,
            name = worksheetModel.name,
            state = worksheetModel.state;
        var orderNo = value.sheets && value.sheets.findIndex(function (ws) {
          return ws.id === id;
        });
        var worksheet = _this._worksheets[id] = new Worksheet({
          id: id,
          name: name,
          orderNo: orderNo,
          state: state,
          workbook: _this
        });
        worksheet.model = worksheetModel;
      });
      this._definedNames.model = value.definedNames;
      this.views = value.views;
      this._themes = value.themes;
      this.media = value.media || [];
    }
  }]);

  return Workbook;
}();

module.exports = Workbook;
//# sourceMappingURL=workbook.js.map
