var config = require('../config/config');
//var zerorpc = require('zerorpc');
var Promise = require('bluebird');

//var client = new zerorpc.Client();
//client.connect(config.zerorpc.connect);


module.exports.invoke = function *(msgObj) {
	return new Promise(function (resolve, reject) {
<<<<<<< Updated upstream
		client.invoke('job', msgObj, function(e, response, more) {
			resolve(JSON.parse(response));
		});
=======
		//client.invoke('job', msgObj, function(e, response, more) {
			resolve(null);
		//});
>>>>>>> Stashed changes
	});
	
}
