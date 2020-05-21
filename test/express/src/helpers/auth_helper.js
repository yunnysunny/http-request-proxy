const crypto = require('crypto');
const secret = 'DGssdgdggweeoje@%$@532';
/**
 * @param data
 * @param secret
 */
const doSign = exports.doSign = function(data) {
    const keys = Object.keys(data);
    keys.sort();
    const hash = crypto.createHmac('sha1',secret);
    const arr = [];
    let key;
    for (let i=0,len=keys.length;i<len;i++) {
        key = keys[i];
        if (key === 'sign') {
            continue;
        }
        arr.push( key + '=' + data[key]);
    }
    const str = arr.join('&');
    const sign = hash.update(str,'utf-8').digest('hex');
    return sign;
};

/**
 * @param data
 * @param app.secret
 */
exports.verifySign = function(data) {
    const sign = doSign(data);
    return sign === data.sign;
};