var fs = require('co-fs');
var config = require('./config/config');
var log = require('./utilities/logger');
var koa = require('koa');
var route = require('koa-route');
var cors = require('koa-cors');
var serve = require('koa-static-server');
var koaLogger = require('./utilities/koa-logger');

// Connection to worker
var jobHandler = require('./utilities/jobHandler');

// App config
var app = module.exports = koa();
app.use(cors());
app.use(koaLogger());
app.use(serve({rootDir: 'static', rootPath: '/static'}));

// Routes
app.use(route.get('/', main))
app.use(route.get('/features', getFeatures));
app.use(route.get('/price', getPrice));
app.use(route.get('/suggestions', getSearchSuggestions));


function *main() {
	this.body = yield fs.readFile('./static/index.html', {encoding: 'utf8'})
}

function *getFeatures() {
	var params = JSON.parse(this.request.query.params);
	log.debug(params);
	var searchTerm = params.searchTerm;

	var response = yield jobHandler.invoke({action: 'getFeatures', params: {}});
	log.info(response);

	var res = {features: { feature1: {options: ['option1', 'option2']}, feature2: {options: ['option1', 'option2']} }};
	this.body = res;
}

function *getPrice() {
	var params = JSON.parse(this.request.query.params);
	log.debug(params);
	var searchTerm = params.searchTerm;
	var features = params.features;

	var response = yield jobHandler.invoke({action: 'getPrices', params: {searchTerm: searchTerm, features: features}})
	this.body = response;
}

function *getSearchSuggestions() {
	var params = JSON.parse(this.request.query.params);
	log.debug(params);
	var searchTerm = params.searchTerm;
	var response = yield jobHandler.invoke({action: 'autoSuggest', params: {searchTerm: searchTerm}})
	this.body = response;
}


if (!module.parent) app.listen(config.port);

