
//initialise page
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var api_search = "/features?params=";
var api_features = "/price?params=";

function callApi(url, obj, callback){
	var queryString = url + encodeURIComponent(JSON.stringify(obj));
	$.get(queryString, function(jsonData) {
		var data = JSON.parse(jsonData);
		callback(data);
	});
}

function bindAnimate(targetElement, animation, element, eventType){
	if(eventType == 'click'){
		$(element).click(function(){
			animate(targetElement, animation);
		});
	}
	else {
		$(element).change(function(){
			animate(targetElement, animation);
		});
	}
}

function animate(targetElement, animation){
	var className = "animated " + animation
	$(targetElement).addClass(className).one(animationEnd, function(){
		$(this).removeClass(className);
	});
}

var autoSuggestControl = {
	hidden: true,
	currentSuggestion: null,
	highlight: function(node){
		$('#suggested-box p').removeClass('selected');
		$(node).addClass('selected');
	},
	navigate: function(event){

		var direction = autoSuggestControl.getDirection(event);
		
		if(direction == 'up'){
			var current = $('p.selected')[0];
			if(current){
				var next = $(current).prev()[0];
				autoSuggestControl.highlight(next);
			}
		}
		else if (direction == 'down'){
			var current = $('p.selected')[0];
			if(current){
				var next = $(current).next()[0];
				if(next){
					autoSuggestControl.highlight(next);
				}
			}
			else {
				var next = $('#suggested-box p')[0];
				if(next){
					autoSuggestControl.highlight(next);
				}
			}
		}
	},
	toggleSuggestions: function(){
		if(this.hidden){
			$('#suggested-box').show();
			this.hidden = false;
		}
		else {
			$('#suggested-box').hide();
			this.hidden = true;
		}
	},
	hover: function(event){
		autoSuggestControl.highlight(event.target);
	},
	getDirection: function(event){
		if(event.keyCode == 40){
			return 'down';
		}
		else if(event.keyCode == 38){
			return 'up';
		}
	},
	getSuggestions: function(){
		
	},
	buildList: function(suggestions){

	}
}



$(document).ready(function(){
	ui.toggleResults();

	//Bind event handlers
	$('#search-box button').click(function(){
		ui.search.call(ui);
	});
	$('#features-box select').change(function(){
		ui.refine.call(ui);
	});

	//Bind keyup event handler to search box
	$("#search-box input").keyup(function(event){
		if(event.keyCode == 13){
			$("#search-box button").click();
		}
	});


	$("#search-box input").keyup(autoSuggestControl.navigate);
	$("#suggested-box p").hover(autoSuggestControl.hover);


});












