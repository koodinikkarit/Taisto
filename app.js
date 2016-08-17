var Matrix = require("./Matti.js/Matrix");
var manager = require("./Matti.js/MattiManager")("10.1.1.10", "matti", "jaska");

manager.createMatrix("192.168.180.98", 5555, 16, 16);

manager.createAdmin("kameli38", function (token) {
	token.createProfile("oletus", function (profile) {
		profile.getMatrixs(function (matrixs) {
			//console.log(matrixs[0]);
			//console.log(matrixs[0].makeVideoConnection());
			matrixs[0].makeVideoConnection(3,12);
		});
	});
});