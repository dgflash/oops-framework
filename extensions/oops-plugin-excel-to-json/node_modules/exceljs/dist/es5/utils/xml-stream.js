"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('./under-dash');

var utils = require('./utils'); // constants


var OPEN_ANGLE = '<';
var CLOSE_ANGLE = '>';
var OPEN_ANGLE_SLASH = '</';
var CLOSE_SLASH_ANGLE = '/>';
var EQUALS_QUOTE = '="';
var QUOTE = '"';
var SPACE = ' ';

function pushAttribute(xml, name, value) {
  xml.push(SPACE);
  xml.push(name);
  xml.push(EQUALS_QUOTE);
  xml.push(utils.xmlEncode(value.toString()));
  xml.push(QUOTE);
}

function pushAttributes(xml, attributes) {
  if (attributes) {
    _.each(attributes, function (value, name) {
      if (value !== undefined) {
        pushAttribute(xml, name, value);
      }
    });
  }
}

var XmlStream = /*#__PURE__*/function () {
  function XmlStream() {
    _classCallCheck(this, XmlStream);

    this._xml = [];
    this._stack = [];
    this._rollbacks = [];
  }

  _createClass(XmlStream, [{
    key: "openXml",
    value: function openXml(docAttributes) {
      var xml = this._xml; // <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

      xml.push('<?xml');
      pushAttributes(xml, docAttributes);
      xml.push('?>\n');
    }
  }, {
    key: "openNode",
    value: function openNode(name, attributes) {
      var parent = this.tos;
      var xml = this._xml;

      if (parent && this.open) {
        xml.push(CLOSE_ANGLE);
      }

      this._stack.push(name); // start streaming node


      xml.push(OPEN_ANGLE);
      xml.push(name);
      pushAttributes(xml, attributes);
      this.leaf = true;
      this.open = true;
    }
  }, {
    key: "addAttribute",
    value: function addAttribute(name, value) {
      if (!this.open) {
        throw new Error('Cannot write attributes to node if it is not open');
      }

      if (value !== undefined) {
        pushAttribute(this._xml, name, value);
      }
    }
  }, {
    key: "addAttributes",
    value: function addAttributes(attrs) {
      if (!this.open) {
        throw new Error('Cannot write attributes to node if it is not open');
      }

      pushAttributes(this._xml, attrs);
    }
  }, {
    key: "writeText",
    value: function writeText(text) {
      var xml = this._xml;

      if (this.open) {
        xml.push(CLOSE_ANGLE);
        this.open = false;
      }

      this.leaf = false;
      xml.push(utils.xmlEncode(text.toString()));
    }
  }, {
    key: "writeXml",
    value: function writeXml(xml) {
      if (this.open) {
        this._xml.push(CLOSE_ANGLE);

        this.open = false;
      }

      this.leaf = false;

      this._xml.push(xml);
    }
  }, {
    key: "closeNode",
    value: function closeNode() {
      var node = this._stack.pop();

      var xml = this._xml;

      if (this.leaf) {
        xml.push(CLOSE_SLASH_ANGLE);
      } else {
        xml.push(OPEN_ANGLE_SLASH);
        xml.push(node);
        xml.push(CLOSE_ANGLE);
      }

      this.open = false;
      this.leaf = false;
    }
  }, {
    key: "leafNode",
    value: function leafNode(name, attributes, text) {
      this.openNode(name, attributes);

      if (text !== undefined) {
        // zeros need to be written
        this.writeText(text);
      }

      this.closeNode();
    }
  }, {
    key: "closeAll",
    value: function closeAll() {
      while (this._stack.length) {
        this.closeNode();
      }
    }
  }, {
    key: "addRollback",
    value: function addRollback() {
      this._rollbacks.push({
        xml: this._xml.length,
        stack: this._stack.length,
        leaf: this.leaf,
        open: this.open
      });

      return this.cursor;
    }
  }, {
    key: "commit",
    value: function commit() {
      this._rollbacks.pop();
    }
  }, {
    key: "rollback",
    value: function rollback() {
      var r = this._rollbacks.pop();

      if (this._xml.length > r.xml) {
        this._xml.splice(r.xml, this._xml.length - r.xml);
      }

      if (this._stack.length > r.stack) {
        this._stack.splice(r.stack, this._stack.length - r.stack);
      }

      this.leaf = r.leaf;
      this.open = r.open;
    }
  }, {
    key: "tos",
    get: function get() {
      return this._stack.length ? this._stack[this._stack.length - 1] : undefined;
    }
  }, {
    key: "cursor",
    get: function get() {
      // handy way to track whether anything has been added
      return this._xml.length;
    }
  }, {
    key: "xml",
    get: function get() {
      this.closeAll();
      return this._xml.join('');
    }
  }]);

  return XmlStream;
}();

XmlStream.StdDocAttributes = {
  version: '1.0',
  encoding: 'UTF-8',
  standalone: 'yes'
};
module.exports = XmlStream;
//# sourceMappingURL=xml-stream.js.map
