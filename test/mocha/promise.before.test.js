const request = require('supertest');
const {expect} = require('chai');
const slogger = require('node-slogger');
const app = require('../express/src/app_promise');
const {TIMEOUT_PROXY, NOT_SUPPORT_URL} = require('../express/src/config');

describe('prepare after parser test#', function() {
    it('should get 502 when promise reject', function(done) {
        const data = {
            timeout: TIMEOUT_PROXY + 1000,
        };
        slogger.debug('begin request timeout');
        request(app)
            .get('/i/back' + NOT_SUPPORT_URL)
            .query(data)
            .expect(502)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                // console.log(res.body);

                // expect(res.body).to.have.property('ok').and.equal(true);

                done();
            });
    });

    it('should get 200 when promise ok', function(done) {
        const data = {
        };
        slogger.debug('begin request timeout');
        request(app)
            .get('/i/back/get')
            .query(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                // console.log(res.body);

                // expect(res.body).to.have.property('ok').and.equal(true);

                done();
            });
    });

    

});

