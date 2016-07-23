var Matrix = require("./Matti.js/Matrix");
var manager = require("./Matti.js/MattiManager")("10.1.1.10", "matti", "jaska");


manager.createToken("kameli38", function (token) {
	console.log("token lutu");
	token.createProfile("oletus", function (profile) {

	});
});