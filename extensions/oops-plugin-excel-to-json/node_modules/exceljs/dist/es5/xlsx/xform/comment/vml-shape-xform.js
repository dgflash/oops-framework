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

var VmlTextboxXform = require('./vml-textbox-xform');

var VmlClientDataXform = require('./vml-client-data-xform');

var VmlShapeXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(VmlShapeXform, _BaseXform);

  var _super = _createSuper(VmlShapeXform);

  function VmlShapeXform() {
    var _this;

    _classCallCheck(this, VmlShapeXform);

    _this = _super.call(this);
    _this.map = {
      'v:textbox': new VmlTextboxXform(),
      'x:ClientData': new VmlClientDataXform()
    };
    return _this;
  }

  _createClass(VmlShapeXform, [{
    key: "render",
    value: function render(xmlStream, model, index) {
      xmlStream.openNode('v:shape', VmlShapeXform.V_SHAPE_ATTRIBUTES(model, index));
      xmlStream.leafNode('v:fill', {
        color2: 'infoBackground [80]'
      });
      xmlStream.leafNode('v:shadow', {
        color: 'none [81]',
        obscured: 't'
      });
      xmlStream.leafNode('v:path', {
        'o:connecttype': 'none'
      });
      this.map['v:textbox'].render(xmlStream, model);
      this.map['x:ClientData'].render(xmlStream, model);
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
        case this.tag:
          this.reset();
          this.model = {
            margins: {
              insetmode: node.attributes['o:insetmode']
            },
            anchor: '',
            editAs: '',
            protection: {}
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
          this.model.margins.inset = this.map['v:textbox'].model && this.map['v:textbox'].model.inset;
          this.model.protection = this.map['x:ClientData'].model && this.map['x:ClientData'].model.protection;
          this.model.anchor = this.map['x:ClientData'].model && this.map['x:ClientData'].model.anchor;
          this.model.editAs = this.map['x:ClientData'].model && this.map['x:ClientData'].model.editAs;
          return false;

        default:
          return true;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'v:shape';
    }
  }]);

  return VmlShapeXform;
}(BaseXform);

VmlShapeXform.V_SHAPE_ATTRIBUTES = function (model, index) {
  return {
    id: "_x0000_s".concat(1025 + index),
    type: '#_x0000_t202',
    style: 'position:absolute; margin-left:105.3pt;margin-top:10.5pt;width:97.8pt;height:59.1pt;z-index:1;visibility:hidden',
    fillcolor: 'infoBackground [80]',
    strokecolor: 'none [81]',
    'o:insetmode': model.note.margins && model.note.margins.insetmode
  };
};

module.exports = VmlShapeXform;
//# sourceMappingURL=vml-shape-xform.js.map
