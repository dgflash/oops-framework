
import { BuildPlugin } from '../@types';

export const load: BuildPlugin.load = function () {
    console.debug('oops-plugin-hot-update load');
};

export const unload: BuildPlugin.load = function () {
    console.debug('oops-plugin-hot-update unload');
};

export const configs: BuildPlugin.Configs = {
    '*': {
        hooks: './hooks',
        options: {
            hotUpdateEnable: {
                label: 'i18n:oops-plugin-hot-update.hotupdate_enable',
                default: false,
                render: {
                    ui: 'ui-checkbox'
                },
                verifyRules: []
            },
            hotUpdateAddress: {
                label: 'i18n:oops-plugin-hot-update.hotupdate_address',
                default: 'http://127.0.0.1',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'i18n:oops-plugin-hot-update.hotupdate_address',
                    },
                },
                verifyRules: ['http']
            },
            hotUpdateVersion: {
                label: 'i18n:oops-plugin-hot-update.hotupdate_version',
                default: '1.0.0',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'i18n:oops-plugin-hot-update.hotupdate_version',
                    },
                },
                verifyRules: ['isValidVersion']
            },
            hotUpdateBuildNum: {
                label: 'i18n:oops-plugin-hot-update.hotupdate_build_num',
                default: 1,
                render: {
                    ui: 'ui-num-input',
                    attributes: {
                        step: 1,
                        min: 1,
                        preci: 0,
                    },
                }
            }
        },
        verifyRuleMap: {
            isValidVersion: {
                message: 'i18n:oops-plugin-hot-update.hotupdate_version_verify_msg',
                func(val, option) {
                    let v = val.split('.');
                    for (var i = 0; i < v.length; i++) {
                        if (isNaN(v[i])) {
                            return false;
                        }
                    }
                    return true;
                },
            }
        },
    },
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
