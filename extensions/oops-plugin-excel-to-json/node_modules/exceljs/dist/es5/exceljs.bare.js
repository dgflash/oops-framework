"use strict";

// this bundle is built without polyfill leaving apps the freedom to add their own
var ExcelJS = {
  Workbook: require('./doc/workbook')
}; // Object.assign mono-fill

var Enums = require('./doc/enums');

Object.keys(Enums).forEach(function (key) {
  ExcelJS[key] = Enums[key];
});
module.exports = ExcelJS;
//# sourceMappingURL=exceljs.bare.js.map
