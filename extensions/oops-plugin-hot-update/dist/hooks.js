"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.onAfterMake = exports.onBeforeMake = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuild = exports.unload = exports.load = exports.throwError = exports.PACKAGE_NAME = void 0;
const HotUpdate_1 = require("./HotUpdate");
exports.PACKAGE_NAME = 'oops-plugin-hot-update';
function log(...arg) {
    return console.log(`[${exports.PACKAGE_NAME}] `, ...arg);
}
let allAssets = [];
exports.throwError = true;
const load = function () {
    return __awaiter(this, void 0, void 0, function* () {
        log(`热更新插件加载`);
        allAssets = yield Editor.Message.request('asset-db', 'query-assets');
    });
};
exports.load = load;
const unload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        log(`热更新插件卸载`);
    });
};
exports.unload = unload;
const onBeforeBuild = function (options) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.onBeforeBuild = onBeforeBuild;
const onBeforeCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.onBeforeCompressSettings = onBeforeCompressSettings;
const onAfterCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.onAfterCompressSettings = onAfterCompressSettings;
const onBeforeMake = function (root, options) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.onBeforeMake = onBeforeMake;
const onAfterMake = function (root, options) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.onAfterMake = onAfterMake;
const onAfterBuild = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // hotUpdateInit(options);
        // hotUpdateMainJs(options);
        // hotUpdateManifest(options);
        HotUpdate_1.hot.create(options);
    });
};
exports.onAfterBuild = onAfterBuild;
