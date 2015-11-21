var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();

app.use(route.get('/features/:searchTerm', getFeatures));  
app.use(route.get('/price/:searchTerm', getPrice));

function *getFeatures(searchTerm) {
	var res = {searchTerm: searchTerm, features: { feature1: {options: []}, feature2: {options: []} }};
	console.log(res);
	this.body = res;
}

function *getPrice(searchTerm) {
	var res = {searchTerm: searchTerm, price: 10};
	console.log(res);
	this.body = res;
}

function *getSearchSuggestions(term) {
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