
facilmock
=========

Exposes an API to mock endpoints for ExpressJS apps. It is a handy way to temporarily change the behavior of your mocked service calls.


[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Build Status](https://travis-ci.org/leonardoanalista/facilmock.svg)](https://travis-ci.org/leonardoanalista/facilmock) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![codecov.io](https://codecov.io/github/leonardoanalista/facilmock/coverage.svg?branch=master)](https://codecov.io/github/leonardoanalista/facilmock?branch=master) [![npm monthly downloads](https://img.shields.io/npm/dm/facilmock.svg?style=flat-square)](https://www.npmjs.com/package/facilmock)



## Useful for developers, Continous integration. Use case:

- You stubbed your backend with an ExpressJS app. You have a service that returns `200, {name: 'Leonardo'}`. You wish to simulate a failure scenario for the first call `500, {error: 'server is down. Click here to retry.'}`. Now you want the service call to return a success for a `retry()` or any subsequent calls.

- in summary, `facilmock` can temporary change the behavior of a service call via REST API call to your own stub ExpressJS. When you wish you can again, via REST API call, `reset` all tempory behavior. Please refer to exmaples bellow.
 
## How it works

Once module added, it seats in front of every request to your [expressJS](http://expressjs.com/) app.

If `facilmock` can match the request `method` and `url` from mocked endpoints, it will return the `status code` and `response` pre configured by you.

When `facilmock` can't match anyting, things will as usual like `facilmock` doens't even exist.


## Installation

```sh
npm install facilmock --save-dev
```

*This module is appropriated for development use only.*

## Usage


Assuming you already have your running and middlewares configured, all you need is load `facilmock` module:

```js
    var express = require('express');
    var app = express();

    //facilmock loaded at this point.
    var facilmock = require('facilmock')(app);

    //existing mocked endpoint
    app.get('/api/get-user-info', function(req, res) {
      res.json('{"name": "leonardo correa"}').status(200);
    });

    //more endpoints here...

    server = app.listen(7777, function () {
      console.log('>>> Express App is running on http://%s:%s', server.address().address, server.address().port);
      done();
    });
```

Facilmock is just a couple of expressjs middlewares. So order here matters as any expressjs app.
Assuming you are using this module from your test, you now need to stub your endpoints:

```js
  var request = require('supertest');
  var url = 'http://localhost:7777'
  request(url).post('/mockme')
    .send({'method': 'GET', 'url': '/api/get-user-info', 'response': {'code': '200', 'content': {'name': 'some other name'} } })
    .end(function(err, res) {
      done();
  });
```

Or test this service failure:

```js
  var request = require('supertest');
  var url = 'http://localhost:7777'
  request(url).post('/mockme')
    .send({'method': 'GET', 'url': '/api/get-user-info', 'response': {'code': '400', 'content': 'invalid request or server is down' } })
    .end(function(err, res) {
      done();
  });
```
Note I am using [supertest](https://github.com/tj/supertest) to perform the request against `facilmock`


Don't forget: if you are dealing with cross domain services calls, you may be interested in those lines too:
```js
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Method", "GET, PUT, POST, OPTIONS");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
```

Those are *not* part of this module and is totally related to your use case. So add those lines to your ExpressJS app if this is your case.


## Facilmock API
`facilmock` has only three methods on the API and they are extremelly intuitive:
```js
- POST a JSON to /mockme;       return json with all stubbed end-points.
- GET         to /getmocks;     return json with all stubbed end-points.
- GET         to /resetmocks;   clear up mocked endpoint and return the current adn empty json object.
```

## Tests

```js
  npm test
```

## About this

There are lots of further features that could be implemented. However `facilmock` solves my problem at the moment.
If you need anyting more sofisticated, feel free to send me a pull request. This package is not supposed to replace any other testing framework. 

## Contributing


Leonardo Correa

## Release History

* 0.0.1 Initial release -
