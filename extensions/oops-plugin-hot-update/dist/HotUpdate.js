"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hot = void 0;
const hooks_1 = require("./hooks");
/** 本地存储文件夹名，配套框架中的热更脚本 */
var storage = "oops_framework_remote";
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var folder = null;
if (Editor.App.version.indexOf('3.5') > -1) {
    folder = "data";
}
else {
    folder = "assets";
}
class HotUpdate {
    create(options) {
        if (!this.isEnable(options))
            return;
        this.init(options);
        this.mainJs(options);
        this.manifest(options);
    }
    isEnable(options) {
        var packageOptions = options.packages[hooks_1.PACKAGE_NAME];
        if (!packageOptions.hotUpdateEnable) {
            return false;
        }
        return true;
    }
    mainJs(options) {
        var projectPath = Editor.Project.path;
        var buildPath = `${options.buildPath.replace('project:/', projectPath)}/${options.outputName}`;
        var mainScriptPath = path.resolve(`${buildPath}/${folder}/main.js`);
        var mainScript = fs.readFileSync(mainScriptPath).toString('utf-8');
        mainScript =
            `// ---- 扩展注入热更新脚本开始 ----
    jsb.fileUtils.addSearchPath(jsb.fileUtils.getWritablePath() + "${storage}", true);
    var fileList = [];
    var storagePath = "${storage}";
    var tempPath = storagePath + "_temp/";
    var baseOffset = tempPath.length;
    
    if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + 'project.manifest.temp')) {
        jsb.fileUtils.listFilesRecursively(tempPath, fileList);
        fileList.forEach(srcPath => {
            var relativePath = srcPath.substr(baseOffset);
            var dstPath = storagePath + relativePath;
            if (srcPath[srcPath.length - 1] === "/") {
                jsb.fileUtils.createDirectory(dstPath)
            }
            else {
                if (jsb.fileUtils.isFileExist(dstPath)) {
                    jsb.fileUtils.removeFile(dstPath)
                }
                jsb.fileUtils.renameFile(srcPath, dstPath);
            }
        })
        jsb.fileUtils.removeDirectory(tempPath);
    }
// ---- 扩展注入热更新脚本结束 ----` + mainScript;
        fs.writeFileSync(mainScriptPath, mainScript);
        console.log('[' + hooks_1.PACKAGE_NAME + '] 注入 main.js 成功');
    }
    init(options) {
        var projectPath = Editor.Project.path;
        var buildPath = `${options.buildPath.replace('project:/', projectPath)}/${options.outputName}`;
        var assetsRootPath = path.resolve(`${buildPath}/${folder}`);
        var projectManifestName = 'project.manifest';
        var destManifestPath = path.join(assetsRootPath, projectManifestName);
        fs.writeFileSync(destManifestPath, JSON.stringify({}));
        console.log('[' + hooks_1.PACKAGE_NAME + '] 生成 project.manifest 成功');
    }
    manifest(options) {
        var packageOptions = options.packages[hooks_1.PACKAGE_NAME];
        var remoteUrl = packageOptions.hotUpdateAddress;
        if (remoteUrl.endsWith('/')) {
            remoteUrl = remoteUrl.slice(0, -1);
        }
        // 同版本构建次数
        var hotUpdateBuildNum = !isNaN(Number(packageOptions.hotUpdateBuildNum)) ? Number(packageOptions.hotUpdateBuildNum) : 1;
        var hotUpdateVersion = `${packageOptions.hotUpdateVersion.trim()}.${hotUpdateBuildNum.toFixed()}`;
        var projectPath = Editor.Project.path;
        var buildPath = `${options.buildPath.replace('project:/', projectPath)}/${options.outputName}`;
        var assetsRootPath = path.resolve(`${buildPath}/${folder}`);
        var projectManifestName = 'project.manifest';
        var versionManifestName = 'version.manifest';
        var destManifestPath = path.join(assetsRootPath, projectManifestName);
        fs.unlinkSync(destManifestPath);
        // 构建后默认资源目录
        var assetsPaths = ['src', 'assets', 'jsb-adapter'];
        // 初始化 manifest
        var packageUrl = `${remoteUrl}/${options.platform}/${hotUpdateVersion}`;
        var manifest = {
            packageUrl: encodeURI(packageUrl),
            version: hotUpdateVersion,
            searchPaths: [storage],
            remoteManifestUrl: encodeURI(`${remoteUrl}/${options.platform}/${projectManifestName}`),
            remoteVersionUrl: encodeURI(`${remoteUrl}/${options.platform}/${versionManifestName}`),
            assets: {},
        };
        // 获取目录内所有文件
        var listDir = (assetPath) => {
            var fileList = [];
            var stat = fs.statSync(assetPath);
            if (stat.isDirectory()) {
                var subpaths = fs.readdirSync(assetPath);
                for (var i = 0; i < subpaths.length; i++) {
                    var subpath = subpaths[i];
                    if (subpath[0] === '.') {
                        continue;
                    }
                    subpath = path.join(assetPath, subpath);
                    fileList.push(...listDir(subpath));
                }
            }
            else if (stat.isFile()) {
                fileList.push({
                    filePath: assetPath,
                    size: stat.size,
                });
            }
            return fileList;
        };
        // 创建目录
        var mkdirSync = (dirName) => {
            try {
                fs.mkdirSync(dirName);
            }
            catch (e) {
                if (e.code !== 'EEXIST')
                    throw e;
            }
        };
        // 递归删除目录及文件
        var deleteDirSync = (dirName) => {
            var files = [];
            if (fs.existsSync(dirName)) {
                // 返回文件和子目录的数组
                files = fs.readdirSync(dirName);
                files.forEach((file) => {
                    var curPath = path.join(dirName, file);
                    // 同步读取文件夹文件，如果是文件夹，在重复触发函数
                    if (fs.statSync(curPath).isDirectory()) {
                        deleteDirSync(curPath);
                    }
                    else {
                        fs.unlinkSync(curPath);
                    }
                });
                // 清除文件夹
                fs.rmdirSync(dirName);
            }
        };
        // 迭代资源和源码文件夹
        var assetsList = [];
        assetsPaths.forEach((o) => {
            assetsList.push(...listDir(path.join(assetsRootPath, o)));
        });
        // 填充 manifest.assets 对象
        var md5, compressed, assetUrl;
        var assetsObj = {};
        assetsList.forEach((assetStat) => {
            md5 = crypto.createHash('md5').update(fs.readFileSync(assetStat.filePath)).digest('hex');
            compressed = path.extname(assetStat.filePath).toLowerCase() === '.zip';
            assetUrl = path.relative(assetsRootPath, assetStat.filePath);
            assetUrl = assetUrl.replace(/\\/g, '/');
            assetUrl = encodeURI(assetUrl);
            assetsObj[assetUrl] = {
                size: assetStat.size,
                md5: md5,
            };
            if (compressed) {
                assetsObj[assetUrl].compressed = true;
            }
        });
        manifest.assets = assetsObj;
        // 热更构建结果存储目录
        var hotUpdateAssetsPath = path.join(projectPath, storage);
        mkdirSync(hotUpdateAssetsPath);
        var manifestPath = path.join(hotUpdateAssetsPath, options.platform);
        mkdirSync(manifestPath);
        hotUpdateAssetsPath = path.join(manifestPath, hotUpdateVersion);
        mkdirSync(hotUpdateAssetsPath);
        // 如果目录不为空, 先清除
        deleteDirSync(hotUpdateAssetsPath);
        // 保存 project.manifest
        fs.writeFileSync(destManifestPath, JSON.stringify(manifest));
        destManifestPath = path.join(manifestPath, projectManifestName);
        fs.writeFileSync(destManifestPath, JSON.stringify(manifest));
        console.log('[' + hooks_1.PACKAGE_NAME + '] 已成功生成清单文件');
        delete manifest.assets;
        delete manifest.searchPaths;
        // 保存 version.manifest
        var destVersionPath = path.join(manifestPath, versionManifestName);
        fs.writeFileSync(destVersionPath, JSON.stringify(manifest));
        console.log('[' + hooks_1.PACKAGE_NAME + '] 已成功生成版本文件');
        // 拷贝构建后的热更资源
        assetsPaths.push(projectManifestName);
        assetsPaths.forEach((assetPath) => {
            var destPath = path.join(hotUpdateAssetsPath, assetPath);
            assetPath = path.join(assetsRootPath, assetPath);
            // 拷贝
            Build.Utils.copyDirSync(assetPath, destPath);
        });
        console.log('[' + hooks_1.PACKAGE_NAME + '] 资源拷贝完成');
    }
}
exports.hot = new HotUpdate();
