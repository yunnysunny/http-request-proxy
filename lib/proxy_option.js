/** All default option key */
const OPTION_KEYS = [
    'urlsToProxy',
    'onError',
    'dataPrepare',
    'headerPrepare',
    'beforeRequest',
    'afterRequest',
    'beforeParser',
    'jsonDisabled',
    'timeout',
];
/** The part of option default */
const DEFAULT_OPTION = {
    // eslint-disable-next-line no-unused-vars
    onError: function(err, agentUrl) {},
    dataPrepare: function(data) {return data; },
    // eslint-disable-next-line no-unused-vars
    headerPrepare: function(req) { return {}; },
    beforeRequest: function() {},
    afterRequest: function() {},
    beforeParser: false,
    jsonDisabled: false,
    timeout: 10000,
};

/**
 * To create new option Object to avoid the reference coverage by using the args
 * @param  {...any} args 
 */
function makeOption(...args) {
    return Object.assign({}, DEFAULT_OPTION, ...args);
}
module.exports = {
    DEFAULT_OPTION,
    OPTION_KEYS,
    makeOption,
};