var fs = require('co-fs');
var config = require('./config/config');
var log = require('./utilities/logger');
var koa = require('koa');
var route = require('koa-route');
var cors = require('koa-cors');
var serve = require('koa-static-server');
var koaLogger = require('./utilities/koa-logger');

var app = module.exports = koa();
app.use(cors());
app.use(koaLogger());

app.use(serve({rootDir: 'static', rootPath: '/static'}));

app.use(route.get('/', main))
app.use(route.get('/features', getFeatures));
app.use(route.get('/price', getPrice));


function *main() {
	this.body = yield fs.readFile('./static/index.html', {encoding: 'utf8'})
}

function *getFeatures() {
	var params = JSON.parse(this.request.query.params);
	var searchTerm = params.searchTerm;

	var res = {features: { feature1: {options: ['option1', 'option2']}, feature2: {options: ['option1', 'option2']} }};
	log.info(res);
	this.body = res;
}

function *getPrice() {
	var params = JSON.parse(this.request.query.params);
	var searchTerm = params.searchTerm;
	var featureChoices = params.features;

	var res = {prices: {lower: 10, median: 15, upper: 20}};
	log.info(res);
	this.body = res;
}

function *getSearchSuggestions() {
	var res = {suggestions: ['a', 'b', 'c']};
	log.info(res);
	this.body = res;
}


if (!module.parent) app.listen(config.port);



/*
var zerorpc = require('zerorpc');
var client = new zerorpc.Client();
client.connect(config.zerorpc.connect);

client.invoke('job', {action: 'getFeatures', params: {}}, function(e, response, more) {
	log.info(response.result);
});
*/
