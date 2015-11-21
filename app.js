var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();

app.use(route.get('/features', getFeatures));
app.use(route.get('/price', getPrice));


function *getFeatures() {
	var params = JSON.parse(this.request.query.params);
	var searchTerm = params.searchTerm;

	var res = {features: { feature1: {options: []}, feature2: {options: []} }};
	console.log(res);
	this.body = res;
}

function *getPrice() {
	var params = JSON.parse(this.request.query.params);
	var searchTerm = params.searchTerm;
	var featureChoices = params.features;

	var res = {prices: {lower: 10, median: 15, upper: 20}};
	console.log(res);
	this.body = res;
}

function *getSearchSuggestions() {
	var res = {suggestions: ['a', 'b', 'c']};
	console.log(res);
	this.body = res;
}


/*app.get('/book/:title', function(req, res) {
  title = decodeURI(req.params.title);
  book.find({title: title}, function(error, book) {
    res.send(book);
  });
});*/

if (!module.parent) app.listen(8880);