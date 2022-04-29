"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable max-classes-per-file */
var utils = require('../../utils/utils');

var RelType = require('../../xlsx/rel-type');

var HyperlinksProxy = /*#__PURE__*/function () {
  function HyperlinksProxy(sheetRelsWriter) {
    _classCallCheck(this, HyperlinksProxy);

    this.writer = sheetRelsWriter;
  }

  _createClass(HyperlinksProxy, [{
    key: "push",
    value: function push(hyperlink) {
      this.writer.addHyperlink(hyperlink);
    }
  }]);

  return HyperlinksProxy;
}();

var SheetRelsWriter = /*#__PURE__*/function () {
  function SheetRelsWriter(options) {
    _classCallCheck(this, SheetRelsWriter);

    // in a workbook, each sheet will have a number
    this.id = options.id; // count of all relationships

    this.count = 0; // keep record of all hyperlinks

    this._hyperlinks = [];
    this._workbook = options.workbook;
  }

  _createClass(SheetRelsWriter, [{
    key: "each",
    value: function each(fn) {
      return this._hyperlinks.forEach(fn);
    }
  }, {
    key: "addHyperlink",
    value: function addHyperlink(hyperlink) {
      // Write to stream
      var relationship = {
        Target: hyperlink.target,
        Type: RelType.Hyperlink,
        TargetMode: 'External'
      };

      var rId = this._writeRelationship(relationship); // store sheet stuff for later


      this._hyperlinks.push({
        rId: rId,
        address: hyperlink.address
      });
    }
  }, {
    key: "addMedia",
    value: function addMedia(media) {
      return this._writeRelationship(media);
    }
  }, {
    key: "addRelationship",
    value: function addRelationship(rel) {
      return this._writeRelationship(rel);
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.count) {
        // write xml utro
        this._writeClose(); // and close stream


        this.stream.end();
      }
    } // ================================================================================

  }, {
    key: "_writeOpen",
    value: function _writeOpen() {
      this.stream.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n       <Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">");
    }
  }, {
    key: "_writeRelationship",
    value: function _writeRelationship(relationship) {
      if (!this.count) {
        this._writeOpen();
      }

      var rId = "rId".concat(++this.count);

      if (relationship.TargetMode) {
        this.stream.write("<Relationship Id=\"".concat(rId, "\"") + " Type=\"".concat(relationship.Type, "\"") + " Target=\"".concat(utils.xmlEncode(relationship.Target), "\"") + " TargetMode=\"".concat(relationship.TargetMode, "\"") + '/>');
      } else {
        this.stream.write("<Relationship Id=\"".concat(rId, "\" Type=\"").concat(relationship.Type, "\" Target=\"").concat(relationship.Target, "\"/>"));
      }

      return rId;
    }
  }, {
    key: "_writeClose",
    value: function _writeClose() {
      this.stream.write('</Relationships>');
    }
  }, {
    key: "stream",
    get: function get() {
      if (!this._stream) {
        // eslint-disable-next-line no-underscore-dangle
        this._stream = this._workbook._openStream("/xl/worksheets/_rels/sheet".concat(this.id, ".xml.rels"));
      }

      return this._stream;
    }
  }, {
    key: "length",
    get: function get() {
      return this._hyperlinks.length;
    }
  }, {
    key: "hyperlinksProxy",
    get: function get() {
      return this._hyperlinksProxy || (this._hyperlinksProxy = new HyperlinksProxy(this));
    }
  }]);

  return SheetRelsWriter;
}();

module.exports = SheetRelsWriter;
//# sourceMappingURL=sheet-rels-writer.js.map
