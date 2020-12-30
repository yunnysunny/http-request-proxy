/**
 * Obtain obj type name
 * @param {*} obj 
 * @returns {String} 'String'/'Function'/'AsyncFunction'/'Number'/'Date'/'Null'/'Undefined'/'Object'/'Map'/'Set'
 */
const getType = exports.typeof = function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * Check obj whether it is a string type.
 * @param {*} obj 
 * @returns {Boolean} true/false
 */
exports.isString = function (obj) {
    return getType(obj) === 'String';
};

/**
 * Check obj whether it is a function type('Function'/'AsyncFunction').
 * @param {*} obj 
 * @returns {Boolean} true/false
 */
exports.isFunction = function (obj) {
    const type = getType(obj);
    return ['Function', 'AsyncFunction'].includes(type);
};