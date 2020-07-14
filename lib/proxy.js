const slogger = require('node-slogger');
const request = require('request');
const http = require('http');
const https = require('https');
const fs = require('fs');
// const {checkUrl, optionProcess} = require('./util');

const checkUrl = function(req, urlsToProxy, urlKeys, callback) {
    const path = req.path;
    const prefix = urlKeys.filter(agentUrl => path.startsWith(agentUrl))[0];
    if (!prefix) {
        return callback(null);
    }
    const needAgentHost = urlsToProxy[prefix];
    if (typeof (needAgentHost) === 'string') {
        return  callback(null,needAgentHost + req.originalUrl.slice(prefix.length));
    }
    if (typeof (needAgentHost) === 'function') {
        return needAgentHost(req).then(function(realHost) {
            callback(null,realHost + req.originalUrl.slice(prefix.length));
        }).catch(function(err) {
            callback(err);
        });
    }
    return callback(new Error('not support proxy config ' + path));
};
/**
 * @function DataPrepareFunction
 * 
 * @param {Object} data The original request data, merged by querystring and body.
 * @param {http.IncomingMessage} req The http request object.
 * @returns {Object} The data after prepared.
 */

/**
  * @callback ProxyOnErrorCallback
  * 
  * @param {String} proxyUrl The backend url you proxied to 
  * @param {http.ServerResponse} res The express response object
  */

/**
 * @function HeaderPrepareFunction
 * 
 * @param {http.IncomingMessage} req The express request object.
 * @returns {Object} The headers after prepared.
 */

/**
 * @function ProxyUrlProcess
 * 
 * @param {http.IncomingMessage} req
 * 
 * @returns {Promise}
 */

/**
 * @typedef {Object} PorxyOptionsInit
 * 
 * The options for proxy request
 * 
 * @property {Object<String,String|ProxyUrlProcess>=} urlsToProxy The map of url prefix and backend base url.
 * @property {ProxyOnErrorCallback=} onError
 * @property {DataPrepareFunction=} dataPrepare
 * @property {HeaderPrepareFunction=} headerPrepare
 * @property {Boolean=} beforeParser
 * @property {Number} [timeout=10000]
 * @property {Boolean=} jsonDisabled When it set true, the type of application/json request will be transformed into application/x-www-form-urlencoded 
 */


const DEFAULT_INIT_CONFIG = {
    onError: function(err, agentUrl) {
        
    },
    dataPrepare: function(data) {
        return data;
    },
    headerPrepare: function(req) {
        return {};
    },
    timeout: 10000,
    jsonDisabled: false
};

const _cleanTmpFile = function(files) {
    const keys = Object.keys(files);
    const length = keys.length;
    for(let i=0; i<length; i++) {
        const file = files[keys[i]];
        fs.unlink(file.path, function(err) {
            if (err) {
                slogger.error('delete temporary file failed', err);
            }
        });
    }  
};

const _doProxy = function(options, agentUrl, req, res) {
    const {query, body, method} = req;
    const {
        dataPrepare, timeout, onError, headerPrepare, jsonDisabled, agent
    } = options;
    const reqOptions = {
        url: agentUrl,
        method,
        headers: {},
        timeout,
        agent
    };
    if (options.beforeParser) {
        const httpObj = agentUrl.startsWith('https://') ? https : http;
        reqOptions.headers = req.headers;
        const proxyReq = httpObj.request(agentUrl, reqOptions, function(proxyRes) {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });
        proxyReq.setNoDelay(true);
        proxyReq.setTimeout(timeout, function() {
            proxyReq.abort();
            res.status(504).end('proxy ' + agentUrl +' timeout');
        });
        proxyReq.on('error', function(err) {//TODO check
            slogger.error('proxy ' + agentUrl +' error',err);
            res.status(500).end('proxy ' + agentUrl +' error');
        });

        req.pipe(proxyReq);
        return;
    }

    const headers = Object.assign({
        'User-Agent': 'http-proxy-server'
    }, headerPrepare(req));
    reqOptions.headers = headers;
    const data = {};
    Object.assign(data, query, body);

    const dataToSend = dataPrepare(data, req);
    if(req.files) {
        const files = req.files;
        const keys = Object.keys(files);
        const length = keys.length;
        for(let i=0; i<length; i++) {
            const file = files[keys[i]];
            dataToSend[file.fieldName] = {
                value: fs.createReadStream(file.path),
                options: {
                    filename: file.name
                }
            };
        }  
    }

    if (method === 'OPTIONS'|| method === 'GET' || method === 'HEAD') {
        reqOptions.qs = dataToSend;
    } else if (req.is('urlencoded')) {
        reqOptions.form = dataToSend;
    } else if (req.is('multipart')) {
        reqOptions.formData = dataToSend;
    } else if (req.is('json')) {
        if (jsonDisabled) {
            reqOptions.form = dataToSend;
        } else {
            reqOptions.json = true;
            reqOptions.body = dataToSend;
        }
    } else {
        reqOptions.body = dataToSend;
    }
    
    const apiGateWayReq = request(reqOptions, function() {
        if (req.files) {
            _cleanTmpFile(req.files);
        }
    });
    apiGateWayReq.on('error', function(err) {
        slogger.error('request proxy http interface failed', err, reqOptions);
        if (err.code === 'ESOCKETTIMEDOUT' || err.code === 'ETIMEDOUT' ) { //request timeout
            return res.status(504).end('proxy ' + agentUrl +' timeout');
        }
        onError(err, agentUrl);
    });
    apiGateWayReq.pipe(res);
    
};
/** @module http-request-proxy */
/**
 * The express proxy middleware.
 * 
 * @param {PorxyOptionsInit} options
 */
module.exports = function doProxy(options) {
    options = Object.assign({}, DEFAULT_INIT_CONFIG, options || {});

    const urlsToProxy = options.urlsToProxy || {};
    const urlKeys = Object.keys(urlsToProxy);
    return function(req, res, next) {
        if (!urlKeys || !urlKeys.length) {
            return next();
        }
        checkUrl(req, urlsToProxy, urlKeys, function(err, backUrl) {
            if (err) {
                const path = req.path;
                slogger.error('proxy ' + path +' failed:', err);
                return res.status(502).end('proxy ' + path +' failed: ' + err);
            }
            if (!backUrl) {
                return next();
            }
            _doProxy(options, backUrl, req, res);
        });
    };
};
