/* eslint-disable no-case-declarations */
const slogger = require('node-slogger');
const {OPTION_KEYS, makeOption} = require('./proxy_option');
const utils = require('./utils');

module.exports = function preHandle(options) {
    const {urlsToProxy, ...commonOptions} = options;
    const urlKeys = Object.keys(urlsToProxy);
    // 初始化通用代理option
    const allProxyOption = urlKeys.reduce(
        function(options, path) {
            const config = urlsToProxy[path];
            switch(utils.typeof(config)) {
            // 通用处理
            case 'String': 
            case 'Function':
            case 'AsyncFunction':
                options[path] = makeOption(commonOptions, {url: config});
                break;
                // 单个需特殊处理的路径
            case 'Object': 
                const type = utils.typeof(config.url);
                // 忽略不支持的类型
                if (!['String', 'Function', 'AsyncFunction'].includes(type)) {
                    slogger.warn(`The urlsToProxy[${path}] is unsupported type('String', 'Function', 'AsyncFunction')`);
                    break;
                }
                // 初始化单个路径的代理option
                const singleOption = makeOption(commonOptions, {url: config.url});
                for (const optionKey of OPTION_KEYS) {
                    utils.typeof(config[optionKey]) !== 'Undefined'
						&& (singleOption[optionKey] = config[optionKey]);
                }
                options[path] = singleOption;
            }
            return options;
        }, {},
    );
    return { urlKeys, allProxyOption };
};