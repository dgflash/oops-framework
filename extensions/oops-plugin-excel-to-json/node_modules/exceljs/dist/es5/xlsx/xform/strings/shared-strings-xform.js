"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var XmlStream = require('../../../utils/xml-stream');

var BaseXform = require('../base-xform');

var SharedStringXform = require('./shared-string-xform');

var SharedStringsXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(SharedStringsXform, _BaseXform);

  var _super = _createSuper(SharedStringsXform);

  function SharedStringsXform(model) {
    var _this;

    _classCallCheck(this, SharedStringsXform);

    _this = _super.call(this);
    _this.model = model || {
      values: [],
      count: 0
    };
    _this.hash = Object.create(null);
    _this.rich = Object.create(null);
    return _this;
  }

  _createClass(SharedStringsXform, [{
    key: "getString",
    value: function getString(index) {
      return this.model.values[index];
    }
  }, {
    key: "add",
    value: function add(value) {
      return value.richText ? this.addRichText(value) : this.addText(value);
    }
  }, {
    key: "addText",
    value: function addText(value) {
      var index = this.hash[value];

      if (index === undefined) {
        index = this.hash[value] = this.model.values.length;
        this.model.values.push(value);
      }

      this.model.count++;
      return index;
    }
  }, {
    key: "addRichText",
    value: function addRichText(value) {
      // TODO: add WeakMap here
      var xml = this.sharedStringXform.toXml(value);
      var index = this.rich[xml];

      if (index === undefined) {
        index = this.rich[xml] = this.model.values.length;
        this.model.values.push(value);
      }

      this.model.count++;
      return index;
    } // <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    // <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="<%=totalRefs%>" uniqueCount="<%=count%>">
    //   <si><t><%=text%></t></si>
    //   <si><r><rPr></rPr><t></t></r></si>
    // </sst>

  }, {
    key: "render",
    value: function render(xmlStream, model) {
      model = model || this._values;
      xmlStream.openXml(XmlStream.StdDocAttributes);
      xmlStream.openNode('sst', {
        xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
        count: model.count,
        uniqueCount: model.values.length
      });
      var sx = this.sharedStringXform;
      model.values.forEach(function (sharedString) {
        sx.render(xmlStream, sharedString);
      });
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      switch (node.name) {
        case 'sst':
          return true;

        case 'si':
          this.parser = this.sharedStringXform;
          this.parser.parseOpen(node);
          return true;

        default:
          throw new Error("Unexpected xml node in parseOpen: ".concat(JSON.stringify(node)));
      }
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      if (this.parser) {
        this.parser.parseText(text);
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model.values.push(this.parser.model);
          this.model.count++;
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case 'sst':
          return false;

        default:
          throw new Error("Unexpected xml node in parseClose: ".concat(name));
      }
    }
  }, {
    key: "sharedStringXform",
    get: function get() {
      return this._sharedStringXform || (this._sharedStringXform = new SharedStringXform());
    }
  }, {
    key: "values",
    get: function get() {
      return this.model.values;
    }
  }, {
    key: "uniqueCount",
    get: function get() {
      return this.model.values.length;
    }
  }, {
    key: "count",
    get: function get() {
      return this.model.count;
    }
  }]);

  return SharedStringsXform;
}(BaseXform);

module.exports = SharedStringsXform;
//# sourceMappingURL=shared-strings-xform.js.map
