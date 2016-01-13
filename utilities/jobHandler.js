var config = require('../config/config');
var jackrabbit = require('jackrabbit');
var Promise = require('bluebird');
var log = require('./logger');


var rabbit = jackrabbit('amqp://guest:guest@127.0.0.1:5672/')
    .on('connected', function () {
        log.info('RabbitMQ connected');
    })
    .on('error', function (err) {
        log.error('RabbitMQ ' + err);
    })
    .on('disconnected', function () {
        log.error('RabbitMQ disconnected');
    });
var exchange = rabbit.default();
var rpc = exchange.queue({ name: 'rpcQueue', prefetch: 1, durable: false });


module.exports.invoke = function (action, params) {
    return new Promise(function (resolve, reject) {
        exchange.publish({ action: action, params: params }, {
            key: 'rpcQueue',
            reply: function (data) {
                resolve(data);
            }
        });
    });
};

