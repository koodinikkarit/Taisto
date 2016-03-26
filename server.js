var port = 1337;
var sourceCount = 16;

var states = [];
states[0] = 5;

var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));

var io = require('socket.io').listen(app.listen(port));

app.get('/', function(req, res){
	res.render('index');
});

io.on('connection', function(socket){
	console.log('new connection');
	socket.emit('updatestates', {states : states});

	socket.on('setstate', function(data){
		console.log('state set: '+data.source+ ' -> ' + data.ending);
		states[data.source] = data.ending;
		io.emit('updatestates', {states:states});
	});
});


