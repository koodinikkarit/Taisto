var port = 1337;
var sourceCount = 16;

var states = [];

//setting default states
states[1] = 1;
states[2] = 2;
states[7] = 2;

var request = require('request');
var express = require('express');
var bodyParser = require('body-parser')
var http = require('http');
// var Matti = require("./Matti.js/Matrix")(1, "192.168.180.98", 5555);
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

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

app.get('/api/matrixs', function(req, res) {

});

app.post('/api/creatematrix', function (req, res) {

});

app.put('/api/updatematrix', function (req, res) {

});

app.delete('/api/deletematrix', function (req, res) {

});

io.on('connection', function(socket){
	socket.emit('updatestates', {states : states});	
	socket.on('setstate', function(data){
		console.log('sending request to set '+data.source+ ' -> ' + data.ending);
		doTheGetRequest(data.source, data.ending, socket);
	});
	
	socket.on('update', function() {
		Matti.getAllValues();
	});
});

// Matti.newVideoState = function (con, cpu) {
// 	console.log("new video state con " + con + " " + cpu);
// 	states[con] = cpu;
// 	io.emit('updatestates', {states : states});
// }

// Matti.setNewVideoConnectionCallback(function(cpu, con) {
// 	console.log("cpu " + cpu + " con " + con);
// 	states[con] = cpu;
// 	io.emit('updatestates', {states : states});
// });

// Matti.setNewKwmConnectionCallback(function(con, cpu) {
	
// });

function doTheGetRequest(source, end){
	console.log("source " + source, " end " + end);
	console.log('switch '+source+' -> '+end+' succesful');
	states[end] = source;
	io.emit('updatestates', {states : states});
	// Matti.setVideoConnection(source, end, function(data) {
	// 	console.log(data);
	// });
	Matti.setVideoConnection(source, end);
	// request.get({
	// 	url : 'http://192.168.180.21:8080/set',
	// 	qs : {con : end, cpu : source}
	// }, function(error, response, body){
	// 	if(!error && response.statusCode == 200){
	// 		console.log('switch '+source+' -> '+end+' succesful');
	// 		states[end] = source;
	// 		io.emit('updatestates', {states : states});
	// 	}
	// });
	
}


