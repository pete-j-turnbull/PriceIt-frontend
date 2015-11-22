var fs = require('co-fs');
var config = require('./config/config');
var log = require('./utilities/logger');
var koa = require('koa');
var route = require('koa-route');
var cors = require('koa-cors');

var zerorpc = require('zerorpc');
var client = new zerorpc.Client();
client.connect(config.zerorpc.connect);

var app = module.exports = koa();
app.use(cors());

app.use(route.get('/features', getFeatures));
app.use(route.get('/price', getPrice));
app.use(route.get('/', main));
app.use(route.get('ui.js', uijs));
app.use(route.get('main.js', mainjs));

function *mainjs() {
	this.body = yield fs.readFile('./main.js', {encoding: 'utf8'});
	log.info(this.body);
}
function *uijs() {
	this.body = yield fs.readFile('./ui.js', {encoding: 'utf8'});
	log.info(this.body);
}

function *main() {
	this.body = yield fs.readFile('./index.html', {encoding: 'utf8'});
	log.info(this.body);
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
client.invoke('job', {action: 'getFeatures', params: {}}, function(e, response, more) {
	log.info(response.result);
});
*/
