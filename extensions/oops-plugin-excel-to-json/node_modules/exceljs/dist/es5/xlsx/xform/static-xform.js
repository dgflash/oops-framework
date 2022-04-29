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

var BaseXform = require('./base-xform');

var XmlStream = require('../../utils/xml-stream'); // const model = {
//   tag: 'name',
//   $: {attr: 'value'},
//   c: [
//     { tag: 'child' }
//   ],
//   t: 'some text'
// };


function build(xmlStream, model) {
  xmlStream.openNode(model.tag, model.$);

  if (model.c) {
    model.c.forEach(function (child) {
      build(xmlStream, child);
    });
  }

  if (model.t) {
    xmlStream.writeText(model.t);
  }

  xmlStream.closeNode();
}

var StaticXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(StaticXform, _BaseXform);

  var _super = _createSuper(StaticXform);

  function StaticXform(model) {
    var _this;

    _classCallCheck(this, StaticXform);

    _this = _super.call(this); // This class is an optimisation for static (unimportant and unchanging) xml
    // It is stateless - apart from its static model and so can be used as a singleton
    // Being stateless - it will only track entry to and exit from it's root xml tag during parsing and nothing else
    // Known issues:
    //    since stateless - parseOpen always returns true. Parent xform must know when to start using this xform
    //    if the root tag is recursive, the parsing will behave unpredictably

    _this._model = model;
    return _this;
  }

  _createClass(StaticXform, [{
    key: "render",
    value: function render(xmlStream) {
      if (!this._xml) {
        var stream = new XmlStream();
        build(stream, this._model);
        this._xml = stream.xml;
      }

      xmlStream.writeXml(this._xml);
    }
  }, {
    key: "parseOpen",
    value: function parseOpen() {
      return true;
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      switch (name) {
        case this._model.tag:
          return false;

        default:
          return true;
      }
    }
  }]);

  return StaticXform;
}(BaseXform);

module.exports = StaticXform;
//# sourceMappingURL=static-xform.js.map
