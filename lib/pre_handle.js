const slogger = require('node-slogger');
const {OPTION_KEYS, makeOption} = require('./proxy_option');
const utils = require('./utils');
/**
 * Transform options to the map of path prefix to [CustomOptions](#CustomOptions).
 * 
 * @param { PorxyOptionsInit } options
 * @returns {{urlKeys: Array<String>, urlsToProxy: Object.<String, CustomOptions>} }
 */
module.exports = function preHandle(options) {
    const {urlsToProxy, ...commonOptions} = options;
    const urlKeys = Object.keys(urlsToProxy);
    // transform the option to the map of path prefix
    const allProxyOption = urlKeys.reduce(
        function(options, path) {
            const config = urlsToProxy[path];
            const configValueType = utils.typeof(config);
            switch(configValueType) {
            // common processor
            case 'String': 
            case 'Function':
            case 'AsyncFunction':
                options[path] = makeOption(commonOptions, {url: config});
                break;
                // special processor
            case 'Object': {
                const type = utils.typeof(config.url);
                // not supported type
                if (!['String', 'Function', 'AsyncFunction'].includes(type)) {
                    slogger.error(`The urlsToProxy[${path}] is none of supported type ('String', 'Function', 'AsyncFunction')`);
                    break;
                }
                // init special path option
                const singleOption = makeOption(commonOptions, {url: config.url});
                for (const optionKey of OPTION_KEYS) {
                    if (utils.typeof(config[optionKey]) !== 'Undefined') {
                        singleOption[optionKey] = config[optionKey];
                    }
                }
                options[path] = singleOption;
                break;
            }
            default:
                slogger.error('Not supported config value', path, config);
                break;
            }
            return options;
        }, {},
    );
    return { urlKeys, allProxyOption };
};