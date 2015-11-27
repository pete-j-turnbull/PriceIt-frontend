var config = require('../config/config');
var zerorpc = require('zerorpc');
var Promise = require('bluebird');

var client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

module.exports.invoke = function *(msgObj) {
    return new Promise(function (resolve, reject) {
	client.invoke('job', msgObj, function(e, response, more) {
            try {
	        resolve(JSON.parse(response));
	    } catch (err) {
                reject({ success: false, result: err });
            }
        });
    });
};
