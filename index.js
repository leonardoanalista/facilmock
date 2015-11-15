'use strict';


module.exports = function(app) {

  console.info('>> Just load facilmock module...');

  var bodyParser = require('body-parser');

  var stubs = {};
  var jsonParser = bodyParser.json();

  //tries to match a  stubbed endpoint
  app.all('/*', function(req, res, next) {

    if (stubs[req.method]) {
      if (stubs[req.method][req.url]) {

        console.info('>> facilmock just matched your request to ' + req.url, req.method);

        var statusCode = stubs[req.method][req.url].response.code;
        var responseContent = stubs[req.method][req.url]['response']['content'];

        return res.status(statusCode).json(responseContent);
      }
    }

    next();
  });

  //returns a JSON with the all stubbed content.
  app.post('/mockme', jsonParser, function(req, res, next) {

    if (req.body.method === undefined) {
      res.status(403).send('Error: where is the field method');
      return;
    }
    if (req.body.url === undefined) {
      res.status(403).send('Error: where is the field "url"');
      return;
    }
    if (!req.body.response) {
      res.status(403).send('Error: where is the field response field containing code and content');
      return;
    }
    if (req.body.response.code === undefined) {
      res.status(403).send('Error: where is the field "response.code"');
      return;
    }
    if (req.body.response.content === undefined) {
      res.status(403).send('Error: where is the field "response.content"');
      return;
    }

    console.info('>> facilmock set up mock for url: ', req.body.method, req.body.url);

    stubs[req.body.method] = {};
    stubs[req.body.method][req.body.url] = {'response': req.body.response};
    res.json(stubs);
  });

  //returns all the mocked endpoints
  app.get('/getmocks', jsonParser, function(req, res, next) {
    console.info('>> getmocks...', stubs);
    res.json(stubs);
  });

  //returns all the mocked endpoints
  app.get('/resetmocks', jsonParser, function(req, res, next) {
    stubs = {};
    res.json(stubs);
  });

};
