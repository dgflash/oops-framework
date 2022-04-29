import { BuildHook, IBuildTaskOption } from '../@types';
import { hot } from './HotUpdate';

interface IOptions {
    commonTest1: number;
    commonTest2: 'opt1' | 'opt2';
    webTestOption: boolean;
}

export const PACKAGE_NAME = 'oops-plugin-hot-update';

interface ITaskOptions extends IBuildTaskOption {
    packages: {
        'cocos-plugin-template': IOptions;
    };
}

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

let allAssets = [];

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    log(`热更新插件加载`);
    allAssets = await Editor.Message.request('asset-db', 'query-assets');
};

export const unload: BuildHook.unload = async function () {
    log(`热更新插件卸载`);
};

export const onBeforeBuild: BuildHook.onAfterBuild = async function (options) {

};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options, result) {

};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options, result) {

};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root, options) {

};

export const onAfterMake: BuildHook.onAfterMake = async function (root, options) {

};

export const onAfterBuild: BuildHook.onAfterBuild = async function (options, result) {
    // hotUpdateInit(options);
    // hotUpdateMainJs(options);
    // hotUpdateManifest(options);
    hot.create(options);
};
