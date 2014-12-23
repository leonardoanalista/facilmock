'use strict';

/*
=====================================

API:
- POST JSON to /mockme;     return json with all stubbed end-points.
- GET       to /getmocks;   return json with all stubbed end-points.
- GET       to /resetmocks; clear up mocked endpoint and return the current adn empty json object.

Usage Example:
Post this json to /mockme
 {
    "method": "GET",
    "url": "/banking/nab/tandc/accounting/xero",
    "response": {
        "code": "403",
        "content": {
            "errorMessage": "T and C unavaialble"
        }
 }
Now go ahead and go to account list page. Inspect network activity on chrome dev tools to confirm response.

For any incoming, Express Stub will first look at the mocked endpoints.
If a method and url can be matched, this mock will return the response code and response previously configured.

=====================================
*/
module.exports = function(app) {

  console.info('\n\n >> Just load mymock.js module...');

  var bodyParser = require('body-parser');

  var stubs = {};
  var jsonParser = bodyParser.json();

  //tries to match a  stubbed endpoint
  app.all('/*', function(req, res, next) {
    //console.info('>> some request : ', req.url, req.method);

    if(stubs[req.method]){
      //console.info('\n\n >>> STUB MOCK just matched method ' + req.method + ' for url: ' + req.url);
      if(stubs[req.method][req.url]){

        console.info('\n\n >>> GREAT! STUB MOCK just matched your request to ' + req.url);

        var statusCode = stubs[req.method][req.url].response.code;
        var responseContent = stubs[req.method][req.url]['response']['content'];

        return res.status(statusCode).json(responseContent);
      }
    }

    next();
  });

  //returns a JSON with the all stubbed content.
  app.post('/mockme', jsonParser, function(req, res, next) {

    if(req.body.method === undefined){
      res.status(403).send('Error: where is the field method');
      return;
    }
    if(req.body.url === undefined){
      res.status(403).send('Error: where is the field "url"');
      return;
    }
    if(!req.body.response){
      res.status(403).send('Error: where is the field response field containing code and content');
      return;
    }
    if(req.body.response.code === undefined){
      res.status(403).send('Error: where is the field "response.code"');
      return;
    }
    if(req.body.response.content === undefined){
      res.status(403).send('Error: where is the field "response.content"');
      return;
    }

    console.info('>> Set up mock for url: ', req.body.method, req.body.url);

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
