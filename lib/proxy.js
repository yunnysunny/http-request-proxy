const slogger = require('node-slogger');
const request = require('request');
const http = require('http');
const https = require('https');
const fs = require('fs');
// const {checkUrl, optionProcess} = require('./util');

const checkUrl = function(url, urlsToProxy, urlKeys) {
    const prefix = urlKeys.filter(agentUrl => url.startsWith(agentUrl))[0];
    if (prefix) {
        const needAgentHost = urlsToProxy[prefix];
        url = url.slice(prefix.length);
        return needAgentHost + url;
    }
    return null;
};
/**
 * @function DataPrepareFunction
 * 
 * @param {Object} data The original request data, merged by querystring and body.
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
 * @typedef {Object} PorxyOptionsInit
 * 
 * The options for proxy request
 * 
 * @property {Object<String,String>=} urlsToProxy The map of url prefix and backend base url.
 * @property {ProxyOnErrorCallback=} onError
 * @property {DataPrepareFunction=} dataPrepare
 * @property {HeaderPrepareFunction=} headerPrepare
 * @property {Boolean=} beforeParser
 * @property {Number} [timeout=10000]
 */

/**
 * @typedef {Object} PorxyOptionsProcessed
 * @private
 * The options after processed
 * 
 * @property {Object<String,String>} urlsToProxy 
 * @property {ProxyOnErrorCallback} onError
 * @property {DataPrepareFunction} dataPrepare
 * @property {HeaderPrepareFunction} headerPrepare
 * @property {String[]} urlKeys
 * @property {Boolean=} beforeParser
 * @property {Number} [timeout=10000]
 */

/**
 * @private
 * @param {PorxyOptionsInit} options
 * @returns {PorxyOptionsProcessed}
 */
const optionProcess = function(options) {
    const urlsToProxy = options.urlsToProxy || {};
    const onError = options.onError || function(err, agentUrl) {
        
    };
    const dataPrepare = options.dataPrepare || function(data) {
        return data;
    };
    const urlKeys = Object.keys(urlsToProxy);
    // eslint-disable-next-line no-unused-vars
    const headerPrepare = options.headerPrepare || function(req) {
        return {};
    };
    const timeout = options.timeout || 10000;
    return {urlsToProxy, onError, dataPrepare, urlKeys, headerPrepare, timeout};
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
/** @module http-request-proxy */
/**
 * The express proxy middleware.
 * 
 * @param {PorxyOptionsInit} options
 */
module.exports = function doProxy(options) {
    options = options || {};
    const {
        urlKeys, urlsToProxy, dataPrepare, timeout, onError, headerPrepare
    } = optionProcess(options);

    return function(req, res, next) {
        const path = req.originalUrl;
        if (!urlKeys || !urlKeys.length) {
            return next();
        }
        const agentUrl = checkUrl(path, urlsToProxy, urlKeys);
        if (!agentUrl) {
            return next();
        }
        const {query, body, method} = req;

        const reqOptions = {
            url: agentUrl,
            method,
            headers: {},
            timeout
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

        const dataToSend = dataPrepare(data);
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
            // reqOptions.qs = dataToSend;
        } else if (req.is('urlencoded')) {
            reqOptions.form = dataToSend;
        } else if (req.is('multipart')) {
            reqOptions.formData = dataToSend;
        } else if (req.is('json')) {
            reqOptions.json = true;
            reqOptions.body = dataToSend;
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
    
};
