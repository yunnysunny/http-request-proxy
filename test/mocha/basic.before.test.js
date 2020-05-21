const request = require('supertest');
const {expect} = require('chai');
const path = require('path');
const app = require('../express/src/app_before_parser');

describe('basic after parser test#', function() {
    it('should proxy get request success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };
        request(app)
            .get('/i/back/get')
            .query(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('rand').and.equal(rand+'');

                done();
            });
    });

    it('should proxy form request success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };

        request(app)
            .post('/i/back/post')
            .send(data).type('form')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('rand')
                    .and.equal(rand+'');

                done();
            });
    });

    it('should proxy json request success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };

        request(app)
            .post('/i/back/post')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('rand')
                    .and.equal(rand);

                done();
            });
    });

    it('should proxy put request success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };

        request(app)
            .put('/i/back/restful')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('rand')
                    .and.equal(rand);

                done();
            });
    });

    it('should proxy delete request success', function(done) {
        const rand = Math.random();
        const data = {
            rand,
        };

        request(app)
            .del('/i/back/restful')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('rand')
                    .and.equal(rand);

                done();
            });
    });


    it('should proxy upload request success', function(done) {
        const rand = Math.random() + '';
        request(app)
            .post('/i/back/upload')
            .field('rand',rand)
            .attach('my_file', path.join(__dirname, '../files/test.txt'))
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body);
                expect(res.body).to.have.property('rand').and.equal(rand);

                done();
            });
    });

    
});

