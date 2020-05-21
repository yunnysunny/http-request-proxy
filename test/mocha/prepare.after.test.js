const request = require('supertest');
const {expect} = require('chai');
const app = require('../express/src/app_prepare');
const {HEADER_SEQ_NUM} = require('../express/src/config');

describe('prepare after parser test#', function() {
    it('should proxy request with data prepare success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };
        request(app)
            .post('/i/back/verify')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('result').and.equal(true);

                done();
            });
    });

    it('should proxy request with header prepare success', function(done) {
        const NUM = 2;

        request(app)
            .post('/i/back/seq-increase')
            .type('form')
            .set(HEADER_SEQ_NUM, NUM)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('num')
                    .and.equal(NUM + 1);

                done();
            });
    });

});

