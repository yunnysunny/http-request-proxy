const request = require('supertest');
const {expect} = require('chai');
const slogger = require('node-slogger');
const app = require('../express/src/app_before_parser');
const {TIMEOUT_PROXY} = require('../express/src/config');

describe('prepare after parser test#', function() {
    it('should get the response in timemout', function(done) {
        const data = {
            timeout: TIMEOUT_PROXY + 1000,
        };
        slogger.debug('begin request timeout');
        request(app)
            .get('/i/back/timeout')
            .query(data)
            .expect(504)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                // console.log(res.body);

                // expect(res.body).to.have.property('ok').and.equal(true);

                done();
            });
    });

    it('should get response when backend failed', function(done) {
        const data = {
        };
        slogger.debug('begin request timeout');
        request(app)
            .get('/i/back/error')
            .query(data)
            .expect(500)
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

