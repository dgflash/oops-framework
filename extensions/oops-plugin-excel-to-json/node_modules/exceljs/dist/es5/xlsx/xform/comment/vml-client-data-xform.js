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

var BaseXform = require('../base-xform');

var VmlAnchorXform = require('./vml-anchor-xform');

var VmlProtectionXform = require('./style/vml-protection-xform');

var VmlPositionXform = require('./style/vml-position-xform');

var POSITION_TYPE = ['twoCells', 'oneCells', 'absolute'];

var VmlClientDataXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(VmlClientDataXform, _BaseXform);

  var _super = _createSuper(VmlClientDataXform);

  function VmlClientDataXform() {
    var _this;

    _classCallCheck(this, VmlClientDataXform);

    _this = _super.call(this);
    _this.map = {
      'x:Anchor': new VmlAnchorXform(),
      'x:Locked': new VmlProtectionXform({
        tag: 'x:Locked'
      }),
      'x:LockText': new VmlProtectionXform({
        tag: 'x:LockText'
      }),
      'x:SizeWithCells': new VmlPositionXform({
        tag: 'x:SizeWithCells'
      }),
      'x:MoveWithCells': new VmlPositionXform({
        tag: 'x:MoveWithCells'
      })
    };
    return _this;
  }

  _createClass(VmlClientDataXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      var _model$note = model.note,
          protection = _model$note.protection,
          editAs = _model$note.editAs;
      xmlStream.openNode(this.tag, {
        ObjectType: 'Note'
      });
      this.map['x:MoveWithCells'].render(xmlStream, editAs, POSITION_TYPE);
      this.map['x:SizeWithCells'].render(xmlStream, editAs, POSITION_TYPE);
      this.map['x:Anchor'].render(xmlStream, model);
      this.map['x:Locked'].render(xmlStream, protection.locked);
      xmlStream.leafNode('x:AutoFill', null, 'False');
      this.map['x:LockText'].render(xmlStream, protection.lockText);
      xmlStream.leafNode('x:Row', null, model.refAddress.row - 1);
      xmlStream.leafNode('x:Column', null, model.refAddress.col - 1);
      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case this.tag:
          this.reset();
          this.model = {
            anchor: [],
            protection: {},
            editAs: ''
          };
          break;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
          }

          break;
      }

      return true;
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
          this.parser = undefined;
        }

        return true;
      }

      switch (name) {
        case this.tag:
          this.normalizeModel();
          return false;

        default:
          return true;
      }
    }
  }, {
    key: "normalizeModel",
    value: function normalizeModel() {
      var position = Object.assign({}, this.map['x:MoveWithCells'].model, this.map['x:SizeWithCells'].model);
      var len = Object.keys(position).length;
      this.model.editAs = POSITION_TYPE[len];
      this.model.anchor = this.map['x:Anchor'].text;
      this.model.protection.locked = this.map['x:Locked'].text;
      this.model.protection.lockText = this.map['x:LockText'].text;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'x:ClientData';
    }
  }]);

  return VmlClientDataXform;
}(BaseXform);

module.exports = VmlClientDataXform;
//# sourceMappingURL=vml-client-data-xform.js.map
