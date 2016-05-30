var port = 1337;
var sourceCount = 16;

var states = [];

//setting default states
states[1] = 1;
states[2] = 2;
states[7] = 2;

var request = require('request');
var express = require('express');
var http = require('http');
var app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));

var io = require('socket.io').listen(app.listen(port));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/api', function(req, res){
	var cpu = req.query.cpu;
	var con = req.query.con;
	console.log('new /api request, source = '+cpu+', end = '+con);

	if(cpu >= 0 && cpu < sourceCount && con >= 0){
		doTheGetRequest(cpu, con);
		res.render('apisuccess');
	} else {
		console.log('/api request failed. Invalid attributes.');
		res.render('apifail');
	}

});

io.on('connection', function(socket){
	console.log('new connection');
	socket.emit('updatestates', {states : states});

	socket.on('setstate', function(data){
		console.log('sending request to set '+data.source+ ' -> ' + data.ending);
		doTheGetRequest(data.source, data.ending, socket);
	});
});



function doTheGetRequest(source, end){
	request.get({
		url : 'http://192.168.180.21:8080/set',
		qs : {con : end, cpu : source}
	}, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log('switch '+source+' -> '+end+' succesful');
			states[end] = source;
			io.emit('updatestates', {states : states});
		}
	});
	
}


