var http = require('http');
var fs = require('fs');
var express = require('express');
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
  beam(request.body);
  response.sendStatus(200);
});

// doc end point
app.post('/doc', parseUrlencoded, function(request, response) {
  console.log('doc: ' + JSON.stringify(request.body));
  var docUrl = request.body.url;
  var tempName = 'temp_' + Date.now() + '.pdf';
  var tempFile = __dirname + '/public/' + tempName;
  var tempStream = fs.createWriteStream(tempFile);
  tempStream.on('close', function() {
    console.log('file dl done');
    var stat = fs.statSync(tempFile);
    console.log('file size: ' + stat.size);
    var data = '<iframe src = "/ViewerJS/#../' + tempName + '" allowfullscreen webkitallowfullscreen></iframe>'
    beam({data: data, type: 'html'});
  });
  // request('http://epa.org.kw/Portals/0/sample.pdf').pipe(tempStream);
  http.get(docUrl, function(res) {
    res.pipe(tempStream);
  });
  response.sendStatus(200);
});

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
