"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RichTextXform = require('../strings/rich-text-xform');

var utils = require('../../../utils/utils');

var BaseXform = require('../base-xform');
/**
  <comment ref="B1" authorId="0">
    <text>
      <r>
        <rPr>
          <b/>
          <sz val="9"/>
          <rFont val="宋体"/>
          <charset val="134"/>
        </rPr>
        <t>51422:</t>
      </r>
      <r>
        <rPr>
          <sz val="9"/>
          <rFont val="宋体"/>
          <charset val="134"/>
        </rPr>
        <t xml:space="preserve">&#10;test</t>
      </r>
    </text>
  </comment>
 */


var CommentXform = module.exports = function (model) {
  this.model = model;
};

utils.inherits(CommentXform, BaseXform, {
  get tag() {
    return 'r';
  },

  get richTextXform() {
    if (!this._richTextXform) {
      this._richTextXform = new RichTextXform();
    }

    return this._richTextXform;
  },

  render: function render(xmlStream, model) {
    var _this = this;

    model = model || this.model;
    xmlStream.openNode('comment', {
      ref: model.ref,
      authorId: 0
    });
    xmlStream.openNode('text');

    if (model && model.note && model.note.texts) {
      model.note.texts.forEach(function (text) {
        _this.richTextXform.render(xmlStream, text);
      });
    }

    xmlStream.closeNode();
    xmlStream.closeNode();
  },
  parseOpen: function parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }

    switch (node.name) {
      case 'comment':
        this.model = _objectSpread({
          type: 'note',
          note: {
            texts: []
          }
        }, node.attributes);
        return true;

      case 'r':
        this.parser = this.richTextXform;
        this.parser.parseOpen(node);
        return true;

      default:
        return false;
    }
  },
  parseText: function parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  },
  parseClose: function parseClose(name) {
    switch (name) {
      case 'comment':
        return false;

      case 'r':
        this.model.note.texts.push(this.parser.model);
        this.parser = undefined;
        return true;

      default:
        if (this.parser) {
          this.parser.parseClose(name);
        }

        return true;
    }
  }
});
//# sourceMappingURL=comment-xform.js.map
