"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var utils = require('../../../utils/utils');

var BaseXform = require('../base-xform');

var Range = require('../../../doc/range');

var Enums = require('../../../doc/enums');

var RichTextXform = require('../strings/rich-text-xform');

function getValueType(v) {
  if (v === null || v === undefined) {
    return Enums.ValueType.Null;
  }

  if (v instanceof String || typeof v === 'string') {
    return Enums.ValueType.String;
  }

  if (typeof v === 'number') {
    return Enums.ValueType.Number;
  }

  if (typeof v === 'boolean') {
    return Enums.ValueType.Boolean;
  }

  if (v instanceof Date) {
    return Enums.ValueType.Date;
  }

  if (v.text && v.hyperlink) {
    return Enums.ValueType.Hyperlink;
  }

  if (v.formula) {
    return Enums.ValueType.Formula;
  }

  if (v.error) {
    return Enums.ValueType.Error;
  }

  throw new Error('I could not understand type of value');
}

function getEffectiveCellType(cell) {
  switch (cell.type) {
    case Enums.ValueType.Formula:
      return getValueType(cell.result);

    default:
      return cell.type;
  }
}

var CellXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(CellXform, _BaseXform);

  var _super = _createSuper(CellXform);

  function CellXform() {
    var _this;

    _classCallCheck(this, CellXform);

    _this = _super.call(this);
    _this.richTextXForm = new RichTextXform();
    return _this;
  }

  _createClass(CellXform, [{
    key: "prepare",
    value: function prepare(model, options) {
      var styleId = options.styles.addStyleModel(model.style || {}, getEffectiveCellType(model));

      if (styleId) {
        model.styleId = styleId;
      }

      if (model.comment) {
        options.comments.push(_objectSpread(_objectSpread({}, model.comment), {}, {
          ref: model.address
        }));
      }

      switch (model.type) {
        case Enums.ValueType.String:
        case Enums.ValueType.RichText:
          if (options.sharedStrings) {
            model.ssId = options.sharedStrings.add(model.value);
          }

          break;

        case Enums.ValueType.Date:
          if (options.date1904) {
            model.date1904 = true;
          }

          break;

        case Enums.ValueType.Hyperlink:
          if (options.sharedStrings && model.text !== undefined && model.text !== null) {
            model.ssId = options.sharedStrings.add(model.text);
          }

          options.hyperlinks.push({
            address: model.address,
            target: model.hyperlink,
            tooltip: model.tooltip
          });
          break;

        case Enums.ValueType.Merge:
          options.merges.add(model);
          break;

        case Enums.ValueType.Formula:
          if (options.date1904) {
            // in case valueType is date
            model.date1904 = true;
          }

          if (model.shareType === 'shared') {
            model.si = options.siFormulae++;
          }

          if (model.formula) {
            options.formulae[model.address] = model;
          } else if (model.sharedFormula) {
            var master = options.formulae[model.sharedFormula];

            if (!master) {
              throw new Error("Shared Formula master must exist above and or left of clone for cell ".concat(model.address));
            }

            if (master.si === undefined) {
              master.shareType = 'shared';
              master.si = options.siFormulae++;
              master.range = new Range(master.address, model.address);
            } else if (master.range) {
              master.range.expandToAddress(model.address);
            }

            model.si = master.si;
          }

          break;

        default:
          break;
      }
    }
  }, {
    key: "renderFormula",
    value: function renderFormula(xmlStream, model) {
      var attrs = null;

      switch (model.shareType) {
        case 'shared':
          attrs = {
            t: 'shared',
            ref: model.ref || model.range.range,
            si: model.si
          };
          break;

        case 'array':
          attrs = {
            t: 'array',
            ref: model.ref
          };
          break;

        default:
          if (model.si !== undefined) {
            attrs = {
              t: 'shared',
              si: model.si
            };
          }

          break;
      }

      switch (getValueType(model.result)) {
        case Enums.ValueType.Null:
          // ?
          xmlStream.leafNode('f', attrs, model.formula);
          break;

        case Enums.ValueType.String:
          // oddly, formula results don't ever use shared strings
          xmlStream.addAttribute('t', 'str');
          xmlStream.leafNode('f', attrs, model.formula);
          xmlStream.leafNode('v', null, model.result);
          break;

        case Enums.ValueType.Number:
          xmlStream.leafNode('f', attrs, model.formula);
          xmlStream.leafNode('v', null, model.result);
          break;

        case Enums.ValueType.Boolean:
          xmlStream.addAttribute('t', 'b');
          xmlStream.leafNode('f', attrs, model.formula);
          xmlStream.leafNode('v', null, model.result ? 1 : 0);
          break;

        case Enums.ValueType.Error:
          xmlStream.addAttribute('t', 'e');
          xmlStream.leafNode('f', attrs, model.formula);
          xmlStream.leafNode('v', null, model.result.error);
          break;

        case Enums.ValueType.Date:
          xmlStream.leafNode('f', attrs, model.formula);
          xmlStream.leafNode('v', null, utils.dateToExcel(model.result, model.date1904));
          break;
        // case Enums.ValueType.Hyperlink: // ??
        // case Enums.ValueType.Formula:

        default:
          throw new Error('I could not understand type of value');
      }
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      var _this2 = this;

      if (model.type === Enums.ValueType.Null && !model.styleId) {
        // if null and no style, exit
        return;
      }

      xmlStream.openNode('c');
      xmlStream.addAttribute('r', model.address);

      if (model.styleId) {
        xmlStream.addAttribute('s', model.styleId);
      }

      switch (model.type) {
        case Enums.ValueType.Null:
          break;

        case Enums.ValueType.Number:
          xmlStream.leafNode('v', null, model.value);
          break;

        case Enums.ValueType.Boolean:
          xmlStream.addAttribute('t', 'b');
          xmlStream.leafNode('v', null, model.value ? '1' : '0');
          break;

        case Enums.ValueType.Error:
          xmlStream.addAttribute('t', 'e');
          xmlStream.leafNode('v', null, model.value.error);
          break;

        case Enums.ValueType.String:
        case Enums.ValueType.RichText:
          if (model.ssId !== undefined) {
            xmlStream.addAttribute('t', 's');
            xmlStream.leafNode('v', null, model.ssId);
          } else if (model.value && model.value.richText) {
            xmlStream.addAttribute('t', 'inlineStr');
            xmlStream.openNode('is');
            model.value.richText.forEach(function (text) {
              _this2.richTextXForm.render(xmlStream, text);
            });
            xmlStream.closeNode('is');
          } else {
            xmlStream.addAttribute('t', 'str');
            xmlStream.leafNode('v', null, model.value);
          }

          break;

        case Enums.ValueType.Date:
          xmlStream.leafNode('v', null, utils.dateToExcel(model.value, model.date1904));
          break;

        case Enums.ValueType.Hyperlink:
          if (model.ssId !== undefined) {
            xmlStream.addAttribute('t', 's');
            xmlStream.leafNode('v', null, model.ssId);
          } else {
            xmlStream.addAttribute('t', 'str');
            xmlStream.leafNode('v', null, model.text);
          }

          break;

        case Enums.ValueType.Formula:
          this.renderFormula(xmlStream, model);
          break;

        case Enums.ValueType.Merge:
          // nothing to add
          break;

        default:
          break;
      }

      xmlStream.closeNode(); // </c>
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      if (this.parser) {
        this.parser.parseOpen(node);
        return true;
      }

      switch (node.name) {
        case 'c':
          // const address = colCache.decodeAddress(node.attributes.r);
          this.model = {
            address: node.attributes.r
          };
          this.t = node.attributes.t;

          if (node.attributes.s) {
            this.model.styleId = parseInt(node.attributes.s, 10);
          }

          return true;

        case 'f':
          this.currentNode = 'f';
          this.model.si = node.attributes.si;
          this.model.shareType = node.attributes.t;
          this.model.ref = node.attributes.ref;
          return true;

        case 'v':
          this.currentNode = 'v';
          return true;

        case 't':
          this.currentNode = 't';
          return true;

        case 'r':
          this.parser = this.richTextXForm;
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
        return;
      }

      switch (this.currentNode) {
        case 'f':
          this.model.formula = this.model.formula ? this.model.formula + text : text;
          break;

        case 'v':
        case 't':
          if (this.model.value && this.model.value.richText) {
            this.model.value.richText.text = this.model.value.richText.text ? this.model.value.richText.text + text : text;
          } else {
            this.model.value = this.model.value ? this.model.value + text : text;
          }

          break;

        default:
          break;
      }
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      switch (name) {
        case 'c':
          {
            var model = this.model; // first guess on cell type

            if (model.formula || model.shareType) {
              model.type = Enums.ValueType.Formula;

              if (model.value) {
                if (this.t === 'str') {
                  model.result = utils.xmlDecode(model.value);
                } else if (this.t === 'b') {
                  model.result = parseInt(model.value, 10) !== 0;
                } else if (this.t === 'e') {
                  model.result = {
                    error: model.value
                  };
                } else {
                  model.result = parseFloat(model.value);
                }

                model.value = undefined;
              }
            } else if (model.value !== undefined) {
              switch (this.t) {
                case 's':
                  model.type = Enums.ValueType.String;
                  model.value = parseInt(model.value, 10);
                  break;

                case 'str':
                  model.type = Enums.ValueType.String;
                  model.value = utils.xmlDecode(model.value);
                  break;

                case 'inlineStr':
                  model.type = Enums.ValueType.String;
                  break;

                case 'b':
                  model.type = Enums.ValueType.Boolean;
                  model.value = parseInt(model.value, 10) !== 0;
                  break;

                case 'e':
                  model.type = Enums.ValueType.Error;
                  model.value = {
                    error: model.value
                  };
                  break;

                default:
                  model.type = Enums.ValueType.Number;
                  model.value = parseFloat(model.value);
                  break;
              }
            } else if (model.styleId) {
              model.type = Enums.ValueType.Null;
            } else {
              model.type = Enums.ValueType.Merge;
            }

            return false;
          }

        case 'f':
        case 'v':
        case 'is':
          this.currentNode = undefined;
          return true;

        case 't':
          if (this.parser) {
            this.parser.parseClose(name);
            return true;
          }

          this.currentNode = undefined;
          return true;

        case 'r':
          this.model.value = this.model.value || {};
          this.model.value.richText = this.model.value.richText || [];
          this.model.value.richText.push(this.parser.model);
          this.parser = undefined;
          this.currentNode = undefined;
          return true;

        default:
          if (this.parser) {
            this.parser.parseClose(name);
            return true;
          }

          return false;
      }
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      var style = model.styleId && options.styles && options.styles.getStyleModel(model.styleId);

      if (style) {
        model.style = style;
      }

      if (model.styleId !== undefined) {
        model.styleId = undefined;
      }

      switch (model.type) {
        case Enums.ValueType.String:
          if (typeof model.value === 'number') {
            if (options.sharedStrings) {
              model.value = options.sharedStrings.getString(model.value);
            }
          }

          if (model.value.richText) {
            model.type = Enums.ValueType.RichText;
          }

          break;

        case Enums.ValueType.Number:
          if (style && utils.isDateFmt(style.numFmt)) {
            model.type = Enums.ValueType.Date;
            model.value = utils.excelToDate(model.value, options.date1904);
          }

          break;

        case Enums.ValueType.Formula:
          if (model.result !== undefined && style && utils.isDateFmt(style.numFmt)) {
            model.result = utils.excelToDate(model.result, options.date1904);
          }

          if (model.shareType === 'shared') {
            if (model.ref) {
              // master
              options.formulae[model.si] = model.address;
            } else {
              // slave
              model.sharedFormula = options.formulae[model.si];
              delete model.shareType;
            }

            delete model.si;
          }

          break;

        default:
          break;
      } // look for hyperlink


      var hyperlink = options.hyperlinkMap[model.address];

      if (hyperlink) {
        if (model.type === Enums.ValueType.Formula) {
          model.text = model.result;
          model.result = undefined;
        } else {
          model.text = model.value;
          model.value = undefined;
        }

        model.type = Enums.ValueType.Hyperlink;
        model.hyperlink = hyperlink;
      }

      var comment = options.commentsMap && options.commentsMap[model.address];

      if (comment) {
        model.comment = comment;
      }
    }
  }, {
    key: "tag",
    get: function get() {
      return 'c';
    }
  }]);

  return CellXform;
}(BaseXform);

module.exports = CellXform;
//# sourceMappingURL=cell-xform.js.map
