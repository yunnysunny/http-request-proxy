const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const routes = require('./routes/index');

const {
    slogger,
    TIMEOUT_PROXY,
    NOT_SUPPORT_URL
} = require('./config');
const requestRecordFilter = require('@yunnysunny/request-logging');
const {filter: requestValidator} = require('validator-param');
const afterParserProxy = require('../../../lib/proxy');

const app = express();
app.enable('trust proxy');

app.set('port', 3003);

app.use(requestRecordFilter());
app.use(afterParserProxy({
    urlsToProxy:{
        '/i/back': function(req) {
            return new Promise(function(resolve, reject) {
                if (req.path ==='/i/back' + NOT_SUPPORT_URL) {
                    return reject('not support');
                }
                resolve('http://localhost:3004');
            });
        }
    },
    beforeParser: true,
    timeout: TIMEOUT_PROXY
}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));
app.use( multipart({}));


// app.use(modifyParser);
app.use(requestValidator({
    basePath: path.join(__dirname, './validators'),
    urlPrefix: '/i/',
    filenameReplaces: {
        '_': '/'
    },
    filenameSuffix: '_schema.js'
}));

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found:' + req.path);
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    const status = err.status;
    if (status === 404) {
        return res.status(404).send(err.message || '未知异常');
    }
    res.status(status || 500);
    slogger.error('发现应用未捕获异常', err);
    res.send({
        msg: err.message || '未知异常',
        code: 0xffff
    });
});


module.exports = app;
