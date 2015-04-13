var http = require('http');
var fs = require('fs');
var express = require('express');
var httpRequest = require('request');
var app = express();
var socket = require('socket.io');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var client = null;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/', express.static('public'));

// beam end point
app.post('/beam', parseUrlencoded, function(request, response) {
  var target = request.body.target;
  launchWebApp(target, 'http://' + request.get('host'));

  if (request.body.type == 'pdf') {
    processPdf(request.body.url);
  } else {
    beam(request.body);
  }

  response.sendStatus(200);
});

// download pdf to a temp loc
var processPdf = function(docUrl) {
  console.log('processPdf: ' + docUrl);
  var tempName = 'temp_' + Date.now() + '.pdf';
  var tempFile = __dirname + '/public/' + tempName;
  var tempStream = fs.createWriteStream(tempFile);
  tempStream.on('close', function() {
    var stat = fs.statSync(tempFile);
    console.log('File Download done: ' + stat.size);
    var data = '<iframe src = "/ViewerJS/#../' + tempName + '" allowfullscreen webkitallowfullscreen></iframe>'
    beam({data: data, type: 'doc'});
  });
  httpRequest(docUrl).pipe(tempStream);
  // http.get(docUrl, function(res) {
  //   res.pipe(tempStream);
  // });
};

// init http
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Listening on ' + port + '...');
});

// init ws
var io = socket.listen(server);
io.on('connection', function(client) { // io.sockets.on(...) also works?
  console.log('Client connected...');
  client.emit('message', {message: 'Hello'});
});

var beam = function(msg) {
  console.log('Server Beaming: ' + JSON.stringify(msg));
  io.sockets.emit('message', msg);
}

// launch a url on target
var launchWebApp = function(target, launchUrl) {
  console.log('launchWebApp: ' + target + ' -> ' + launchUrl);
  httpRequest.post({
    uri: 'http://' + target + '/api/v2/webapplication/',
    json: { "url" : launchUrl }},
    function (error, response, body) {
      if (error) { 
        console.log('Error: ' + error);
      } else {
        console.log('Status: ' + response.status);
      }
    }
  );
}
