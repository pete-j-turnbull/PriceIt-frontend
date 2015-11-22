
//initialise page

var api_search = "http://178.62.70.112/features?params=";
var api_features = "http://178.62.70.112/price?params=";

function callApi(url, obj, callback){
	var queryString = url + encodeURIComponent(JSON.stringify(obj));
	$.get(queryString, callback);
}


$(document).ready(function(){
	//ui.togglePrice();
	ui.toggleResults();

	//Bind event handlers
	$('#search-box button').click(function(){
		ui.search.call(ui);
	});
	$('#features-box select').change(function(){
		ui.refine.call(ui);
	});

	$("#search-box input").keyup(function(event){
    if(event.keyCode == 13){
        $("#search-box button").click();
    }
});

	
});

var features = {
		prop1: {options: ['opt1', 'opt2', 'opt3']},
		prop2: {options: ['opt1', 'opt2', 'opt3']},
		prop3: {options: ['opt1', 'opt2', 'opt3']}
};


var price = {
	prices: {
		lower: 325,
		median: 370,
		upper: 393
	}
};




















/*

//Jquery Loading Wheel

var $loading = $('#loadingDiv').hide();
$(document).ajaxStart(function () {
	$loading.show();
})
.ajaxStop(function () {
	$loading.hide();
});

*/
