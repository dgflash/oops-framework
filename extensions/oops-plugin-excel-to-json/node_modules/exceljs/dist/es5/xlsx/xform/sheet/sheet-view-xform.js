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

var colCache = require('../../../utils/col-cache');

var BaseXform = require('../base-xform');

var VIEW_STATES = {
  frozen: 'frozen',
  frozenSplit: 'frozen',
  split: 'split'
};

var SheetViewXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(SheetViewXform, _BaseXform);

  var _super = _createSuper(SheetViewXform);

  function SheetViewXform() {
    _classCallCheck(this, SheetViewXform);

    return _super.apply(this, arguments);
  }

  _createClass(SheetViewXform, [{
    key: "prepare",
    value: function prepare(model) {
      switch (model.state) {
        case 'frozen':
        case 'split':
          break;

        default:
          model.state = 'normal';
          break;
      }
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode('sheetView', {
        workbookViewId: model.workbookViewId || 0
      });

      var add = function add(name, value, included) {
        if (included) {
          xmlStream.addAttribute(name, value);
        }
      };

      add('rightToLeft', '1', model.rightToLeft === true);
      add('tabSelected', '1', model.tabSelected);
      add('showRuler', '0', model.showRuler === false);
      add('showRowColHeaders', '0', model.showRowColHeaders === false);
      add('showGridLines', '0', model.showGridLines === false);
      add('zoomScale', model.zoomScale, model.zoomScale);
      add('zoomScaleNormal', model.zoomScaleNormal, model.zoomScaleNormal);
      add('view', model.style, model.style);
      var topLeftCell;
      var xSplit;
      var ySplit;
      var activePane;

      switch (model.state) {
        case 'frozen':
          xSplit = model.xSplit || 0;
          ySplit = model.ySplit || 0;
          topLeftCell = model.topLeftCell || colCache.getAddress(ySplit + 1, xSplit + 1).address;
          activePane = model.xSplit && model.ySplit && 'bottomRight' || model.xSplit && 'topRight' || 'bottomLeft';
          xmlStream.leafNode('pane', {
            xSplit: model.xSplit || undefined,
            ySplit: model.ySplit || undefined,
            topLeftCell: topLeftCell,
            activePane: activePane,
            state: 'frozen'
          });
          xmlStream.leafNode('selection', {
            pane: activePane,
            activeCell: model.activeCell,
            sqref: model.activeCell
          });
          break;

        case 'split':
          if (model.activePane === 'topLeft') {
            model.activePane = undefined;
          }

          xmlStream.leafNode('pane', {
            xSplit: model.xSplit || undefined,
            ySplit: model.ySplit || undefined,
            topLeftCell: model.topLeftCell,
            activePane: model.activePane
          });
          xmlStream.leafNode('selection', {
            pane: model.activePane,
            activeCell: model.activeCell,
            sqref: model.activeCell
          });
          break;

        case 'normal':
          if (model.activeCell) {
            xmlStream.leafNode('selection', {
              activeCell: model.activeCell,
              sqref: model.activeCell
            });
          }

          break;

        default:
          break;
      }

      xmlStream.closeNode();
    }
  }, {
    key: "parseOpen",
    value: function parseOpen(node) {
      switch (node.name) {
        case 'sheetView':
          this.sheetView = {
            workbookViewId: parseInt(node.attributes.workbookViewId, 10),
            rightToLeft: node.attributes.rightToLeft === '1',
            tabSelected: node.attributes.tabSelected === '1',
            showRuler: !(node.attributes.showRuler === '0'),
            showRowColHeaders: !(node.attributes.showRowColHeaders === '0'),
            showGridLines: !(node.attributes.showGridLines === '0'),
            zoomScale: parseInt(node.attributes.zoomScale || '100', 10),
            zoomScaleNormal: parseInt(node.attributes.zoomScaleNormal || '100', 10),
            style: node.attributes.view
          };
          this.pane = undefined;
          this.selections = {};
          return true;

        case 'pane':
          this.pane = {
            xSplit: parseInt(node.attributes.xSplit || '0', 10),
            ySplit: parseInt(node.attributes.ySplit || '0', 10),
            topLeftCell: node.attributes.topLeftCell,
            activePane: node.attributes.activePane || 'topLeft',
            state: node.attributes.state
          };
          return true;

        case 'selection':
          {
            var name = node.attributes.pane || 'topLeft';
            this.selections[name] = {
              pane: name,
              activeCell: node.attributes.activeCell
            };
            return true;
          }

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
      var model;
      var selection;

      switch (name) {
        case 'sheetView':
          if (this.sheetView && this.pane) {
            model = this.model = {
              workbookViewId: this.sheetView.workbookViewId,
              rightToLeft: this.sheetView.rightToLeft,
              state: VIEW_STATES[this.pane.state] || 'split',
              // split is default
              xSplit: this.pane.xSplit,
              ySplit: this.pane.ySplit,
              topLeftCell: this.pane.topLeftCell,
              showRuler: this.sheetView.showRuler,
              showRowColHeaders: this.sheetView.showRowColHeaders,
              showGridLines: this.sheetView.showGridLines,
              zoomScale: this.sheetView.zoomScale,
              zoomScaleNormal: this.sheetView.zoomScaleNormal
            };

            if (this.model.state === 'split') {
              model.activePane = this.pane.activePane;
            }

            selection = this.selections[this.pane.activePane];

            if (selection && selection.activeCell) {
              model.activeCell = selection.activeCell;
            }

            if (this.sheetView.style) {
              model.style = this.sheetView.style;
            }
          } else {
            model = this.model = {
              workbookViewId: this.sheetView.workbookViewId,
              rightToLeft: this.sheetView.rightToLeft,
              state: 'normal',
              showRuler: this.sheetView.showRuler,
              showRowColHeaders: this.sheetView.showRowColHeaders,
              showGridLines: this.sheetView.showGridLines,
              zoomScale: this.sheetView.zoomScale,
              zoomScaleNormal: this.sheetView.zoomScaleNormal
            };
            selection = this.selections.topLeft;

            if (selection && selection.activeCell) {
              model.activeCell = selection.activeCell;
            }

            if (this.sheetView.style) {
              model.style = this.sheetView.style;
            }
          }

          return false;

        default:
          return true;
      }
    }
  }, {
    key: "reconcile",
    value: function reconcile() {}
  }, {
    key: "tag",
    get: function get() {
      return 'sheetView';
    }
  }]);

  return SheetViewXform;
}(BaseXform);

module.exports = SheetViewXform;
//# sourceMappingURL=sheet-view-xform.js.map
