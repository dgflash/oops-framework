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

/* eslint-disable max-classes-per-file */
var BaseXform = require('../base-xform');

var ColorXform = require('./color-xform');

var StopXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(StopXform, _BaseXform);

  var _super = _createSuper(StopXform);

  function StopXform() {
    var _this;

    _classCallCheck(this, StopXform);

    _this = _super.call(this);
    _this.map = {
      color: new ColorXform()
    };
    return _this;
  }

  _createClass(StopXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('stop');
      xmlStream.addAttribute('position', model.position);
      this.map.color.render(xmlStream, model.color);
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
        case 'stop':
          this.model = {
            position: parseFloat(node.attributes.position)
          };
          return true;

        case 'color':
          this.parser = this.map.color;
          this.parser.parseOpen(node);
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "parseText",
    value: function parseText() {}
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model.color = this.parser.model;
          this.parser = undefined;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "tag",
    get: function get() {
      return 'stop';
    }
  }]);

  return StopXform;
}(BaseXform);

var PatternFillXform = /*#__PURE__*/function (_BaseXform2) {
  _inherits(PatternFillXform, _BaseXform2);

  var _super2 = _createSuper(PatternFillXform);

  function PatternFillXform() {
    var _this2;

    _classCallCheck(this, PatternFillXform);

    _this2 = _super2.call(this);
    _this2.map = {
      fgColor: new ColorXform('fgColor'),
      bgColor: new ColorXform('bgColor')
    };
    return _this2;
  }

  _createClass(PatternFillXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('patternFill');
      xmlStream.addAttribute('patternType', model.pattern);

      if (model.fgColor) {
        this.map.fgColor.render(xmlStream, model.fgColor);
      }

      if (model.bgColor) {
        this.map.bgColor.render(xmlStream, model.bgColor);
      }

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
        case 'patternFill':
          this.model = {
            type: 'pattern',
            pattern: node.attributes.patternType
          };
          return true;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
            return true;
          }

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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          if (this.parser.model) {
            this.model[name] = this.parser.model;
          }

          this.parser = undefined;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "name",
    get: function get() {
      return 'pattern';
    }
  }, {
    key: "tag",
    get: function get() {
      return 'patternFill';
    }
  }]);

  return PatternFillXform;
}(BaseXform);

var GradientFillXform = /*#__PURE__*/function (_BaseXform3) {
  _inherits(GradientFillXform, _BaseXform3);

  var _super3 = _createSuper(GradientFillXform);

  function GradientFillXform() {
    var _this3;

    _classCallCheck(this, GradientFillXform);

    _this3 = _super3.call(this);
    _this3.map = {
      stop: new StopXform()
    }; // if (model) {
    //   this.gradient = model.gradient;
    //   if (model.center) {
    //     this.center = model.center;
    //   }
    //   if (model.degree !== undefined) {
    //     this.degree = model.degree;
    //   }
    //   this.stops = model.stops.map(function(stop) { return new StopXform(stop); });
    // } else {
    //   this.stops = [];
    // }

    return _this3;
  }

  _createClass(GradientFillXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('gradientFill');

      switch (model.gradient) {
        case 'angle':
          xmlStream.addAttribute('degree', model.degree);
          break;

        case 'path':
          xmlStream.addAttribute('type', 'path');

          if (model.center.left) {
            xmlStream.addAttribute('left', model.center.left);

            if (model.center.right === undefined) {
              xmlStream.addAttribute('right', model.center.left);
            }
          }

          if (model.center.right) {
            xmlStream.addAttribute('right', model.center.right);
          }

          if (model.center.top) {
            xmlStream.addAttribute('top', model.center.top);

            if (model.center.bottom === undefined) {
              xmlStream.addAttribute('bottom', model.center.top);
            }
          }

          if (model.center.bottom) {
            xmlStream.addAttribute('bottom', model.center.bottom);
          }

          break;

        default:
          break;
      }

      var stopXform = this.map.stop;
      model.stops.forEach(function (stopModel) {
        stopXform.render(xmlStream, stopModel);
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
        case 'gradientFill':
          {
            var model = this.model = {
              stops: []
            };

            if (node.attributes.degree) {
              model.gradient = 'angle';
              model.degree = parseInt(node.attributes.degree, 10);
            } else if (node.attributes.type === 'path') {
              model.gradient = 'path';
              model.center = {
                left: node.attributes.left ? parseFloat(node.attributes.left) : 0,
                top: node.attributes.top ? parseFloat(node.attributes.top) : 0
              };

              if (node.attributes.right !== node.attributes.left) {
                model.center.right = node.attributes.right ? parseFloat(node.attributes.right) : 0;
              }

              if (node.attributes.bottom !== node.attributes.top) {
                model.center.bottom = node.attributes.bottom ? parseFloat(node.attributes.bottom) : 0;
              }
            }

            return true;
          }

        case 'stop':
          this.parser = this.map.stop;
          this.parser.parseOpen(node);
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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model.stops.push(this.parser.model);
          this.parser = undefined;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "name",
    get: function get() {
      return 'gradient';
    }
  }, {
    key: "tag",
    get: function get() {
      return 'gradientFill';
    }
  }]);

  return GradientFillXform;
}(BaseXform); // Fill encapsulates translation from fill model to/from xlsx


var FillXform = /*#__PURE__*/function (_BaseXform4) {
  _inherits(FillXform, _BaseXform4);

  var _super4 = _createSuper(FillXform);

  function FillXform() {
    var _this4;

    _classCallCheck(this, FillXform);

    _this4 = _super4.call(this);
    _this4.map = {
      patternFill: new PatternFillXform(),
      gradientFill: new GradientFillXform()
    };
    return _this4;
  }

  _createClass(FillXform, [{
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.addRollback();
      xmlStream.openNode('fill');

      switch (model.type) {
        case 'pattern':
          this.map.patternFill.render(xmlStream, model);
          break;

        case 'gradient':
          this.map.gradientFill.render(xmlStream, model);
          break;

        default:
          xmlStream.rollback();
          return;
      }

      xmlStream.closeNode();
      xmlStream.commit();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      switch (node.name) {
        case 'fill':
          this.model = {};
          return true;

        default:
          this.parser = this.map[node.name];

          if (this.parser) {
            this.parser.parseOpen(node);
            return true;
          }

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
      if (this.parser) {
        if (!this.parser.parseClose(name)) {
          this.model = this.parser.model;
          this.model.type = this.parser.name;
          this.parser = undefined;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "validStyle",
    value: function validStyle(value) {
      return FillXform.validPatternValues[value];
    }
  }, {
    key: "tag",
    get: function get() {
      return 'fill';
    }
  }]);

  return FillXform;
}(BaseXform);

FillXform.validPatternValues = ['none', 'solid', 'darkVertical', 'darkGray', 'mediumGray', 'lightGray', 'gray125', 'gray0625', 'darkHorizontal', 'darkVertical', 'darkDown', 'darkUp', 'darkGrid', 'darkTrellis', 'lightHorizontal', 'lightVertical', 'lightDown', 'lightUp', 'lightGrid', 'lightTrellis', 'lightGrid'].reduce(function (p, v) {
  p[v] = true;
  return p;
}, {});
FillXform.StopXform = StopXform;
FillXform.PatternFillXform = PatternFillXform;
FillXform.GradientFillXform = GradientFillXform;
module.exports = FillXform;
//# sourceMappingURL=fill-xform.js.map
