const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const routes = require('./routes/index');

const {
    slogger,
    HEADER_SEQ_NUM,
    TIMEOUT_PROXY,
    HEADER_REQ_NUM
} = require('./config');
const requestRecordFilter = require('@yunnysunny/request-logging');
const {filter: requestValidator} = require('validator-param');
const afterParserProxy = require('../../../');
const {doSign} = require('./helpers/auth_helper');

const app = express();
app.enable('trust proxy');

app.set('port', 3003);
app.use(requestRecordFilter());

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));
app.use( multipart({}));
var num = 0;
app.use(afterParserProxy({
    urlsToProxy:{
        '/i/back': {
            url: 'http://localhost:3004',
            dataPrepare(data) {
                data.test_flag = 'abcdefg';
                data.sign = doSign(data);
                return data;
            }
        },
    },
    dataPrepare: function(data) {
        data.sign = doSign(data);
        return data;
    },
    headerPrepare: function(req) {
        return {
            [HEADER_SEQ_NUM]: Number(req.get(HEADER_SEQ_NUM)) + 1,
            [HEADER_REQ_NUM]: ++num
        };
    },
    timeout: TIMEOUT_PROXY
}));


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
