const request = require('supertest');
const {expect} = require('chai');
const app = require('../express/src/app_custom_options');

describe('custom options parser test#', function() {
    it('should proxy custom options success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };
        request(app)
            .get('/i/back/custom')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('test_flag').and.equal('abcdefg');

                done();
            });
    });
});

