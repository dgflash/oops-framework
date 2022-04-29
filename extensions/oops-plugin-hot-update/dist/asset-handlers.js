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
exports.compressTextures = void 0;
const fs_extra_1 = require("fs-extra");
const compressTextures = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < Array.from(tasks).length; i++) {
        const task = Array.from(tasks)[i];
        if (task.format !== 'jpg') {
            continue;
        }
        // task.dest should change suffix before compress
        task.dest = task.dest.replace('.png', '.jpg');
        yield pngToJPG(task.src, task.dest, task.quality);
        // The compress task have done needs to be removed from the original tasks
        tasks.splice(i, 1);
    }
});
exports.compressTextures = compressTextures;
function pngToJPG(src, dest, quality) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = yield getImage(src);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', quality / 100);
        yield (0, fs_extra_1.outputFile)(dest, imageData);
        console.debug('pngToJPG', dest);
    });
}
function getImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function (err) {
            reject(err);
        };
        img.src = path.replace('#', '%23');
    });
}
