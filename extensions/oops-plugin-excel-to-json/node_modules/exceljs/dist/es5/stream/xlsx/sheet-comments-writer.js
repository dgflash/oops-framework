"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var XmlStream = require('../../utils/xml-stream');

var RelType = require('../../xlsx/rel-type');

var colCache = require('../../utils/col-cache');

var CommentXform = require('../../xlsx/xform/comment/comment-xform');

var VmlShapeXform = require('../../xlsx/xform/comment/vml-shape-xform');

var SheetCommentsWriter = /*#__PURE__*/function () {
  function SheetCommentsWriter(worksheet, sheetRelsWriter, options) {
    _classCallCheck(this, SheetCommentsWriter);

    // in a workbook, each sheet will have a number
    this.id = options.id;
    this.count = 0;
    this._worksheet = worksheet;
    this._workbook = options.workbook;
    this._sheetRelsWriter = sheetRelsWriter;
  }

  _createClass(SheetCommentsWriter, [{
    key: "_addRelationships",
    value: function _addRelationships() {
      var commentRel = {
        Type: RelType.Comments,
        Target: "../comments".concat(this.id, ".xml")
      };

      this._sheetRelsWriter.addRelationship(commentRel);

      var vmlDrawingRel = {
        Type: RelType.VmlDrawing,
        Target: "../drawings/vmlDrawing".concat(this.id, ".vml")
      };
      this.vmlRelId = this._sheetRelsWriter.addRelationship(vmlDrawingRel);
    }
  }, {
    key: "_addCommentRefs",
    value: function _addCommentRefs() {
      this._workbook.commentRefs.push({
        commentName: "comments".concat(this.id),
        vmlDrawing: "vmlDrawing".concat(this.id)
      });
    }
  }, {
    key: "_writeOpen",
    value: function _writeOpen() {
      this.commentsStream.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' + '<authors><author>Author</author></authors>' + '<commentList>');
      this.vmlStream.write('<?xml version="1.0" encoding="UTF-8"?>' + '<xml xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:x="urn:schemas-microsoft-com:office:excel">' + '<o:shapelayout v:ext="edit">' + '<o:idmap v:ext="edit" data="1" />' + '</o:shapelayout>' + '<v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">' + '<v:stroke joinstyle="miter" />' + '<v:path gradientshapeok="t" o:connecttype="rect" />' + '</v:shapetype>');
    }
  }, {
    key: "_writeComment",
    value: function _writeComment(comment, index) {
      var commentXform = new CommentXform();
      var commentsXmlStream = new XmlStream();
      commentXform.render(commentsXmlStream, comment);
      this.commentsStream.write(commentsXmlStream.xml);
      var vmlShapeXform = new VmlShapeXform();
      var vmlXmlStream = new XmlStream();
      vmlShapeXform.render(vmlXmlStream, comment, index);
      this.vmlStream.write(vmlXmlStream.xml);
    }
  }, {
    key: "_writeClose",
    value: function _writeClose() {
      this.commentsStream.write('</commentList></comments>');
      this.vmlStream.write('</xml>');
    }
  }, {
    key: "addComments",
    value: function addComments(comments) {
      var _this = this;

      if (comments && comments.length) {
        if (!this.startedData) {
          this._worksheet.comments = [];

          this._writeOpen();

          this._addRelationships();

          this._addCommentRefs();

          this.startedData = true;
        }

        comments.forEach(function (item) {
          item.refAddress = colCache.decodeAddress(item.ref);
        });
        comments.forEach(function (comment) {
          _this._writeComment(comment, _this.count);

          _this.count += 1;
        });
      }
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.count) {
        this._writeClose();

        this.commentsStream.end();
        this.vmlStream.end();
      }
    }
  }, {
    key: "commentsStream",
    get: function get() {
      if (!this._commentsStream) {
        // eslint-disable-next-line no-underscore-dangle
        this._commentsStream = this._workbook._openStream("/xl/comments".concat(this.id, ".xml"));
      }

      return this._commentsStream;
    }
  }, {
    key: "vmlStream",
    get: function get() {
      if (!this._vmlStream) {
        // eslint-disable-next-line no-underscore-dangle
        this._vmlStream = this._workbook._openStream("xl/drawings/vmlDrawing".concat(this.id, ".vml"));
      }

      return this._vmlStream;
    }
  }]);

  return SheetCommentsWriter;
}();

module.exports = SheetCommentsWriter;
//# sourceMappingURL=sheet-comments-writer.js.map
