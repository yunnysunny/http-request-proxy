const slogger = require('node-slogger');


slogger.init({
    flushInterval:500,
});
exports.slogger = slogger;

exports.HEADER_SEQ_NUM = 'seq-num';
exports.HEADER_REQ_NUM = 'req-id';
exports.TIMEOUT_PROXY = 1000;
exports.NOT_SUPPORT_URL = '/not-support';
