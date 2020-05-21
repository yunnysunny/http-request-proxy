const express = require('express');
const slogger = require('node-slogger');
const multipart = require('connect-multiparty');
const router = express.Router();
const {verifySign} = require('../helpers/auth_helper');
const {HEADER_SEQ_NUM,HEADER_REQ_NUM} = require('../config');

const multipartMiddleware = multipart();
/*  */
router.all('/get', function(req, res) {
    res.send(req.query);
});
router.post('/post',function(req, res) {
    res.send(req.body);
});

router.all('/restful',function(req, res) {
    res.send(req.body);
});

router.post('/upload', multipartMiddleware, function(req,res) {
    res.send(req.body);
});

router.post('/verify', function(req, res) {
    var result = verifySign(req.body);
    res.send({result});
});

router.post('/seq-increase', function(req, res) {
    res.send({num: Number(req.get(HEADER_SEQ_NUM))});
});

router.get('/timeout', function(req, res) {
    const timeout = Number(req.query.timeout) || 0;
    slogger.info(HEADER_REQ_NUM,req.get(HEADER_REQ_NUM),timeout);
    setTimeout(function() {
        res.send({ok:true});
    }, timeout);
});

router.get('/error', function(req, res) {
    throw new Error('trigger an error');
});

module.exports = router;
