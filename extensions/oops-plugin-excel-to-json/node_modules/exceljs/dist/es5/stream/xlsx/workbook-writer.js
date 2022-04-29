"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var Archiver = require('archiver');

var StreamBuf = require('../../utils/stream-buf');

var RelType = require('../../xlsx/rel-type');

var StylesXform = require('../../xlsx/xform/style/styles-xform');

var SharedStrings = require('../../utils/shared-strings');

var DefinedNames = require('../../doc/defined-names');

var CoreXform = require('../../xlsx/xform/core/core-xform');

var RelationshipsXform = require('../../xlsx/xform/core/relationships-xform');

var ContentTypesXform = require('../../xlsx/xform/core/content-types-xform');

var AppXform = require('../../xlsx/xform/core/app-xform');

var WorkbookXform = require('../../xlsx/xform/book/workbook-xform');

var SharedStringsXform = require('../../xlsx/xform/strings/shared-strings-xform');

var WorksheetWriter = require('./worksheet-writer');

var theme1Xml = require('../../xlsx/xml/theme1.js');

var WorkbookWriter = /*#__PURE__*/function () {
  function WorkbookWriter(options) {
    _classCallCheck(this, WorkbookWriter);

    options = options || {};
    this.created = options.created || new Date();
    this.modified = options.modified || this.created;
    this.creator = options.creator || 'ExcelJS';
    this.lastModifiedBy = options.lastModifiedBy || 'ExcelJS';
    this.lastPrinted = options.lastPrinted; // using shared strings creates a smaller xlsx file but may use more memory

    this.useSharedStrings = options.useSharedStrings || false;
    this.sharedStrings = new SharedStrings(); // style manager

    this.styles = options.useStyles ? new StylesXform(true) : new StylesXform.Mock(true); // defined names

    this._definedNames = new DefinedNames();
    this._worksheets = [];
    this.views = [];
    this.zipOptions = options.zip;
    this.media = [];
    this.commentRefs = [];
    this.zip = Archiver('zip', this.zipOptions);

    if (options.stream) {
      this.stream = options.stream;
    } else if (options.filename) {
      this.stream = fs.createWriteStream(options.filename);
    } else {
      this.stream = new StreamBuf();
    }

    this.zip.pipe(this.stream); // these bits can be added right now

    this.promise = Promise.all([this.addThemes(), this.addOfficeRels()]);
  }

  _createClass(WorkbookWriter, [{
    key: "_openStream",
    value: function _openStream(path) {
      var stream = new StreamBuf({
        bufSize: 65536,
        batch: true
      });
      this.zip.append(stream, {
        name: path
      });
      stream.on('finish', function () {
        stream.emit('zipped');
      });
      return stream;
    }
  }, {
    key: "_commitWorksheets",
    value: function _commitWorksheets() {
      var commitWorksheet = function commitWorksheet(worksheet) {
        if (!worksheet.committed) {
          return new Promise(function (resolve) {
            worksheet.stream.on('zipped', function () {
              resolve();
            });
            worksheet.commit();
          });
        }

        return Promise.resolve();
      }; // if there are any uncommitted worksheets, commit them now and wait


      var promises = this._worksheets.map(commitWorksheet);

      if (promises.length) {
        return Promise.all(promises);
      }

      return Promise.resolve();
    }
  }, {
    key: "commit",
    value: function () {
      var _commit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.promise;

              case 2:
                _context.next = 4;
                return this.addMedia();

              case 4:
                _context.next = 6;
                return this._commitWorksheets();

              case 6:
                _context.next = 8;
                return Promise.all([this.addContentTypes(), this.addApp(), this.addCore(), this.addSharedStrings(), this.addStyles(), this.addWorkbookRels()]);

              case 8:
                _context.next = 10;
                return this.addWorkbook();

              case 10:
                return _context.abrupt("return", this._finalize());

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function commit() {
        return _commit.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: "addImage",
    value: function addImage(image) {
      var id = this.media.length;
      var medium = Object.assign({}, image, {
        type: 'image',
        name: "image".concat(id, ".").concat(image.extension)
      });
      this.media.push(medium);
      return id;
    }
  }, {
    key: "getImage",
    value: function getImage(id) {
      return this.media[id];
    }
  }, {
    key: "addWorksheet",
    value: function addWorksheet(name, options) {
      // it's possible to add a worksheet with different than default
      // shared string handling
      // in fact, it's even possible to switch it mid-sheet
      options = options || {};
      var useSharedStrings = options.useSharedStrings !== undefined ? options.useSharedStrings : this.useSharedStrings;

      if (options.tabColor) {
        // eslint-disable-next-line no-console
        console.trace('tabColor option has moved to { properties: tabColor: {...} }');
        options.properties = Object.assign({
          tabColor: options.tabColor
        }, options.properties);
      }

      var id = this.nextId;
      name = name || "sheet".concat(id);
      var worksheet = new WorksheetWriter({
        id: id,
        name: name,
        workbook: this,
        useSharedStrings: useSharedStrings,
        properties: options.properties,
        state: options.state,
        pageSetup: options.pageSetup,
        views: options.views,
        autoFilter: options.autoFilter,
        headerFooter: options.headerFooter
      });
      this._worksheets[id] = worksheet;
      return worksheet;
    }
  }, {
    key: "getWorksheet",
    value: function getWorksheet(id) {
      if (id === undefined) {
        return this._worksheets.find(function () {
          return true;
        });
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
    key: "addStyles",
    value: function addStyles() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.zip.append(_this.styles.xml, {
          name: 'xl/styles.xml'
        });

        resolve();
      });
    }
  }, {
    key: "addThemes",
    value: function addThemes() {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.zip.append(theme1Xml, {
          name: 'xl/theme/theme1.xml'
        });

        resolve();
      });
    }
  }, {
    key: "addOfficeRels",
    value: function addOfficeRels() {
      var _this3 = this;

      return new Promise(function (resolve) {
        var xform = new RelationshipsXform();
        var xml = xform.toXml([{
          Id: 'rId1',
          Type: RelType.OfficeDocument,
          Target: 'xl/workbook.xml'
        }, {
          Id: 'rId2',
          Type: RelType.CoreProperties,
          Target: 'docProps/core.xml'
        }, {
          Id: 'rId3',
          Type: RelType.ExtenderProperties,
          Target: 'docProps/app.xml'
        }]);

        _this3.zip.append(xml, {
          name: '/_rels/.rels'
        });

        resolve();
      });
    }
  }, {
    key: "addContentTypes",
    value: function addContentTypes() {
      var _this4 = this;

      return new Promise(function (resolve) {
        var model = {
          worksheets: _this4._worksheets.filter(Boolean),
          sharedStrings: _this4.sharedStrings,
          commentRefs: _this4.commentRefs,
          media: _this4.media
        };
        var xform = new ContentTypesXform();
        var xml = xform.toXml(model);

        _this4.zip.append(xml, {
          name: '[Content_Types].xml'
        });

        resolve();
      });
    }
  }, {
    key: "addMedia",
    value: function addMedia() {
      var _this5 = this;

      return Promise.all(this.media.map(function (medium) {
        if (medium.type === 'image') {
          var filename = "xl/media/".concat(medium.name);

          if (medium.filename) {
            return _this5.zip.file(medium.filename, {
              name: filename
            });
          }

          if (medium.buffer) {
            return _this5.zip.append(medium.buffer, {
              name: filename
            });
          }

          if (medium.base64) {
            var dataimg64 = medium.base64;
            var content = dataimg64.substring(dataimg64.indexOf(',') + 1);
            return _this5.zip.append(content, {
              name: filename,
              base64: true
            });
          }
        }

        throw new Error('Unsupported media');
      }));
    }
  }, {
    key: "addApp",
    value: function addApp() {
      var _this6 = this;

      return new Promise(function (resolve) {
        var model = {
          worksheets: _this6._worksheets.filter(Boolean)
        };
        var xform = new AppXform();
        var xml = xform.toXml(model);

        _this6.zip.append(xml, {
          name: 'docProps/app.xml'
        });

        resolve();
      });
    }
  }, {
    key: "addCore",
    value: function addCore() {
      var _this7 = this;

      return new Promise(function (resolve) {
        var coreXform = new CoreXform();
        var xml = coreXform.toXml(_this7);

        _this7.zip.append(xml, {
          name: 'docProps/core.xml'
        });

        resolve();
      });
    }
  }, {
    key: "addSharedStrings",
    value: function addSharedStrings() {
      var _this8 = this;

      if (this.sharedStrings.count) {
        return new Promise(function (resolve) {
          var sharedStringsXform = new SharedStringsXform();
          var xml = sharedStringsXform.toXml(_this8.sharedStrings);

          _this8.zip.append(xml, {
            name: '/xl/sharedStrings.xml'
          });

          resolve();
        });
      }

      return Promise.resolve();
    }
  }, {
    key: "addWorkbookRels",
    value: function addWorkbookRels() {
      var _this9 = this;

      var count = 1;
      var relationships = [{
        Id: "rId".concat(count++),
        Type: RelType.Styles,
        Target: 'styles.xml'
      }, {
        Id: "rId".concat(count++),
        Type: RelType.Theme,
        Target: 'theme/theme1.xml'
      }];

      if (this.sharedStrings.count) {
        relationships.push({
          Id: "rId".concat(count++),
          Type: RelType.SharedStrings,
          Target: 'sharedStrings.xml'
        });
      }

      this._worksheets.forEach(function (worksheet) {
        if (worksheet) {
          worksheet.rId = "rId".concat(count++);
          relationships.push({
            Id: worksheet.rId,
            Type: RelType.Worksheet,
            Target: "worksheets/sheet".concat(worksheet.id, ".xml")
          });
        }
      });

      return new Promise(function (resolve) {
        var xform = new RelationshipsXform();
        var xml = xform.toXml(relationships);

        _this9.zip.append(xml, {
          name: '/xl/_rels/workbook.xml.rels'
        });

        resolve();
      });
    }
  }, {
    key: "addWorkbook",
    value: function addWorkbook() {
      var zip = this.zip;
      var model = {
        worksheets: this._worksheets.filter(Boolean),
        definedNames: this._definedNames.model,
        views: this.views,
        properties: {},
        calcProperties: {}
      };
      return new Promise(function (resolve) {
        var xform = new WorkbookXform();
        xform.prepare(model);
        zip.append(xform.toXml(model), {
          name: '/xl/workbook.xml'
        });
        resolve();
      });
    }
  }, {
    key: "_finalize",
    value: function _finalize() {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        _this10.stream.on('error', reject);

        _this10.stream.on('finish', function () {
          resolve(_this10);
        });

        _this10.zip.on('error', reject);

        _this10.zip.finalize();
      });
    }
  }, {
    key: "definedNames",
    get: function get() {
      return this._definedNames;
    }
  }, {
    key: "nextId",
    get: function get() {
      // find the next unique spot to add worksheet
      var i;

      for (i = 1; i < this._worksheets.length; i++) {
        if (!this._worksheets[i]) {
          return i;
        }
      }

      return this._worksheets.length || 1;
    }
  }]);

  return WorkbookWriter;
}();

module.exports = WorkbookWriter;
//# sourceMappingURL=workbook-writer.js.map
