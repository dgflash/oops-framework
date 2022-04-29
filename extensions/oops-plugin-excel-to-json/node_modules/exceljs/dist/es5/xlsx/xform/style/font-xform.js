'use strict';

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

var ColorXform = require('./color-xform');

var BooleanXform = require('../simple/boolean-xform');

var IntegerXform = require('../simple/integer-xform');

var StringXform = require('../simple/string-xform');

var UnderlineXform = require('./underline-xform');

var _ = require('../../../utils/under-dash');

var BaseXform = require('../base-xform'); // Font encapsulates translation from font model to xlsx


var FontXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(FontXform, _BaseXform);

  var _super = _createSuper(FontXform);

  function FontXform(options) {
    var _this;

    _classCallCheck(this, FontXform);

    _this = _super.call(this);
    _this.options = options || FontXform.OPTIONS;
    _this.map = {
      b: {
        prop: 'bold',
        xform: new BooleanXform({
          tag: 'b',
          attr: 'val'
        })
      },
      i: {
        prop: 'italic',
        xform: new BooleanXform({
          tag: 'i',
          attr: 'val'
        })
      },
      u: {
        prop: 'underline',
        xform: new UnderlineXform()
      },
      charset: {
        prop: 'charset',
        xform: new IntegerXform({
          tag: 'charset',
          attr: 'val'
        })
      },
      color: {
        prop: 'color',
        xform: new ColorXform()
      },
      condense: {
        prop: 'condense',
        xform: new BooleanXform({
          tag: 'condense',
          attr: 'val'
        })
      },
      extend: {
        prop: 'extend',
        xform: new BooleanXform({
          tag: 'extend',
          attr: 'val'
        })
      },
      family: {
        prop: 'family',
        xform: new IntegerXform({
          tag: 'family',
          attr: 'val'
        })
      },
      outline: {
        prop: 'outline',
        xform: new BooleanXform({
          tag: 'outline',
          attr: 'val'
        })
      },
      vertAlign: {
        prop: 'vertAlign',
        xform: new StringXform({
          tag: 'vertAlign',
          attr: 'val'
        })
      },
      scheme: {
        prop: 'scheme',
        xform: new StringXform({
          tag: 'scheme',
          attr: 'val'
        })
      },
      shadow: {
        prop: 'shadow',
        xform: new BooleanXform({
          tag: 'shadow',
          attr: 'val'
        })
      },
      strike: {
        prop: 'strike',
        xform: new BooleanXform({
          tag: 'strike',
          attr: 'val'
        })
      },
      sz: {
        prop: 'size',
        xform: new IntegerXform({
          tag: 'sz',
          attr: 'val'
        })
      }
    };
    _this.map[_this.options.fontNameTag] = {
      prop: 'name',
      xform: new StringXform({
        tag: _this.options.fontNameTag,
        attr: 'val'
      })
    };
    return _this;
  }

  _createClass(FontXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var map = this.map;
      xmlStream.openNode(this.options.tagName);

      _.each(this.map, function (defn, tag) {
        map[tag].xform.render(xmlStream, model[defn.prop]);
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

      if (this.map[node.name]) {
        this.parser = this.map[node.name].xform;
        return this.parser.parseOpen(node);
      }

      switch (node.name) {
        case this.options.tagName:
          this.model = {};
          return true;

        default:
          return false;
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
      if (this.parser && !this.parser.parseClose(name)) {
        var item = this.map[name];

        if (this.parser.model) {
          this.model[item.prop] = this.parser.model;
        }

        this.parser = undefined;
        return true;
      }

      switch (name) {
        case this.options.tagName:
          return false;

        default:
          return true;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return this.options.tagName;
    }
  }]);

  return FontXform;
}(BaseXform);

FontXform.OPTIONS = {
  tagName: 'font',
  fontNameTag: 'name'
};
module.exports = FontXform;
//# sourceMappingURL=font-xform.js.map
