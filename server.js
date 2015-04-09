var express = require('express');
var app = express();
var socket = require('socket.io');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var client = null;

app.use('/', express.static('public'));

// beam
app.post('/beam', parseUrlencoded, function(request, response) {
  console.log('Beam: ' + JSON.stringify(request.body));
  io.sockets.emit('message', request.body);
  response.sendStatus(200);
});

// http
var server = app.listen(80, function() {
  console.log('Listening on 80...')
});

var io = socket.listen(server);
io.on('connection', function(client) { // io.sockets.on(...) also works?
  console.log('Client connected...');
  client.emit('message', {message: 'Hello'});

  // send heart beat
  // setInterval(function() {
  //   data = { value: Math.floor(Math.random()*100), created_at: Date.now() }
  //   client.emit('messages', data);
  // }, 5000);
});
