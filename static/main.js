
//initialise page
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var api_search = "/features?params=";
var api_features = "/price?params=";
var api_suggest = "/suggestions?params=";

function callApi(url, obj, callback){
	console.log('callAPI called...');
	console.log(obj);
	var queryString = url + encodeURIComponent(JSON.stringify(obj));
	$.get(queryString, function(jsonData) {
		var data = JSON.parse(jsonData);
		console.log(data);
		callback(data.result);
	});
}

function animate(targetElement, animation){
	var className = "animated " + animation
	$(targetElement).addClass(className).one(animationEnd, function(){
		$(this).removeClass(className);
	});
}


$(document).ready(function(){

	//Hide lowerpage & loading animation
	ui.toggleLower();
	ui.toggleLoading();
	
	//bind relevant event handlers to search-box components.
	ui.initializeSearch();

	//bind event handlers to autoSuggestControl
	ui.autoSuggestControl.bindEvents();

	//prevent white space click from being triggered from search-box
	$('#search-box').click(function(event){
		event.stopPropagation();
	});



});

