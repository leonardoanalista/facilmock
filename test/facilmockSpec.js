var facilmock = require('../index');
var should = require('chai').should();
var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');
var url = 'http://localhost:7777'


describe('#facilmock', function() {

  var server;

  before(function(done){
    var app = express();

    //facilmock loaded at this point.
    var facilmock = require('../index')(app);

    server = app.listen(7777, function () {
      console.log('>> Unit Test facilmock Express App for testing is running on http://%s:%s', server.address().address, server.address().port);
      done();
    });
  });

  after(function(done){
    server.close(function () {
      console.log(">> Closed facilmock express test app.");
      process.exit();
      done();
    });
  });

  it('mymock should start empty', function(done) {
    request(url).get('/getmocks')
      .end(function(err, res) {
        expect( JSON.stringify(res.body) ).to.equal('{}');
        expect(res.status).to.equal(200);
        done();
    });
  });//end it

  it('mymock should mock endpoint ', function(done) {
    var data = {
        "method": "GET",
        "url": "/api/users/address",
        "response": {
            "code": "200",
            "content": {
                "code": "1",
                "message": "Success"
              }
        }
    };

    request(url).post('/mockme')
      .send(data)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          expect(res.body['GET']['/api/users/address']['response']['code']).to.equal('200');
          expect(res.body['GET']['/api/users/address']['response']['content']['message']).to.equal('Success');

          request(url).post('/mockme')
            .send({'method': 'POST', 'url': '/post1', 'response': {'code': '200', 'content': {'nada': 'post1'} } })
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              expect(res.body['POST']['/post1']['response']['content']['nada']).to.equal('post1');
              done();
          });

      });

  });//end it


  it('mymock should respond to request correctly get', function(done) {
    request(url).get('/api/users/address')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.body.code).to.equal("1");
        expect(res.body.message).to.equal('Success');
        done();
      });
  });//end it


  it('mymock should respond to request correctly for post1', function(done) {
    request(url).post('/post1')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        expect(res.body.nada).to.equal('post1');
        expect(res.status).to.equal(200);
        done();
      });
  });//end it


  it('mymock should validate required field method', function(done) {
    request(url).post('/mockme')
      .end(function(err, res) {
        expect(res.text).to.equal('Error: where is the field method');
        expect(res.status).to.equal(403);
        done();
    });
  });//end it


  it('mymock should validate required field url', function(done) {
    request(url).post('/mockme')
      .send({'method': 'POST'})
      .end(function(err, res) {
        expect(res.text).to.equal('Error: where is the field "url"');
        expect(res.status).to.equal(403);
        done();
    });
  });//end it

  it('mymock should validate required field response', function(done) {
    request(url).post('/mockme')
      .send({'method': 'POST', 'url': '/someurl'})
      .end(function(err, res) {
        expect(res.text).to.equal('Error: where is the field response field containing code and content');
        expect(res.status).to.equal(403);
        done();
    });
  });//end it

  it('mymock should validate required field response.code', function(done) {
    request(url).post('/mockme')
      .send({'method': 'POST', 'url': '/someurl', 'response': {}})
      .end(function(err, res) {
        expect(res.text).to.equal('Error: where is the field "response.code"');
        expect(res.status).to.equal(403);
        done();
    });
  });//end it

  it('mymock should validate required field response.content', function(done) {
    request(url).post('/mockme')
      .send({'method': 'POST', 'url': '/someurl', 'response': {'code': '200'}})
      .end(function(err, res) {
        expect(res.text).to.equal('Error: where is the field "response.content"');
        expect(res.status).to.equal(403);
        done();
    });
  });//end it


  it('mymock should still have valid endpoints', function(done) {
    request(url).get('/getmocks')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.body['GET']['/api/users/address']['response']['code']).to.equal('200');
        expect(res.body['POST']['/post1']['response']['content']['nada']).to.equal('post1');
        done();
    });
  });//end it


  it('mymock should clear endpoints', function(done) {
    request(url).get('/resetmocks')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect( JSON.stringify(res.body) ).to.equal('{}');
        done();
    });
  });//end it


});
