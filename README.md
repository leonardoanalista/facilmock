
facilmock
=========

Exposes an API to mock endpoints for Expressjs apps.

Once module added, it seats on front of every single request.
If `facilmock` can match the request `method` and `url` from mocked endpoints, it will return the `status code` and `response` pre configured.
If it can't match anyting, things will as usual like `facilmock` doens't even exist.


Useful for developers, Continous integration machines
Eg.:
While you are developing your code, you want your local app to on its best behave where services succeed.
However, when you write protractor E2E tests, you may want to test all possible unsuccessful scenarios. This is when you need `facilmock`.


## Installation

```sh
npm install facilmock --save-dev
```

## Usage


Assuming you already have your running and middlewares configured, all you need is load `facilmock` module:

```js
    var express = require('express');
    var app = express();

    //facilmock loaded at this point.
    var facilmock = require('../index')(app);

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


Don't forget if you are dealing with cross domain services, you may be interested in those lines too:
```js
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Method", "GET, PUT, POST, OPTIONS");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
```

Those are not part of this module and is totally related to your use case so add if and only if you need it.


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


## Contributing

Leonardo Correa

## Release History

* 0.0.1 Initial release -
